
import { Mode, IMessage } from "./IMessage";

export interface IResponse {

  type: Mode;
  content: IMessage[] | Record<string, unknown>[];
}