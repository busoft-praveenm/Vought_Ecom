import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsDb } from "../entities/tbl_products.entity";
import { Repository } from "typeorm";


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
}