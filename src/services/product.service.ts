import { serverApiService } from "./server-api.service";

export interface ApiErrorResponse {
  success: false;
  error: string;
}

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

export interface ProductSuccessResponse {
  success?: true;

  results: Product[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ProductApiResponse =
  | ProductSuccessResponse
  | ApiErrorResponse;

export const getProducts=async (
  page = 1,
  limit = 12,
  search = ''
)=>{
  const result =  serverApiService.get<ProductApiResponse>(
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