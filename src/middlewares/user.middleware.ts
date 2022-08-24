import { Context } from 'telegraf';
import UserSchema from '../schemas/user.schema';

export default (ctx: Context, next) => {
  next();
};
