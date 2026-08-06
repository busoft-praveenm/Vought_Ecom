import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { clearDatabase } from './test-utils';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { UserStatus } from '@prisma/client';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUser: any;
  let adminUser: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);

    // Seed roles
    const adminRole = await prisma.roleDb.create({ data: { name: 'admin' } });
    const userRole = await prisma.roleDb.create({ data: { name: 'user' } });

    // Seed users
    adminUser = await prisma.userDb.create({
      data: {
        email: 'admin@vought.com', // Assuming this matches ADMIN_EMAIL in .env.test if it exists
        userUid: 'admin-uid',
        firebaseUid: 'admin-firebase',
        roleId: adminRole.id,
      }
    });

    testUser = await prisma.userDb.create({
      data: {
        email: 'test@user.com',
        userUid: 'test-uid',
        firebaseUid: 'test-firebase',
        roleId: userRole.id,
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users/customers (GET)', () => {
    it('should return paginated customers', () => {
      return request(app.getHttpServer())
        .get('/users/customers?page=1&limit=10')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBe(2);
          expect(res.body.total).toBe(2);
        });
    });
  });

  describe('/users/:id/status (PATCH)', () => {
    it('should update user status successfully', () => {
      return request(app.getHttpServer())
        .patch(`/users/${testUser.id}/status`)
        .send({ status: UserStatus.INACTIVE })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(UserStatus.INACTIVE);
        });
    });

    it('should return 404 when updating a non-existent user', () => {
      return request(app.getHttpServer())
        .patch('/users/99999/status')
        .send({ status: UserStatus.INACTIVE })
        .expect(404);
    });
  });
});
