import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return 'Vought International E-commerce site backend is running!';
  }
}
