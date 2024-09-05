import {  OnModuleInit, OnModuleDestroy, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ChatGateway } from '../controllers/chat.geteway';

@Injectable()
export class RedisModule implements OnModuleInit, OnModuleDestroy {
   private readonly sub: Redis;
   private readonly pub: Redis;

   constructor(private socketService: ChatGateway) {
      this.sub = new Redis("redis://default:AHZKtdfpv9IsEa6PbDFCH2hPkcBgqgYb@redis-15203.c276.us-east-1-2.ec2.redns.redis-cloud.com:15203");
   }

   async onModuleInit() {
      await this.sub.subscribe(...Object.values('Messages'));
      
      this.sub.on('message', async (channel, message) => {
         switch(channel){
            case 'Messages':
               this.forwardMsg(message);
               break;
         }
      });
   }

   forwardMsg(message: string) {
      this.socketService.transmitMessage(message)
   }

   async onModuleDestroy() {
      await this.sub.quit();
   }
}
