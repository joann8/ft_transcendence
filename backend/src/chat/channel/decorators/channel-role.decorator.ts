import { BadRequestException } from '@nestjs/common';
import { userChannelRole } from '../entities/userChannelRole.entity';

export function CheckRoles(action: string) {
	return function (
		target: Object,
		key: string | symbol,
		descriptor: PropertyDescriptor,
	) {
		const childFunction = descriptor.value;
		descriptor.value = function (...args: any[]) {
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
				throw new BadRequestException(`You must be in the channel`);
			}
			/**check targetUser in channel */
			if (!targetUserRole) {
				throw new BadRequestException(
					'The target is not in the channel',
				);
			}
			/**check user and targetUser are not the same user */
			if (userRole.id === targetUserRole.id) {
				throw new BadRequestException(
					'You cant be the user and the target',
				);
			}
			/** user is a simple user */
			if (userRole.role === 'user') {
				throw new BadRequestException(
					`You dont have the rights to set as : "${action}" someone`,
				);
			}
			/** user is admin and try to kick owner or admin */
			if (
				userRole.role === 'admin' &&
				(targetUserRole.role === 'owner' ||
					targetUserRole.role === 'admin')
			) {
				throw new BadRequestException(
					`As an admin you can not set as : "${action}" the owner or an admin`,
				);
			}
			if (action && targetUserRole.role === action) {
				throw new BadRequestException(
					`The user is already set as : "${action}"`,
				);
			}
			return childFunction.apply(this, args);
		};
		return descriptor;
	};
}
