import { spawn } from 'child_process'
import { Readable } from 'stream'
import { IRequest } from '@local_ai_bridge_dev_nestify/model/IRequest'

export class OllamaService {

  private static readonly model = 
    process.env.LOCAL_AI_BRIDGE_DEV_NESTIFY_OLLAMA_MODEL!;

  private static readonly searchHost = 
    process.env.LOCAL_AI_BRIDGE_DEV_NESTIFY_OLLAMA_SEARCH_HOST!;

  private static readonly chatHost = 
    process.env.LOCAL_AI_BRIDGE_DEV_NESTIFY_OLLAMA_CHAT_HOST!;

  static async runSearch(request: IRequest): Promise<string> {
    const proc = spawn(
      'ollama',
      ['run', this.model],
      {
        stdio: ['pipe','pipe','inherit'],
        env: { 
          OLLAMA_HOST: this.searchHost 
        }
      }
    );

    const prompt = `
      user: ${request.user.content},
      system: ${request.system.content}
  `.trim();
    proc.stdin.write(prompt + '\n');
    proc.stdin.end();

    let output = '';
    (proc.stdout as Readable).on('data', (buf) => {
      const text = buf.toString();
      console.log("[] OllamaService.runSearch.chunk:", text);
      output += text;
    });

    await new Promise(resolve => proc.on('close', resolve));

    return output.trim().replace(/^```json\s*|\s*```$/g, '').trim();
  }


  static streamChat(
    request: IRequest,
    onData: (chunk: string) => void,
    onEnd?: () => void
  ): void {

    const proc = spawn(
      'ollama',
      ['run', this.model],
      { stdio: ['pipe','pipe','inherit'],
        env: { 
          OLLAMA_HOST: this.chatHost 
        }
      },
    )

    const prompt = `${request.system.content}\nUser: ${request.user.content}\n`
    proc.stdin.write(prompt)
    proc.stdin.end();
    
    (proc.stdout as Readable).on('data', (buf) => {
      onData(buf.toString())
    })

    proc.on('close', () => {
      if (onEnd) onEnd()
    })
  }
}
