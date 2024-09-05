import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import redisStore from 'cache-manager-redis-store';
import { ChatGateway } from "./controllers/chat.geteway";
import { RedisModule } from "./redis/redis.service";
import { UserHandler } from "./services/chat_user_handler.service";
@Module({
	imports: [
		
		CacheModule.register({
			isGlobal: true,
			store: redisStore as any,
			// host:'localhost',
			host: 'redis-14720.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
			user:'default',
			password:'A0PrPLE5luyY9BIjs9skrmXRyVLu6vTk',
			port: 14720,
			// port:6379
		})
	],
	controllers: [],
	providers: [UserHandler, ChatGateway, RedisModule,],
	exports: []
})
export class SocketModule { }