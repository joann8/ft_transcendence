import { Controller, Get, Req, Sse } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';

@Controller()
@Public()
export class AppController {
	constructor(private userService : UserService, private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Sse('sse')
	//sse(): Observable<MessageEvent> {
	sse(): Observable<Promise<User>> {
		const test  = async () : Promise<User> => {
			const user = await this.userService.findMe(Req);
			return user
		}
		return interval(1000).pipe(
			map((_) => (test() as Promise<User>)),
		);
		/*
		return interval(1000).pipe(
			//map((_) => (this.userService.findMe(Req) as Promise<User>)),
			map((_) => ({data: {hello: 'world'}} as MessageEvent)),
		);*/
	}
}