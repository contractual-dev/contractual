export const Target = {
  Contract: 'Contract',
  Fixtures: 'Fixtures',
};

export type Target = (typeof Target)[keyof typeof Target];

export interface GenerateContractsOptions {
  openapi?: string;
  output?: string;
}
