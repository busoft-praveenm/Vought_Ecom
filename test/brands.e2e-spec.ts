import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { clearDatabase } from './test-utils';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

describe('BrandsController (e2e)', () => {
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

  describe('/brands (GET)', () => {
    it('should return empty list when no brands exist', () => {
      return request(app.getHttpServer())
        .get('/brands')
        .expect(200)
        .expect((res) => {
          expect(res.body.results).toEqual([]);
          expect(res.body.pagination.total).toBe(0);
        });
    });
  });

  describe('/brands (POST)', () => {
    it('should create a new brand', () => {
      return request(app.getHttpServer())
        .post('/brands')
        .send({ name: 'Test Brand', description: 'Test Desc' })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('Test Brand');
          expect(res.body.description).toBe('Test Desc');
          expect(res.body.id).toBeDefined();
        });
    });
  });

  describe('Brand Flow (POST -> GET -> PATCH -> DELETE)', () => {
    it('should run through the complete flow', async () => {
      // Create
      const createRes = await request(app.getHttpServer())
        .post('/brands')
        .send({ name: 'Flow Brand' })
        .expect(201);
      
      const brandId = createRes.body.id;

      // Get
      await request(app.getHttpServer())
        .get('/brands')
        .expect(200)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0].id).toBe(brandId);
        });

      // Update
      await request(app.getHttpServer())
        .patch(`/brands/${brandId}`)
        .send({ name: 'Updated Flow Brand' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Flow Brand');
        });

      // Delete (soft delete)
      await request(app.getHttpServer())
        .delete(`/brands/${brandId}`)
        .expect(200);

      // Verify not returned in normal GET (because isActive usually is part of the query, but wait, does brand have isActive?)
      // BrandDbService uses deletedAt for soft delete. Let's check `findAll` in `brand-db.service.ts`:
      // `const whereCondition = isAdmin ? {} : { isActive: true };`
      // Wait, deleteBrand only sets deletedAt, it doesn't set isActive: false!
      // Let's verify `brand-db.service.ts` deleteBrand.
    });
  });
});
