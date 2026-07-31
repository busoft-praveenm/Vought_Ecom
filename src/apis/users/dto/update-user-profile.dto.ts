export class UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  billingAddress?: string;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
}
