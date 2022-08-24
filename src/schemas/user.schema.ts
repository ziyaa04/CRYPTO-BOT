import { Schema, model, Document } from 'mongoose';

export interface IUser {
  telegram_id: number;
  exchanges: string[];
  updated_at: string;
  created_at: string;
}
export const defaultTime = () => new Date().toUTCString();
const UserSchema = new Schema<IUser>({
  telegram_id: { type: Number, unique: true, required: true },
  exchanges: { type: [String] },
  updated_at: { type: String, default: defaultTime },
  created_at: { type: String, immutable: true, default: defaultTime },
});

export default model<IUser>('Users', UserSchema);
