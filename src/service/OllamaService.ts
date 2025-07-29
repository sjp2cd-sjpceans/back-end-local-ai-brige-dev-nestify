import { spawn } from 'child_process';
import { Readable } from 'stream';
import { IRequest } from '@local_ai_bridge_dev_nestify/model/IRequest';

export class OllamaService {

  private static readonly model = process.env.LOCAL_AI_BRIDGE_DEV_NESTIFY_OLLAMA_MODEL!;
  private static readonly host = process.env.LOCAL_AI_BRIDGE_DEV_NESTIFY_OLLAMA_HOST!;

  static async runSearch(
    request: IRequest
  ): Promise<string> {

    const args = ['query', this.model, '--json'];
    const proc = spawn(
      'ollama', 
      args, 
      { stdio: ['pipe', 'pipe', 'inherit'] }
    );
    const prompt = 
      `${request.system.content}\nUser: ${request.user.content}`;

    proc.stdin.write(JSON.stringify({ prompt }));
    proc.stdin.end();

    let output = '';
    for await (const chunk of (proc.stdout as Readable)) {

      output += chunk.toString();
    }

    await new Promise((resolve) => proc.on('close', resolve));

    return output;
  }

  static streamChat(
    request: IRequest, 
    onData: (chunk: string) => void
  ): void {

    const args = ['chat', this.model, '--stream'];
    const proc = spawn(
      'ollama', 
      args, 
      { stdio: ['pipe', 'pipe', 'inherit'] }
    );
    const prompt = 
      `${request.system.content}\nUser: ${request.user.content}`;

    proc.stdin.write(JSON.stringify({ prompt }));
    proc.stdin.end();

    (proc.stdout as Readable).on('data', (buf) => {

      onData(buf.toString());
    });
  }
}
