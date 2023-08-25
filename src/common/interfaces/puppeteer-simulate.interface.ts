import { Cookie } from './cookie.interface';

export interface SimulateResponse {
  cookies: Cookie[];
  headers: Record<string, string>;
}
