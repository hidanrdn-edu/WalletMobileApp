export type Bill = {
  id: number;
  name: string;
  type: string;
  balance: number;
  currency: string;
};

export type BillInput = {
  name: string;
  type: string;
  balance: number;
  currency: string;
};
