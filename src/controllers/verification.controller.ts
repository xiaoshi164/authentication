import { Request, RestBindings, get, ResponseObject } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';

export class VerificationController {
  constructor() { }

  @get('/verification_token')
  @authenticate('basic')
  ping() {
    console.log("验证token");
    return '验证成功';
  }
}
