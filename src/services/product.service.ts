import { apiService } from "./api.service";

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: string;
  category: string;
  brand: string;
  imageUrl: string;
}

export interface ProductResponse {
  results: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getProducts=async (
  page = 1,
  limit = 12,
  search = ''
)=>{
  const result =  apiService.get<ProductResponse>(
    `/products`,
    {
      page,
      limit,
      search
    },
  );

  console.log('products: ', result)

  return result;
}