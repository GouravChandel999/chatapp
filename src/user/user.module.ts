import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { GooleStrategy } from './google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/userEntity.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwtstrategy';

@Module({
  imports:[ TypeOrmModule.forFeature([UserEntity]),
  JwtModule.register({
    secret:'key'
}),
],
  controllers:[UserController],
  providers: [UserResolver, UserService,GooleStrategy,JwtStrategy],
})
export class UserModule {}
