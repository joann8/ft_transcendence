import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	Res,
	HttpException,
	HttpStatus,
	UsePipes,
	ValidationPipe,
	Req,
	Inject,
	forwardRef,
} from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationDto } from './dto/relation.dto';
import { Relation } from './entities/relation.entity';
import { UpdateRelationDto } from './dto/updateRelation.dto';
import { FindRelationDto } from './dto/findRelationdto';
import { GetRelationDto } from './dto/getRelationDto.dto';
import { getRepository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ParseOther } from './pipes/parseOther';
import { ParseUpdate } from './pipes/parseUpdate';
import { FriendDto } from './dto/friendDto';
import { ChannelService } from 'src/chat/channel/channel.service';

@Controller('relation')
export class RelationController {
	constructor(
		private readonly relationService: RelationService,
		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService,
	) {}

	@Get('all')
	async findAll() {
		const res = await this.relationService.findAll();
		if (!res.length)
			throw new HttpException(
				'Relation : All :  DB is empty',
				HttpStatus.OK,
			);
		else return res;
	}

	/*json payload body { 
    id_pseudo1 : "id_pseudo",
    id_pseudo2: "id_pseudo"
  }*/
	@Get('one/:id_pseudo')
	@UsePipes(new ValidationPipe({ transform: true }))
	async findOne(
		@Req() req,
		@Param(ParseOther) getRelationRequest: GetRelationDto,
	): Promise<Relation> {
		// null (les users sont inconnus) ou Objet Relation

		const findRelationRequest: FindRelationDto = {
			userId1: req.user.id,
			userId2: getRelationRequest.otherUser.id,
		};
		const ret = await this.relationService.findOne(findRelationRequest);
		if (!ret)
			throw new HttpException(
				'Relation : GetrelationInDatabase : No relation found',
				HttpStatus.NO_CONTENT,
			);
		else {
			return ret;
		}
	}

	@Get('request')
	async findFriendRequest(@Req() req): Promise<User[]> {
		//Get all friend Request in a Relation[]
		const relationFriendRequestArray =
			await this.relationService.findAllMyFriendRequest(req.user.id);
		const userFriendRequestArray = [];

		//Convert Relation[] to User[]
		for (const item of relationFriendRequestArray) {
			//Extract User from Relation[index]
			const otherGuyId =
				item.relation1 === 1 ? item.userId1bis : item.userId2bis;
			const otherGuy = await getRepository(User).findOne(otherGuyId);
			userFriendRequestArray.push(otherGuy);
		}
		return userFriendRequestArray as User[];
	}

	@Get('friends')
	async findFriends(@Req() req): Promise<FriendDto[]> {
		const friendArray: FriendDto[] = [];
		const relationFriendArray = await this.relationService.findAllMyFriend(
			req.user.id,
		);
		for (const item of relationFriendArray) {
			const friendId =
				item.userId1bis === req.user.id
					? item.userId2bis
					: item.userId1bis;
			const friendUser = await getRepository(User).findOne(friendId);
			const findRelationRequest: FindRelationDto = {
				userId1: req.user.id,
				userId2: friendId,
			};
			const relationFriend = await this.relationService.findOne(
				findRelationRequest,
			);
			const friendComplete: FriendDto = {
				user: friendUser,
				relation:
					req.user.id === relationFriend.userId1bis
						? relationFriend.relation1
						: relationFriend.relation2,
			};
			friendArray.push(friendComplete);
		}
		return friendArray as FriendDto[];
	}

	/*json body {
    //user to update
    id_pseudo1: ""
    id_pseudo2: "",
    //relation to update 
    relation1: "",
    relation2: "",
  
    //en options (a supprimer ? )
    userId1 : number,
    userId2 : number
  }*/
	@Put('update')
	@UsePipes(new ValidationPipe({ transform: true }))
	async update(
		@Req() req,
		@Body(ParseUpdate) relationRequest: RelationDto,
	): Promise<Relation> {
		//Complete relationRequest with currentUser info
		relationRequest.id_pseudo1 = req.user.id_pseudo;
		relationRequest.userId1 = req.user.id;
		relationRequest.userId1bis = req.user.id;

		//Create Needle to find to relation between Users
		const findRelationRequest: FindRelationDto = {
			userId1: relationRequest.userId1,
			userId2: relationRequest.userId2,
		};

		//Find relation if exist with [NEEDLE]
		const relationInDatabase = await this.relationService.findOne(
			findRelationRequest,
		);

		//If relation does not exist create it with the REQUEST parameters
		if (!relationInDatabase) {
			const newRelation = await this.relationService.create(
				relationRequest,
			);

			return newRelation;
		} else {
			//If exist UPDATE it with the REQUEST parameters
			let updateRelationRequest = new UpdateRelationDto();
			//Update les stauts au bon endroit

			updateRelationRequest.relation1 =
				relationRequest.userId1 === relationInDatabase.userId1bis
					? relationRequest.relation1
					: relationRequest.relation2;
			updateRelationRequest.relation2 =
				relationRequest.userId2 === relationInDatabase.userId2bis
					? relationRequest.relation2
					: relationRequest.relation1;
			updateRelationRequest.id = relationInDatabase.id;

			await this.relationService.update(updateRelationRequest);
			if (
				relationRequest.relation1 === 3 &&
				relationRequest.relation2 === 3
			) {
				const one = await getRepository(User).findOne(
					relationRequest.userId1bis,
				);
				const two = await getRepository(User).findOne(
					relationRequest.userId2bis,
				);
				await this.channelService.createDirectChannel(one, two);
			}
			const upDatedRelation = await this.relationService.findOne(
				findRelationRequest,
			);
			return upDatedRelation;
		}
	}

	//Si on est deja friends ou block
	@Delete('remove')
	@UsePipes(new ValidationPipe({ transform: true }))
	async remove(
		@Req() req,
		@Body(ParseOther) getRelationRequest: GetRelationDto,
	) {
		//try catch ? si remove ou findOne fail
		const relationToRemove = await this.relationService.findOne({
			userId1: req.user.id,
			userId2: getRelationRequest.otherUser.id,
		});
		if (!relationToRemove)
			throw new HttpException(
				'Relation : DeleteByPseudo : Not existing relationship',
				HttpStatus.OK,
			);
		const one = await getRepository(User).findOne(
			relationToRemove.userId1bis,
		);
		const two = await getRepository(User).findOne(
			relationToRemove.userId2bis,
		);
		await this.channelService.deleteDirectChannel(one, two);
		return await this.relationService.remove(relationToRemove.id);
	}

	@Get('blocked')
	async getBlockedList(@Req() req): Promise<number[]> {
		return await this.relationService.findAllBlocked(req.user.id);
	}
}
