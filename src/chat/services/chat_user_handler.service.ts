import { CACHE_MANAGER ,Cache } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";


export class UserHandler{
   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

   async setUser(userDetails:any){
      await this.cacheManager.set(userDetails.userId,userDetails.clientId)
   }

   async getUser(user:any):Promise<string>{
      const userDetails:any = await this.cacheManager.get(user.userId);
      return userDetails
   }
   async removeUser(user:any){
      await this.cacheManager.del(user.userId);
      return true
   }

   async resetList(){
      await this.cacheManager.reset()
      return null
   }
}