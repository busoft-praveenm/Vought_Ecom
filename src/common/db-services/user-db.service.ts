import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDb, UserStatus } from "../entities/tbl_user.entity";
import { UserProfileDb } from "../entities/tbl_user_profile.entity";
import { Repository } from "typeorm";
import { RoleDb } from "../entities/tbl_role.entity";


@Injectable()
export class UserDbService {

  constructor(
    @InjectRepository(UserDb)
    private readonly userRepo: Repository<UserDb>,
    @InjectRepository(UserProfileDb)
    private readonly profileRepo: Repository<UserProfileDb>,
    @InjectRepository(RoleDb)
    private readonly roleRepo: Repository<RoleDb>
  ){}

  async findById(id: number):Promise<UserDb>{
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne()

    if(!user){
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: Partial<UserDb> & { profileData?: Partial<UserProfileDb> }, roleName: string = 'user'):Promise<UserDb>{
    const { profileData, ...userData } = data;
    
    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    const newUser = this.userRepo.create({
      ...userData,
      status: userData.status ?? UserStatus.ACTIVE,
      role: role
    });
    
    if (profileData) {
      newUser.profile = this.profileRepo.create(profileData);
    }
    
    const savedUser = await this.userRepo.save(newUser);
    return this.findById(savedUser.id);
  }

  async findByFirebaseUid(firebaseUid: string):Promise<UserDb | null>{
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.firebaseUid = :firebaseUid', {firebaseUid})
      .getOne();
  }

  async findByEmail(email: string): Promise<UserDb | null>{
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email = :email', {email})
      .getOne();
  }

  async getCustomers(page: number, limit: number): Promise<{ data: UserDb[], total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.profile', 'profile')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }


  async updateUser( id: number, data: Partial<UserDb>): Promise<UserDb>{
    await this.userRepo
      .createQueryBuilder()
      .update(UserDb)
      .set(data)
      .where('id = :id',{id})
      .execute();

    return this.findById(id);
  }

  async updateUserProfile(userId: number, profileData: Partial<UserProfileDb>): Promise<UserDb> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profile) {
      await this.profileRepo
        .createQueryBuilder()
        .update(UserProfileDb)
        .set(profileData)
        .where('user_id = :userId', { userId })
        .execute();
    } else {
      const newProfile = this.profileRepo.create({
        ...profileData,
        userId: userId
      });
      await this.profileRepo.save(newProfile);
    }

    return this.findById(userId);
  }

  async deleteUser( id: number ):Promise<void>{
    await this.userRepo
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', {id})
      .execute();
  }

}