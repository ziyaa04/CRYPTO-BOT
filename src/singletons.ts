// create singletons
// apiAdaptersGenerator creates array of adapters
import { Logger } from 'tslog';
import MessageService from './services/message.service';
import CommandService from './services/command.service';
import apiAdaptersGenerator from './adapters/all.adapter';
import CommandController from './controllers/command.controller';

export const logger = new Logger();
export const messageService = new MessageService();
export const commandService = new CommandService(
  messageService,
  logger,
  apiAdaptersGenerator(),
);
export const commandController = new CommandController(commandService);
