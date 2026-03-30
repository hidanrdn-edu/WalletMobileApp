export type Bill = {
  id: number;
  userId: number;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
};

export type BillInput = {
  name: string;
  balance: number;
};
