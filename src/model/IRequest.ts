
import { IMessage, Mode } from "./IMessage";


export interface IRequest {

  type: Mode;
  system: IMessage;
  user: IMessage;
}