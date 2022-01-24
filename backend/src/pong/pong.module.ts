import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pong } from "./entities/pong.entity";
import { PongController } from "./pong.controller";
import { PongGateway } from "./pong.gateway";
import { PongService } from "./pong.service";

@Module({
    imports: [TypeOrmModule.forFeature([Pong])],
    exports: [TypeOrmModule, PongService],
    providers: [PongService, PongGateway],
    controllers: [PongController],
})
export class PongModule{};
