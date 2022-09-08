import { Schema, model } from 'mongoose';

export interface IUser {
  telegram_id: number;
  user_name: string;
  user_lastname: string;
  telegram_name: string;
  telegram_lang: string;
  is_bot: boolean;
  exchanges: string[];
  updated_at: string;
  created_at: string;
}
export const defaultTime = () => new Date().toUTCString();
const UserSchema = new Schema<IUser>({
  telegram_id: { type: Number, unique: true, required: true },
  user_name: { type: String, required: false, default: 'unknown' },
  user_lastname: { type: String, required: false, default: 'unknown' },
  telegram_name: {
    type: String,
    required: false,
    default: 'unknown',
  },
  telegram_lang: { type: String, required: false, default: 'unknown' },
  is_bot: { type: Boolean, required: true },
  exchanges: { type: [String] },
  updated_at: { type: String, default: defaultTime },
  created_at: { type: String, immutable: true, default: defaultTime },
});

export default model<IUser>('Users', UserSchema);
