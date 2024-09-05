import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './chat/chat.module';
import { UserEntity } from './user/entities/userEntity.entity';
import { UploadModule } from './user/s3/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'u@123',
    database:'chatapp',
    entities:[UserEntity],
    synchronize:true,
  }),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    playground: true,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    definitions:{
      path:join(process.cwd(), 'src/graphql.ts')
    },
  }), 
  UserModule,UploadModule,ConfigModule.forRoot({isGlobal:true}) ,SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
