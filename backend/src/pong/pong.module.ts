import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Challenge } from "./entities/challenge.entity";
import { Pong } from "./entities/pong.entity";
import { PongController } from "./pong.controller";
import { PongGateway } from "./pong.gateway";
import { PongService } from "./pong.service";

@Module({
    imports: [TypeOrmModule.forFeature([Pong, User, Challenge])],
    exports: [TypeOrmModule, PongService, UserService],
    providers: [PongService, PongGateway, UserService],
    controllers: [PongController],
})
export class PongModule{};
