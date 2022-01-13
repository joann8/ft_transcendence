import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { user_role } from 'src/user/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const { user } = context.switchToHttp().getRequest();
		if (user.role == user_role.ADMIN) return true;
		throw new ForbiddenException('Admin Only');
	}
}
