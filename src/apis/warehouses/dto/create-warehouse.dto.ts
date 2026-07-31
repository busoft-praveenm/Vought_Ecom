export class CreateWarehouseDto {
  name: string;
  address?: string;
  lat: number;
  lng: number;
  processingTimeHours?: number;
  isActive?: boolean;
}
