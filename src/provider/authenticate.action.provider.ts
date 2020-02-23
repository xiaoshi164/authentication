// import { Provider, inject, Getter, Setter } from "@loopback/core";
// import { AuthenticationBindings, AuthenticationStrategy, AuthenticateFn, USER_PROFILE_NOT_FOUND } from "@loopback/authentication";
// import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
// import { Request} from '@loopback/rest'

// export class AuthenticateActionProvider implements Provider<AuthenticateFn> {
//     constructor(
//        //提供程序是为Sequence构造函数实例化的，
//        //那时我们没有关于当前的信息
//        //尚未路由。 需要此信息来确定
//        //应该使用哪种身份验证策略。
//        //为了解决这个问题，我们正在注入一个getter函数，该函数将
//        //推迟策略的解析，直到authenticate（）动作为止
//        //执行。
//       @inject.getter(AuthenticationBindings.STRATEGY)
//       readonly getStrategy: Getter<AuthenticationStrategy>,
//       @inject.setter(SecurityBindings.USER)
//       readonly setCurrentUser: Setter<UserProfile>,
//     ) {}
  
//     /**
//      * @returns authenticateFn
//      */
//     value(): AuthenticateFn {
//       return request => this.action(request);
//     }
  
//     /**
//      * authenticate（）序列操作的实现。
//      * @param request The incoming request provided by the REST layer
//      */
//     async action(request: Request): Promise<UserProfile | undefined> {
//       const strategy = await this.getStrategy();
//       if (!strategy) {
//         // The invoked operation does not require authentication.
//         return undefined;
//       }
  
//       const userProfile = await strategy.authenticate(request);
//       if (!userProfile) {
//         // important to throw a non-protocol-specific error here
//         let error = new Error(
//           `User profile not returned from strategy's authenticate function`,
//         );
//         Object.assign(error, {
//           code: USER_PROFILE_NOT_FOUND,
//         });
//         throw error;
//       }
  
//       this.setCurrentUser(userProfile);
//       return userProfile;
//     }
//   }