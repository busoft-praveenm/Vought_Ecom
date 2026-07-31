import { UserDbService } from "@/common/db-services/user-db.service";
import { I18nContext } from 'nestjs-i18n';
import { UserDb } from "@/common/entities/tbl_user.entity";
import { UserStatus } from "@prisma/client";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import {v4 as uuidv4} from "uuid";

@Injectable()
export class AuthService {

  constructor(
    private readonly userDbService: UserDbService,
    private readonly fireBaseAuthGuard: FirebaseAuthGuard,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ){}

  async fireBaseLogin(
    token: string,
    body?: any
  ):Promise<any>{

    try{
      if(!token){
        throw new UnauthorizedException('messages.ERROR.UNAUTHORIZED');
      }

      const decoded = await this.fireBaseAuthGuard.verifyToken(token);

      let user = await this.userDbService.findByFirebaseUid(decoded.uid);
      // console.log('user: ', user)
      if(!user){

        const fullName = decoded.name?.trim() || '';
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');

        const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
        const roleName = decoded.email === adminEmail ? 'admin' : 'user';

        user = 
        await this.userDbService.createUser({
          userUid: uuidv4(),
          firebaseUid: decoded.uid,
          email: decoded.email,
          provider: decoded.firebase?.sign_in_provider,
          photoUrl: decoded.picture,
          profileData: {
            firstName: body?.firstName || firstName || null,
            lastName: body?.lastName || lastName || null,
            mobileNumber: body?.mobileNumber || null
          }
        }, roleName);

        try {
          const cacheManagerAny = this.cacheManager as any;
          const store = cacheManagerAny.store || (cacheManagerAny.stores && cacheManagerAny.stores[0]);
          
          let keys: string[] = [];
          if (store && typeof store.keys === 'function') {
            keys = await store.keys('*/users/customers*');
          } else if (store && store.client && typeof store.client.keys === 'function') {
            keys = await store.client.keys('*/users/customers*');
          }

          for (const key of keys) {
            await this.cacheManager.del(key);
          }
        } catch (error) {
          console.error('Failed to invalidate cache:', error);
        }
      }

       if (
        user.status === UserStatus.INACTIVE
      ) {
        throw new UnauthorizedException(
          'messages.ERROR.UNAUTHORIZED',
        );
      }

      return {
        success: true,
        message: I18nContext.current()?.t('messages.SUCCESS.LOGIN') || 'Login successful',
        user,
      };

    }catch(error){
      throw error;
    }

  }

  async updateProfile(userId: number, data: any): Promise<any> {
    try {
      const user = await this.userDbService.updateUserProfile(userId, {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        billingAddress: data.billingAddress,
        deliveryAddress: data.deliveryAddress,
        deliveryLat: data.deliveryLat,
        deliveryLng: data.deliveryLng
      });
      return {
        success: true,
        message: I18nContext.current()?.t('messages.SUCCESS.GENERAL') || 'Profile updated successfully',
        user
      };
    } catch (error) {
      throw error;
    }
  }

}