import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDb, UserStatus } from "../entities/tbl_user.entity";
import { Repository } from "typeorm";


@Injectable()
export class UserDbService {

  constructor(
    @InjectRepository(UserDb)
    private readonly userRepo: Repository<UserDb>
  ){}

  async findById(id: number):Promise<UserDb>{
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne()

    if(!user){
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: Partial<UserDb>):Promise<UserDb>{
    const newUser = this.userRepo.create({
      ...data,
      status: data.status ?? UserStatus.ACTIVE
    });
    const savedUser = await this.userRepo.save(newUser);
    return this.findById(savedUser.id);
  }

  async findByFirebaseUid(firebaseUid: string):Promise<UserDb | null>{
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.firebaseUid = :firebaseUid', {firebaseUid})
      .getOne();
  }

  async findByEmail(email: string): Promise<UserDb | null>{
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', {email})
      .getOne();
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

  async deleteUser( id: number ):Promise<void>{
    await this.userRepo
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', {id})
      .execute();
  }

}