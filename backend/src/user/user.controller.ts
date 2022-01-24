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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fstat } from 'fs';
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
		console.log("File interceptor : ", file)

		const oldAvatar = (req.user.avatar)
		await this.userService.update(req.user.id, {
			avatar: filePath,
		})
		const fs = require('fs')
		fs.unlink(oldAvatar, function (err) {
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
		@Req() req,
		@Body() updateCurrentUserDto: UpdateCurrentUserDto,
	): Promise<User> {
		console.log("req : ", req, "updateCurrentDto: ", updateCurrentUserDto)
		await this.userService.update(req.user.id, updateCurrentUserDto);
		return this.userService.findOne(req.user.id.toString());
	}
	// DELETE MY PROFILE
	@Delete()
	@Redirect('/')
	async deleteCurrentUser(@Req() req): Promise<void> {
		this.userService.remove(req.user.id);
	}
}

