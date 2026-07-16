import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import admin from "@/config/firebase-admin.config";
import type { DecodedIdToken } from "firebase-admin/auth";
import { Request } from "express";
import { UserDbService } from "@/common/db-services/user-db.service";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {

  constructor(private readonly userDbService: UserDbService) {}

  async canActivate( context: ExecutionContext ):Promise<boolean>{
    try{
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.cookies?.access_token;
      // console.log('guard request: ', request)
      if (!token) {
        throw new UnauthorizedException(
          'Missing token'
        );
      }

      // console.log(
      //   'entering decode token'
      // );

      const decodedToken =
        await admin
          .auth()
          .verifyIdToken(
            token
          );

      // console.log(
      //   'decodedToken:',
      //   decodedToken
      // );

      request['user'] =
        decodedToken;
        
      const dbUser = await this.userDbService.findByFirebaseUid(decodedToken.uid);
      if (dbUser) {
        request['dbUser'] = dbUser;
      }

      return true;
    }catch(error){
      // console.error('Firebase verifyToken failed: ', error)
      throw new UnauthorizedException('Invalid firebase token');
    }
  }

  async verifyToken(
    token: string
  ) {
    return admin
      .auth()
      .verifyIdToken(
        token
      );
  }

}