import { Injectable, Scope } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,verifyCallback} from 'passport-google-oauth20'


@Injectable()
export class GooleStrategy extends PassportStrategy(Strategy,'google'){
    constructor(){
        super({
            clientID:'26240994387-bo0qli1afmqe55m676u228l5mdi110ap.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL:'http://localhost:8000/google/callback',
            scope: ["email", "profile"] 
        });
    }

    async validate(accessToken:string,refreshToken:string,profile:any,done:verifyCallback):Promise<any>{
       const {name,emails,photos}=profile;
       const user={
       email:emails[0].value,
       firstName:name.givenName,
       lastName:name.familyName,
       picture:photos[0].value,
       accessToken
       }
       done(null,user);
    } 
}