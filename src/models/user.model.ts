import {Entity, model, property} from '@loopback/repository';
//导入
import jwt from 'jsonwebtoken';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'object',
    id:true
  })
  _id?: object;

  @property({
    type: 'string',
  })
  address?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }

  //加载获取Toke的方法
  generateAuthToke(){
    const token=jwt.sign({_id:this._id,username:this.username,password:this.password,address:this.address},'TheVerySecurePrivateKey');
    return token;
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;