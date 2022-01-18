import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common';
import { getRepository } from 'typeorm';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ParseChannelPipe
	implements PipeTransform<string, Promise<Channel>>
{
	async transform(
		value: string,
		metadata: ArgumentMetadata,
	): Promise<Channel> {
		const id = parseInt(value, 10);
		if (isNaN(id)) {
			throw new BadRequestException('Channel ID is not a number');
		}
		const channel = await getRepository(Channel).findOne(id, {
			relations: ['roles', 'roles.user'],
		});
		if (!channel) {
			throw new BadRequestException(`Channel ${id} doesn't exist`);
		}
		return channel;
	}
}
