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
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
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

  async getRandomProducts(limit: number = 5): Promise<ProductsDb[]> {
    return this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categories', 'category')
      .where('product.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('(brand.id IS NULL OR brand.isActive = :brandIsActive)', { brandIsActive: true })
      .orderBy('RAND()')
      .take(limit)
      .getMany();
  }

  async getProducts(page=1, limit=10, search='', categoryId='', brandId='', isAdmin=false){
    const queryBuilder = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.brand', 'brand');
    queryBuilder.where('product.isDeleted = :isDeleted', { isDeleted: false });

    if (!isAdmin) {
      queryBuilder.andWhere('(brand.id IS NULL OR brand.isActive = :brandIsActive)', { brandIsActive: true });
    }

    if(search){
      queryBuilder.andWhere(
        `
          (
            product.name
              LIKE :search
            OR
            category.name
              LIKE :search
            OR
            brand.name
              LIKE :search
          )
        `,
        {
          search: `%${search}%`
        },
      );
    }

    if(categoryId){
      const ids = categoryId.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) {
        queryBuilder.innerJoin('product.categories', 'filterCategory', 'filterCategory.id IN (:...ids)', { ids });
      }
    }

    if(brandId){
      const bIds = brandId.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (bIds.length > 0) {
        queryBuilder.andWhere('brand.id IN (:...bIds)', { bIds });
      }
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
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
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

  async createProduct(data: Partial<ProductsDb> & { categoryIds?: number[]; brandId?: number }): Promise<ProductsDb> {
    const sku = data.sku || `SKU-${Date.now()}`;
    const productUid = data.product_uid || uuidv4();
    
    const { categoryIds, brandId, ...productData } = data as any;
    
    const newProduct = this.productRepo.create({
      ...productData,
      sku,
      product_uid: productUid,
      categories: categoryIds ? categoryIds.map((id: number) => ({ id })) : [],
      brand: brandId ? { id: brandId } as any : undefined,
    });
    
    const saved = await this.productRepo.save(newProduct) as any;
    return this.findById(saved.id);
  }

  async updateProduct(id: number, data: Partial<ProductsDb> & { categoryIds?: number[]; brandId?: number }): Promise<ProductsDb> {
    const { categoryIds, brandId, ...productData } = data as any;
    
    // For many-to-many, we must load the product and save it to update relations,
    // or use a relational query builder. save() is safer here.
    const product = await this.productRepo.findOne({ where: { id }, relations: ['categories'] });
    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, productData);

    if (categoryIds !== undefined) {
      product.categories = categoryIds.map((cid: number) => ({ id: cid })) as any;
    }
    if (brandId !== undefined) {
      product.brand = { id: brandId } as any;
    }

    await this.productRepo.save(product);
      
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