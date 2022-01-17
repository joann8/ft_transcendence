import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { user_role } from 'src/user/entities/user.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const { user } = context.switchToHttp().getRequest();
		if (user.role == user_role.OWNER) return true;
		throw new ForbiddenException('Owner Only');
	}
}
