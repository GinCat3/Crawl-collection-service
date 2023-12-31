export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  size?: number;
  httpOnly?: boolean;
  secure?: boolean;
  session?: boolean;
  sameParty?: boolean;
  sourceScheme?: string;
  sourcePort?: number;
}
