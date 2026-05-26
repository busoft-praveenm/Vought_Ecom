import { Injectable, UnauthorizedException } from "@nestjs/common";
import admin from "@/config/firebase-admin.config";
import type { DecodedIdToken } from "firebase-admin/auth";

@Injectable()
export class FirebaseAuthService {

  async verifyToken( token: string ): Promise<DecodedIdToken> {
    try{
      console.log('entering decode token ')
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('decodedToken: ', decodedToken)

      return decodedToken;
      
    }catch(error){
        console.error('Firebase verifyToken failed:', error);
      throw new UnauthorizedException('Invalid firebase token');
    }
  }

}