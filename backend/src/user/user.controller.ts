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
	UseInterceptors,
	UploadedFile,
	Res,
	StreamableFile,
} from '@nestjs/common';

import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, fstat } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path/posix';
import { UpdateCurrentUserDto } from './dto/updateCurrentUser.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';


//a stocker ailleurs


@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	// GET MY PROFILE
	@Get()
	async getCurrentUser(@Req() req): Promise<User> {
		return req.user;
	}
	// SEARCH AN USER
	@Get(':id_pseudo')
	async getUser(@Param() userId: string): Promise<User> {
		return this.userService.findOne(userId);
	}
	@Get('/avatar/:avatarId')
	async getAvatar(@Param('avatarId') avatarId : string, @Res() res: Response) :  Promise<any> {
		console.log("ici")
		res.sendFile(avatarId, {root : 'avatars'})
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('avatar', {
		storage: diskStorage({
			destination: "./avatars",
			filename: (_req, file, cb) => {
				console.log(file)
				const path = require('path')
				const originalName = path.parse(file.originalname).name
				const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
				const finalName = `${originalName}_${randomName}${extname(file.originalname)}`
				cb(null, finalName)
			}
		})
	}))
	async uploadFile(
		@Req() req,
		@UploadedFile() file: Express.Multer.File
	) {
		const filePath = `${process.env.PWD}/avatars/${file.filename}`
	//	const filePath = `${file.`

		console.log("File interceptor : ", file)

		const oldAvatarPath = `${process.env.PWD}/avatars/${((req.user.avatar).split('/').pop())}`

		console.log(oldAvatarPath)
		await this.userService.update(req.user.id, {
			avatar: `${process.env.BACKEND_URL}/avatars/${file.filename}`,
		})
		const fs = require('fs')
		fs.unlink(oldAvatarPath, function (err) {
			if (err)
				console.log("Error in avatart deletion: ", err)
			else
				console.log("old avatar deleted")
		})
		return file;
	}

	// UPDATE MY PROFILE (Look at UpdateCurrentUserDto for available options)
	@Put()
	async updateCurrentUser(
		@Res() res : Response,
		@Req() req,
		@Body() updateCurrentUserDto: UpdateCurrentUserDto,
	): Promise<User> {
		console.log("updateCurrentDto: ", updateCurrentUserDto)
		try {
			await this.userService.update(req.user.id, updateCurrentUserDto);
			res.statusMessage = "Succes User Updated"
			res.status(200).send({success: "User successfully updated"})
			return this.userService.findOne(req.user.id.toString());
		}
		catch(error)
		{
			//console.log("UpdateCurrentUser Error caught:" + '\n', error)
			res.statusMessage = "Username or Email unavailable"
			res.status(409).send({error: " Username or Email unavalaible"})
		}

	}
	// DELETE MY PROFILE
	@Delete()
	@Redirect('/')
	async deleteCurrentUser(@Req() req): Promise<void> {
		this.userService.remove(req.user.id);
	}
}

