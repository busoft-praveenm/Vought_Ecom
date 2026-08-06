import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, ProductsDb } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProductsDbService {

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    const product = await this.prisma.productsDb.findUnique({
      where: { id },
      include: { categories: true, brand: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByUid(uid: string) {
    const product = await this.prisma.productsDb.findUnique({
      where: { productUid: uid }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getRandomProducts(limit: number = 5) {
    // We only fetch active, non-deleted products where brand is active (if it has a brand)
    const products = await this.prisma.productsDb.findMany({
      where: {
        isDeleted: false,
        OR: [
          { brandId: null },
          { brand: { isActive: true } }
        ]
      },
      include: { brand: true, categories: true }
    });

    // Shuffle in memory
    for (let i = products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [products[i], products[j]] = [products[j], products[i]];
    }

    return products.slice(0, limit);
  }

  async getProducts(page = 1, limit = 10, search = '', categoryId = '', brandId = '', isAdmin = false) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductsDbWhereInput = {
      isDeleted: false,
    };

    if (!isAdmin) {
      whereClause.OR = [
        { brandId: null },
        { brand: { isActive: true } }
      ];
    }

    if (search) {
      whereClause.AND = [
        ...(whereClause.AND ? (Array.isArray(whereClause.AND) ? whereClause.AND : [whereClause.AND]) : []),
        {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { categories: { some: { name: { contains: search } } } },
            { brand: { name: { contains: search } } }
          ]
        }
      ];
    }

    if (categoryId) {
      const ids = categoryId.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) {
        whereClause.categories = { some: { id: { in: ids } } };
      }
    }

    if (brandId) {
      const bIds = brandId.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (bIds.length > 0) {
        whereClause.brandId = { in: bIds };
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.productsDb.findMany({
        where: whereClause,
        include: { categories: true, brand: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.productsDb.count({ where: whereClause })
    ]);

    return {
      results: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductWithReviews(id: number) {
    const product = await this.prisma.productsDb.findFirst({
      where: { id, isDeleted: false },
      include: { categories: true, brand: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const reviews = await this.prisma.productReviewDb.findMany({
      where: { productId: id },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return { product, reviews };
  }

  async createProduct(data: Partial<ProductsDb> & { categoryIds?: number[]; brandId?: number }) {
    const sku = data.sku || `SKU-${Date.now()}`;
    const productUid = data.productUid || uuidv4();
    
    const { categoryIds, brandId, ...productData } = data as any;
    
    const newProduct = await this.prisma.productsDb.create({
      data: {
        name: productData.name,
        sku,
        productUid,
        description: productData.description,
        price: productData.price,
        stock: productData.stock ?? 0,
        imageUrl: productData.imageUrl,
        status: productData.status,
        currency: productData.currency ?? 'INR',
        isActive: productData.isActive ?? true,
        brandId: brandId || null,
        createdById: productData.createdById || null,
        categories: categoryIds ? {
          connect: categoryIds.map((id: number) => ({ id }))
        } : undefined
      }
    });
    
    return this.findById(newProduct.id);
  }

  async updateProduct(id: number, data: Partial<ProductsDb> & { categoryIds?: number[]; brandId?: number }) {
    const { categoryIds, brandId, ...productData } = data as any;
    
    const updateData: Prisma.ProductsDbUpdateInput = {
      ...productData,
      updatedAt: new Date()
    };

    if (categoryIds !== undefined) {
      updateData.categories = {
        set: categoryIds.map((cid: number) => ({ id: cid }))
      };
    }
    
    if (brandId !== undefined) {
      updateData.brand = brandId ? { connect: { id: brandId } } : { disconnect: true };
    }

    await this.prisma.productsDb.update({
      where: { id },
      data: updateData
    });
      
    return this.findById(id);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.prisma.productsDb.update({
      where: { id },
      data: { isDeleted: true }
    });
  }

  async getProductPage(id: number, limit: number = 10): Promise<number> {
    const product = await this.prisma.productsDb.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const count = await this.prisma.productsDb.count({
      where: {
        isDeleted: false,
        createdAt: { gte: product.createdAt }
      }
    });
    
    return Math.ceil(count / limit) || 1;
  }
}