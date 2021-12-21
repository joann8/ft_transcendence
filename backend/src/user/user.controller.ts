import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { error } from 'console';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService : UserService) {}
    @Post()
    createUser(@Body() createUserDto : CreateUserDto) {
        return this.userService.createEntity(createUserDto);
    }

    @Get()
    getAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    getOne(@Param() userId : string) {
        return this.userService.findOne(userId);
    }

    @Delete(':id')
    removeOne(@Param() userId : string ) {
        return this.userService.remove(userId);
    }

}
