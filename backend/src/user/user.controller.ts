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

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
		console.log('OldAvatarName: ', oldAvatarName);
		//Suppression de l'ancien avatar
		if (oldAvatarName !== 'defaul_img_registration.jpg') {
			await fs.unlink(oldAvatarPath, function (err) {
				if (err)
					throw new HttpException(
						'Could Not Delete Previous Avatar',
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				else console.log('old avatar deleted');
			});
		}
		await this.userService.update(req.user.id, {
			avatar: `http://127.0.0.1:3001/avatars/${file.filename}`,
		});
		return file;
	}

	// UPDATE MY PROFILE (Look at UpdateCurrentUserDto for available options)
	@Put()
	async updateCurrentUser(
		@Req() req,
		@Body(ParseUpdateCurrentDto) updateCurrentUserDto: UpdateCurrentUserDto,
	): Promise<User> {
		await this.userService.update(req.user.id, updateCurrentUserDto);
		return this.userService.findOne(req.user.id.toString());
	}

	// DELETE MY PROFILE
	@Delete()
	@Redirect('/')
	async deleteCurrentUser(@Req() req): Promise<void> {
		await this.userService.remove(req.user.id);
	}
}
