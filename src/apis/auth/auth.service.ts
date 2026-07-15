import { UserDbService } from "@/common/db-services/user-db.service";
import { UserDb } from "@/common/entities/tbl_user.entity";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import {v4 as uuidv4} from "uuid";

@Injectable()
export class AuthService {

  constructor(
    private readonly userDbService: UserDbService,
    private readonly fireBaseAuthGuard: FirebaseAuthGuard
  ){}

  async fireBaseLogin(
    token: string
  ):Promise<any>{

    try{
      if(!token){
        throw new UnauthorizedException('Missing token');
      }

      const decoded = await this.fireBaseAuthGuard.verifyToken(token);

      let user = await this.userDbService.findByFirebaseUid(decoded.uid);
      // console.log('user: ', user)
      if(!user){

        const fullName = decoded.name?.trim() || '';
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');

        user = 
        await this.userDbService.createUser({
          userUid: uuidv4(),
          firebaseUid: decoded.uid,
          email: decoded.email,
          firstName,
          lastName,
          provider: decoded.firebase?.sign_in_provider,
          photoUrl: decoded.picture,
          role: { id: 2 } as any
        });
      }

       if (
        user.status === 'inactive'
      ) {
        throw new UnauthorizedException(
          'User account inactive',
        );
      }

      return {
        success: true,
        message: 'Login successful',
        user,
      };

    }catch(error){
      throw error;
    }

  }

}