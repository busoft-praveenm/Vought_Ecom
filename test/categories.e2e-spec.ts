import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { clearDatabase } from './test-utils';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

describe('CategoriesController (e2e)', () => {
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

  describe('/categories (GET)', () => {
    it('should return empty list when no categories exist', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.total).toBe(0);
        });
    });
  });

  describe('/categories (POST)', () => {
    it('should create a new category', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send({ name: 'Test Category', description: 'Test Desc' })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('Test Category');
          expect(res.body.description).toBe('Test Desc');
          expect(res.body.id).toBeDefined();
        });
    });
  });

  describe('Category Flow (POST -> GET -> PATCH -> DELETE)', () => {
    it('should run through the complete flow', async () => {
      // Create
      const createRes = await request(app.getHttpServer())
        .post('/categories')
        .send({ name: 'Flow Category' })
        .expect(201);
      
      const categoryId = createRes.body.id;

      // Get
      await request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].id).toBe(categoryId);
        });

      // Update
      await request(app.getHttpServer())
        .patch(`/categories/${categoryId}`)
        .send({ name: 'Updated Flow Category' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Flow Category');
        });

      // Delete (soft delete sets isActive to false)
      await request(app.getHttpServer())
        .delete(`/categories/${categoryId}`)
        .expect(200);

      // Verify not returned in normal GET
      await request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBe(0);
          expect(res.body.total).toBe(0);
        });

      // Verify returned in Admin GET
      await request(app.getHttpServer())
        .get('/categories/admin')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].isActive).toBe(false);
        });
    });
  });
});
