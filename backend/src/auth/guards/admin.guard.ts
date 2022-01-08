import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { user_role } from 'src/user/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const { user } = context.switchToHttp().getRequest();
		return user.role === user_role.ADMIN;
	}
}
