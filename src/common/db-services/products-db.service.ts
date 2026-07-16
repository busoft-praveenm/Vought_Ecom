import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsDb } from "../entities/tbl_products.entity";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";


@Injectable()
export class ProductsDbService {

  constructor(
    @InjectRepository(ProductsDb)
    private readonly productRepo: Repository<ProductsDb>
  ){}

  async findById(id: number):Promise<ProductsDb>{
    const product = await this.productRepo
      .createQueryBuilder('product')
      .where('product.id = :id', {id})
      .getOne()

    if(!product){
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByUid(uid: string):Promise<ProductsDb>{
    const product = await this.productRepo
      .createQueryBuilder('product')
      .where('product.productUid = :uid', { uid })
      .getOne()

    if(!product){
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getProducts(page=1, limit=10, search=''){
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    queryBuilder.where('product.isDeleted = :isDeleted', { isDeleted: false });

    if(search){
      queryBuilder.andWhere(
        `
          (
            product.name
              LIKE :search
            OR
            product.category
              LIKE :search
            OR
            product.brand
              LIKE :search
          )
        `,
        {
          search: `%${search}%`
        },
      );
    }

    queryBuilder
      .orderBy(
        'product.createdAt',
        'DESC'
      )
      .skip((page - 1)*limit)
      .take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      results: products,
      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total /
              limit,
          ),
      },
    };
  }
  
  async getProductWithReviews(id: number) {
    const product = await this.productRepo
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const reviews = await this.productRepo.manager
      .createQueryBuilder('ProductReviewDb', 'review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.product = :id', { id })
      .orderBy('review.createdAt', 'DESC')
      .take(10)
      .getMany();

    return { product, reviews };
  }

  async createProduct(data: Partial<ProductsDb>): Promise<ProductsDb> {
    const sku = data.sku || `SKU-${Date.now()}`;
    const productUid = data.product_uid || uuidv4();
    
    const newProduct = this.productRepo.create({
      ...data,
      sku,
      product_uid: productUid,
    });
    
    const saved = await this.productRepo.save(newProduct);
    return this.findById(saved.id);
  }

  async updateProduct(id: number, data: Partial<ProductsDb>): Promise<ProductsDb> {
    await this.productRepo
      .createQueryBuilder()
      .update(ProductsDb)
      .set(data)
      .where('id = :id', { id })
      .execute();
      
    return this.findById(id);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepo
      .createQueryBuilder()
      .update(ProductsDb)
      .set({ isDeleted: true })
      .where('id = :id', { id })
      .execute();
  }

  async getProductPage(id: number, limit: number = 10): Promise<number> {
    const product = await this.findById(id);
    const count = await this.productRepo
      .createQueryBuilder('product')
      .where('product.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('product.createdAt >= :createdAt', { createdAt: product.createdAt })
      .getCount();
    
    return Math.ceil(count / limit) || 1;
  }
}