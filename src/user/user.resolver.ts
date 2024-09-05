import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entities/userEntity.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Any } from 'typeorm';


@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'allUsers' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'singleUser' })
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Mutation(() => String)
  updateUser(@Args('user') user:UpdateUserInput) {
    return this.userService.update(user.id, user);
  }

  @Mutation(() => String)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }
}
