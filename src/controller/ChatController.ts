import { Request, Response } from 'express';
import { IRequest } 
  from '@local_ai_bridge_dev_nestify/model/IRequest';
import { OllamaService } 
  from '@local_ai_bridge_dev_nestify/service/OllamaService';

export class ChatController {

  static handle(req: Request, res: Response): void {

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    if (!req.body) {
      res.status(400).json({ error: 'Request body is missing' });
      return;
    }

    if (!req.body.type) {
      res.status(400).json({ error: 'Type is required' });
      return;
    }

    if (!req.body.system || !req.body.system.content) {
      res.status(400).json({ error: 'System message is required' });
      return;
    }

    if (!req.body.user || !req.body.user.content) {
      res.status(400).json({ error: 'User message is required' });
      return;
    }
    
    const clientRequest = req.body as IRequest;

    if (clientRequest.type !== 'chat') {
      res.status(400).json({ error: 'Invalid type, expected chat' });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    OllamaService.streamChat(clientRequest,
      (chunk) => {
        console.log('[Ollama Chunk]', chunk);
        res.write(`data: ${chunk.replace(/\n/g, '\\n')}\n\n`);
        res.flushHeaders();
      },
      () => {
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    );

    // OllamaService.streamChat(clientRequest, (chunk) => {
      
    //   res.write(`data: ${chunk.replace(/\n/g, '\\n')}\n\n`);
    // });

    // req.on('close', () => {
    //   res.end();
    // });
  }
}
