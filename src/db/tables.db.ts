import { DbTable } from './table.db';
import { IUser, IUserUpdate } from './types/user.db.types';

export const Users = new DbTable<IUser, IUserUpdate>('users.json');
