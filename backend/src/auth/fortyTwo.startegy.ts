import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService) {
    super({
        clientID: 'a981044532c3d71436aad905abb10a193e9e860e0d7b960aabb9427eabc4c2ae', // MUST BE ENV
        clientSecret: '9152ea47442b8d147ddd3b5507e6c6fb0ae90dd66b0deea9122b9b5e5fefc8f3', // MUST BE ENV
        callbackUrl: '/user',
        // profileFields
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback): Promise<any> {
    const user = await this.authService.findOrCreate42User(profile);
    if (!user) {
        throw new InternalServerErrorException();
    }
    // ACCESS AND REFRESH ??
    return cb(null, user);
  }
}