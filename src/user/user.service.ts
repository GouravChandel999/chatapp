import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { JwtService } from "@nestjs/jwt";
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/userEntity.entity';

@Injectable()
export class UserService {

  constructor(private jwtService:JwtService,@InjectRepository(UserEntity) private userRepo:Repository<UserEntity>){}

  googleLogin(req){
    try{
      if(!req.user){
        return 'no user'
      }
      return this.login(req.user)
    }catch(err){
      throw err
    }
  }

  async login(user){
    try{
      const payload={...user};
      const {email,firstName,lastName,accessToken}=user;
      const userExist=await this.userRepo.findOne({where:{email}})
  
      if(userExist){
        return {
          message:"User Logged In",
          token: this.jwtService.sign(payload), 
      };
      }
  
      const userData = new UserEntity();
      userData.email=email;
      userData.name=firstName + lastName;
      userData.accessToken=accessToken;
      this.userRepo.save(userData);
  
      return {
          message:"User Logged In",
          token: this.jwtService.sign(payload), 
      };
    }catch(err){
      throw err
    }
}   

  async findAll() {
    try{
      const users=await this.userRepo.find();
      return users;
    }catch(err){
      throw err;
    }
  }

  async findOne(id: string) {
    try{
      const user=await this.userRepo.findOne({where:{id}});
      if(user){
        return user
      }
      return "User Not Found"
    }catch(err){
      throw err;
    }
  }

 async update(id: string, userData: any) {
    try{
      const user=await this.userRepo.findOne({where:{id}});
      if(user){
         await this.userRepo.update(id,userData);
         return "User Updated"
      }

      return "User Not Foud"
    }catch(err){ 
      throw err;
    }
  }

 async remove(id: string) {
  const user=await this.userRepo.findOne({where:{id}});

  if(user){
    await this.userRepo.delete(id)
    return "user Deleted"
  }
    return "User NOt found"
  }
}
 