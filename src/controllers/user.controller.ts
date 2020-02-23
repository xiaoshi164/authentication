import {
	Count,
	CountSchema,
	Filter,
	repository,
	Where,
} from '@loopback/repository';
import {
	post,
	param,
	get,
	getFilterSchemaFor,
	getModelSchemaRef,
	getWhereSchemaFor,
	patch,
	put,
	del,
	requestBody,
} from '@loopback/rest';
import { User } from '../models';
import { UserRepository } from '../repositories';
import bcrypt from 'bcrypt';

class CredentialsClass {
	username: string;
	password: string;
}

export class UserController {

	constructor(@repository(UserRepository) public userRepository: UserRepository, ) { }


	//获取用户数据的Token
	@post("/get_user_token")
	async getUserToken(@requestBody() credentials: CredentialsClass): Promise<Object> {
		let user = await this.userRepository.findOne({ 'where': { 'username': credentials.username } });

		if (!user) { return { error: "没有查询到数据" } }

		const validPassword = bcrypt.compare(credentials.password, user.password);
		if (!validPassword) { return { error: "密码错误" } };

		const token = user.generateAuthToke();   //获取token
		return {
			'token': token
		}
	}

	@post('/users', {
		responses: {
			'200': {
				description: 'User model instance',
				content: { 'application/json': { schema: getModelSchemaRef(User) } },
			},
		},
	})
	async create(
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(User, {
						title: 'NewUser',
						exclude: ['_id'],
					}),
				},
			},
		})
		user: Omit<User, '_id'>,
	): Promise<User> {
		return this.userRepository.create(user);
	}

	@get('/users', {
		responses: {
			'200': {
				description: 'Array of User model instances',
				content: {
					'application/json': {
						schema: {
							type: 'array',
							items: getModelSchemaRef(User, { includeRelations: true }),
						},
					},
				},
			},
		},
	})
	async find(
		@param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter<User>,
	): Promise<User[]> {
		return this.userRepository.find(filter);
	}

	@get('/users/{id}', {
		responses: {
			'200': {
				description: 'User model instance',
				content: {
					'application/json': {
						schema: getModelSchemaRef(User, { includeRelations: true }),
					},
				},
			},
		},
	})
	async findById(
		@param.path.string('id') id: object,
		@param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter<User>
	): Promise<User> {
		return this.userRepository.findById(id, filter);
	}


	@del('/users/{id}', {
		responses: {
			'204': {
				description: 'User DELETE success',
			},
		},
	})
	async deleteById(@param.path.string('id') id: object): Promise<void> {
		await this.userRepository.deleteById(id);
	}
}
