import { AuthenticationStrategy } from "@loopback/authentication";
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { Request, HttpErrors } from '@loopback/rest';
import jwt from 'jsonwebtoken';
import { UserRepository } from './repositories';
import { repository } from "@loopback/repository";
export interface Credentials {
    username: string;
    password: string;
}

export class BasicAuthenticationStrategy implements AuthenticationStrategy {
    name: string = 'basic';

    //导入操作数据库Repository
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
    ) { }

    async authenticate(request: Request): Promise<UserProfile | undefined> {
        //1.从请求头中获取数据用户账号和密码
        // const credentials: Credentials = this.extractCredentials(request);

        //2.从请求头中回去Tocken
        const credentialsTomen: Credentials = this.extractCredentialsToken(request);

        //查询从数据库
        const user = this.userRepository.findOne({ where: { username: credentialsTomen.username } }) //查询数据库
        //两个数据作比较查询的作比较
        const userProfile = Object.assign(user);    //判断是否相
        return userProfile;
    }

    /**
    * 从授权标头中提取“基本”用户凭证的代码
    */
    extractCredentials(request: Request): Credentials {
        var creds: Credentials;

        let authHeaderValue = request.headers.authorization   //看携带不携带头部
        if (!authHeaderValue) {
            throw new HttpErrors.Unauthorized('没有请求头');
        }
        if (!authHeaderValue.startsWith('Basic')) {
            throw new HttpErrors.Unauthorized('请求头不是：Basic'); //判断是什么请求头
        }
        //分为数组
        const parts = authHeaderValue.split(' ');   //拆分
        const encryptedCredentails = parts[1];      //拿到输入的base64,转换
        //拿到请求输入的参数
        const decryptedCredentails = Buffer.from(encryptedCredentails, 'base64').toString('utf8');
        const decryptedParts = decryptedCredentails.split(':');
        if (decryptedParts.length !== 2) {
            throw new HttpErrors.Unauthorized('没有输入用户或者密码！！');
        }
        creds = { username: decryptedParts[0], password: decryptedParts[1] }    //返回给后台查询数据
        return creds;
    }

    //拿到请求头的Tocken,从Token中拿到账号和密码
    extractCredentialsToken(request: Request): Credentials {
        var creds: Credentials;
        //拿到请求头
        let authHeaderValue = request.headers.authorization;

        if (!authHeaderValue) {
            throw new HttpErrors.Unauthorized('没有请求头');
        }
        if (!authHeaderValue.startsWith('Bearer')) {
            throw new HttpErrors.Unauthorized('请求头不是：Bearer');
        }

        const parts = authHeaderValue.split(' ');   //拆分获取到token
        const token = parts[1];                     //拿到token

        /***问题****/
        const user1 = jwt.verify(token, 'TheVerySecurePrivateKey');

        console.log(user1); console.log(typeof user1);

        // creds ={username:user1.username, password:user1.password}

        /*****解决****/
        const user = JSON.stringify(jwt.verify(token, 'TheVerySecurePrivateKey'));
        const obj = JSON.parse(user);

        console.log(obj); console.log(typeof obj);

        creds = { username: obj.username, password: obj.password }       //转回对象

        return creds;
    }
}
