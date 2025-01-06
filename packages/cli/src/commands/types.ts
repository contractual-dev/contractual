export const Target = {
  Client: 'Client',
  Fixtures: 'Fixtures',
};

export type Target = (typeof Target)[keyof typeof Target];

export interface GenerateClientOptions {
  openapi: string;
  output?: string;
}
