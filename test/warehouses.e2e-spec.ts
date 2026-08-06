import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { clearDatabase } from './test-utils';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

describe('WarehousesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/warehouses (GET)', () => {
    it('should return empty list when no warehouses exist', () => {
      return request(app.getHttpServer())
        .get('/warehouses')
        .expect(200)
        .expect([]);
    });
  });

  describe('Warehouse Flow (POST -> GET -> PATCH -> DELETE)', () => {
    it('should run through the complete flow', async () => {
      // Create
      const createRes = await request(app.getHttpServer())
        .post('/warehouses')
        .send({ name: 'Central Warehouse', lat: 40.7128, lng: -74.0060 })
        .expect(201);
      
      const warehouseId = createRes.body.id;

      // Get All
      await request(app.getHttpServer())
        .get('/warehouses')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(warehouseId);
        });

      // Get One
      await request(app.getHttpServer())
        .get(`/warehouses/${warehouseId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(warehouseId);
        });

      // Update
      const putRes = await request(app.getHttpServer())
        .put(`/warehouses/${warehouseId}`)
        .send({ processingTimeHours: 12 });
      
      if (putRes.status !== 200) {
        console.error('PUT Failed:', putRes.status, putRes.text);
      }
      expect(putRes.status).toBe(200);
      expect(putRes.body.processingTimeHours).toBe(12);

      // Delete
      await request(app.getHttpServer())
        .delete(`/warehouses/${warehouseId}`)
        .expect(200);

      // Verify Deleted
      await request(app.getHttpServer())
        .get('/warehouses')
        .expect(200)
        .expect([]);
    });
  });
});
