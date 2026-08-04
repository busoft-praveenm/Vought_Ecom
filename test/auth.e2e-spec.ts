import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { clearDatabase } from './test-utils';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockVerifyToken: jest.SpyInstance;

  beforeAll(async () => {
    mockVerifyToken = jest.spyOn(FirebaseAuthGuard.prototype, 'verifyToken');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ 
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.dbUser = { id: 1, email: 'test@test.com' };
          return true;
        }
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(CACHE_MANAGER)
      .useValue({
        del: jest.fn(),
        store: { keys: jest.fn().mockResolvedValue([]) }
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    await prisma.roleDb.create({ data: { name: 'user' } });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should login and create a new user if not exists', async () => {
      mockVerifyToken.mockResolvedValue({
        uid: 'new-firebase-uid',
        email: 'newuser@test.com',
        name: 'New User'
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Authorization', 'Bearer valid_mock_token')
        .expect(201); // NestJS POST returns 201 by default unless HttpCode is set

      expect(res.body.message).toBe('Login Success');
      expect(res.body.user.email).toBe('newuser@test.com');
      
      const cookies = res.headers['set-cookie'];
      expect(cookies[0]).toMatch(/access_token=valid_mock_token;/);
      
      // Verify DB insertion
      const userInDb = await prisma.userDb.findUnique({ where: { email: 'newuser@test.com' }});
      expect(userInDb).toBeDefined();
      expect(userInDb!.firebaseUid).toBe('new-firebase-uid');
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should clear access_token cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(201);

      expect(res.body.message).toBe('Logout Success');
      const cookies = res.headers['set-cookie'];
      expect(cookies[0]).toMatch(/access_token=;/);
    });
  });

  describe('/auth/me (GET)', () => {
    it('should return current user profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .expect(200);

      expect(res.body.message).toBe('Success');
      expect(res.body.user.id).toBe(1);
      expect(res.body.user.email).toBe('test@test.com');
    });
  });

  describe('/auth/profile (PUT)', () => {
    it('should update user profile', async () => {
      // Create user with ID 1 so it exists for the updateProfile method
      const userRole = await prisma.roleDb.findFirst({ where: { name: 'user' } });
      await prisma.userDb.create({
        data: {
          id: 1,
          email: 'test@test.com',
          userUid: 'uid1',
          firebaseUid: 'fuid1',
          roleId: userRole!.id
        }
      });

      const res = await request(app.getHttpServer())
        .put('/auth/profile')
        .send({ firstName: 'Updated' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.user.profile.firstName).toBe('Updated');
    });
  });
});
