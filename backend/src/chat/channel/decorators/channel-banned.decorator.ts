import { BadRequestException } from '@nestjs/common';
import { userChannelRole } from '../entities/userChannelRole.entity';

export function CheckBann() {
	return function (
		target: Object,
		key: string | symbol,
		descriptor: PropertyDescriptor,
	) {
		const childFunction = descriptor.value;
		descriptor.value = (...args: any[]) => {
			const user = args[2];
			const channel = args[0];
			const userRole = user.roles.find(
				(elem: userChannelRole) => elem.channel.id === channel.id,
			);
			/**check user in channel */
			if (userRole && userRole.role === 'banned') {
				throw new BadRequestException('You have been bannned');
			}
			return childFunction.apply(this, args);
		};
		return descriptor;
	};
}
