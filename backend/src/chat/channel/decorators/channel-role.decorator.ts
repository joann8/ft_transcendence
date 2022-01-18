import { BadRequestException } from '@nestjs/common';
import {
	channelRole,
	userChannelRole,
} from '../entities/userChannelRole.entity';

export function CheckRoles() {
	return function (
		target: Object,
		key: string | symbol,
		descriptor: PropertyDescriptor,
	) {
		const childFunction = descriptor.value;
		descriptor.value = (...args: any[]) => {
			const user = args[2];
			const targetUser = args[1];
			const channel = args[0];
			const userRole = user.roles.find(
				(elem: userChannelRole) => elem.channel.id === channel.id,
			);
			const targetUserRole = targetUser.roles.find(
				(elem: userChannelRole) => elem.channel.id === channel.id,
			);
			/**check user in channel */
			if (!userRole) {
				throw new BadRequestException(
					'Deco :You must be in the channel to kick someone',
				);
			}
			/**check targetUser in channel */
			if (!targetUserRole) {
				throw new BadRequestException(
					'Deco :The target is not in the channel',
				);
			}
			/** user is a simple user */
			if (userRole.role === 'user') {
				throw new BadRequestException(
					'Deco :You dont have the rights to kick someone',
				);
			}
			/** user is admin and try to kick owner or admin */
			if (
				userRole.role === 'admin' &&
				(targetUserRole.role === 'owner' ||
					targetUserRole.role === 'admin')
			) {
				throw new BadRequestException(
					'Deco :As an admin you can not kick the owner or an admin',
				);
			}
			return childFunction;
		};
		return descriptor;
	};
}
