import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserDb, UserProfileDb, RoleDb, UserStatus } from "@prisma/client";

@Injectable()
export class UserDbService {

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<UserDb & { role: RoleDb | null, profile: UserProfileDb | null }> {
    const user = await this.prisma.userDb.findUnique({
      where: { id },
      include: { role: true, profile: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: Partial<UserDb> & { profileData?: Partial<UserProfileDb> }, roleName: string = 'user') {
    const { profileData, ...userData } = data;
    
    const role = await this.prisma.roleDb.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    const newUser = await this.prisma.userDb.create({
      data: {
        userUid: userData.userUid!,
        firebaseUid: userData.firebaseUid!,
        email: userData.email!,
        provider: userData.provider,
        status: userData.status ?? UserStatus.ACTIVE,
        photoUrl: userData.photoUrl,
        isActive: userData.isActive ?? true,
        isDeleted: userData.isDeleted ?? false,
        roleId: role.id,
        profile: profileData ? {
          create: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            mobileNumber: profileData.mobileNumber,
            billingAddress: profileData.billingAddress,
            deliveryAddress: profileData.deliveryAddress,
            deliveryLat: profileData.deliveryLat,
            deliveryLng: profileData.deliveryLng
          }
        } : undefined
      },
      include: { role: true, profile: true }
    });
    
    return newUser;
  }

  async findByFirebaseUid(firebaseUid: string) {
    return this.prisma.userDb.findUnique({
      where: { firebaseUid },
      include: { role: true, profile: true }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.userDb.findUnique({
      where: { email },
      include: { role: true, profile: true }
    });
  }

  async getCustomers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.userDb.findMany({
        skip,
        take: limit,
        include: { role: true, profile: true }
      }),
      this.prisma.userDb.count()
    ]);

    return { data, total };
  }

  async updateUser(id: number, data: Partial<UserDb>) {
    await this.prisma.userDb.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    return this.findById(id);
  }

  async updateUserProfile(userId: number, profileData: Partial<UserProfileDb>) {
    const user = await this.prisma.userDb.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profile) {
      await this.prisma.userProfileDb.update({
        where: { userId },
        data: profileData
      });
    } else {
      await this.prisma.userProfileDb.create({
        data: {
          ...profileData,
          userId
        }
      });
    }

    return this.findById(userId);
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.userDb.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false
      }
    });
  }

}