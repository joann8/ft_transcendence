import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Req,
	Put,
	Redirect,
	Post,
	ParseIntPipe,
	UseInterceptors,
	UploadedFile,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path/posix';
import { UpdateCurrentUserDto } from './dto/updateCurrentUser.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ParseUpdateCurrentDto } from './pipes/parseUpdateCurrentDto';
import { AdminGuard } from 'src/admin/guards/admin.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { ChannelService } from 'src/chat/channel/channel.service';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly channelService: ChannelService,
	) {}

	// GET MY PROFILE
	@Get()
	async getCurrentUser(@Req() req): Promise<User> {
		return req.user;
	}
	//Get leaderBoard
	@Get('all/leaderboard')
	async getLeaderboard(): Promise<User[]> {
		return this.userService.getLeaderboard();
	}

	// SEARCH AN USER
	@Get(':id_pseudo')
	async getUser(@Param() user_pseudo: string): Promise<User> {
		const res = await this.userService.findOne(user_pseudo);
		if (!res)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		else return res;
	}

	//UPLOAD NEW AVATAR
	@Post('upload')
	@UseInterceptors(
		FileInterceptor('avatar', {
			storage: diskStorage({
				destination: './avatars',
				filename: (_req, file, cb) => {
					const path = require('path');
					const originalName = path.parse(file.originalname).name;
					const randomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 16).toString(16))
						.join('');
					const finalName = `${originalName}_${randomName}${extname(
						file.originalname,
					)}`;
					cb(null, finalName);
				},
			}),
		}),
	)
	async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
		const oldAvatarName = `${req.user.avatar.split('/').pop()}`;
		const oldAvatarPath = `${process.env.PWD}/avatars/${oldAvatarName}`;
		const fs = require('fs');
		//Suppression de l'ancien avatar
		await fs.unlink(oldAvatarPath, function (err) {
			if (err) console.log(`Avatar : ${oldAvatarName} was not deleted`);
			else console.log('old avatar deleted');
		});
		await this.userService.update(req.user.id, {
			avatar: `${process.env.BACKEND_URL}/avatars/${file.filename}`,
		});
		return file;
	}

	// UPDATE MY PROFILE (Look at UpdateCurrentUserDto for available options)
	@Put()
	async updateCurrentUser(
		@Req() req,
		@Body(ParseUpdateCurrentDto) updateCurrentUserDto: UpdateCurrentUserDto,
	): Promise<User> {
		const id = req.user.id;
		const prevPseudo = req.user.id_pseudo;
		const newPSeudo = updateCurrentUserDto.id_pseudo;
		await this.userService.update(req.user.id, updateCurrentUserDto);
		await this.channelService.updateDirectChannel(
			id,
			prevPseudo,
			newPSeudo,
		);
		return this.userService.findOne(req.user.id.toString());
	}

	// DELETE MY PROFILE
	@Delete()
	@Redirect('/')
	async deleteCurrentUser(@Req() req): Promise<void> {
		await this.userService.remove(req.user.id);
	}
}
