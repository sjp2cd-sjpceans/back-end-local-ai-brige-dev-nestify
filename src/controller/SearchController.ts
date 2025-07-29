import { Request, Response } from 'express';
import { IRequest } 
  from '@local_ai_bridge_dev_nestify/model/IRequest';
import { IResponse } 
  from '@local_ai_bridge_dev_nestify/model/IResponse';
import { OllamaService } 
  from '@local_ai_bridge_dev_nestify/service/OllamaService';

export class SearchController {

  static async handle(req: Request, res: Response): Promise<void> {

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const clientRequest = req.body as IRequest;

    if (!clientRequest) {
      res.status(400).json({ error: 'Request body is missing' });
      return;
    }
    
    if (!clientRequest.type) {
      res.status(400).json({ error: 'Type is required' });
      return;
    }
    
    if (clientRequest.type !== 'search-engine') {
      res.status(400).json({ error: 'Invalid type, expected search‑engine' });
      return;
    }

    if (!clientRequest.system || !clientRequest.system.content) {
      res.status(400).json({ error: 'System message is required' });
      return;
    }

    if (!clientRequest.user || !clientRequest.user.content) {
      res.status(400).json({ error: 'User message is required' });
      return;
    }

    try {

      const raw = await OllamaService.runSearch(clientRequest);
      const parsed = JSON.parse(raw) as Record<string, unknown>[];

      const response: IResponse = {

        type: 'search-engine',
        content: parsed
      };

      res.json(response);

    } catch (err) {

      console.error('[] SearchController.error:', err);
      res.status(500).json({ error: '[] LLM search failed' });
    }
  }
}
