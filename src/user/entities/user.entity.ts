import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class User {
  @Field()
  id:string

  @Field()
  name:string

  @Field()
  email:string
}
