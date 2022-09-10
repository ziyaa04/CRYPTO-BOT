export interface IUser {
  telegram_id: number;
  user_name: string;
  user_lastname: string;
  telegram_name: string;
  telegram_lang: string;
  is_bot: boolean;
  exchanges: string[];
}
export interface IUserUpdate {
  telegram_id?: number;
  user_name?: string;
  user_lastname?: string;
  telegram_name?: string;
  telegram_lang?: string;
  is_bot?: boolean;
  exchanges?: string[];
}
