import { Router } from 'express';
import { ChatController } 
  from '@local_ai_bridge_dev_nestify/controller/ChatController';

export class ChatRoute {
  
  public static readonly router = 
    Router().post('/', ChatController.handle);
}
