import { Router } from 'express';
import { SearchController } 
  from '@local_ai_bridge_dev_nestify/controller/SearchController';

export class SearchRoute {
  
  public static readonly router = 
    Router().post('/', SearchController.handle);
}
