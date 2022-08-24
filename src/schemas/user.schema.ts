import { Schema, model } from 'mongoose';

export interface IUser {
  telegram_id: number;
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
  telegram_name: { type: String, unique: true, required: true },
  telegram_lang: { type: String, required: true },
  is_bot: { type: Boolean, required: true },
  exchanges: { type: [String] },
  updated_at: { type: String, default: defaultTime },
  created_at: { type: String, immutable: true, default: defaultTime },
});

export default model<IUser>('Users', UserSchema);
