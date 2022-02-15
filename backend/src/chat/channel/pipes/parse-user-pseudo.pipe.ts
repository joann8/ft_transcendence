import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class ParseUserPseudo implements PipeTransform<string, Promise<User>> {
	async transform(pseudo: string, metadata: ArgumentMetadata): Promise<User> {
		const user = await getRepository(User).findOne({
			where: { id_pseudo: pseudo },
			relations: ['roles', 'roles.channel'],
		});
		if (!user) {
			throw new BadRequestException(`user ${pseudo} doesn't exist`);
		}
		return user;
	}
}
