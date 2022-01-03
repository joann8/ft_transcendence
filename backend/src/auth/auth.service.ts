import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from 'passport-42';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async findOrCreate42User(profile: Profile): Promise<any> {
        const user = await this.userService.findOne(profile.username); // VERIFIER
        if (user)
            return (user);
        /*
        else
        {
            CREATE USER
            return (user)
        }
        */
        return (null);
    }
}