import { getProducts } from "@/services/product.service";
import DashboardClient from "./DashboardClient";

interface Props {
  searchParams: Promise<{page?: string}>;
}

const DashboardPage= async ({ searchParams }: Props)=>{

  const params = await searchParams;
  const page = Number(params?.page || 1);

  const productData = await getProducts(page, 12);

  return (
    <DashboardClient productsData={productData}/>
  );
}

export default DashboardPage;
