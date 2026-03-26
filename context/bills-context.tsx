import { Bill, BillInput } from '@/types/bill';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type BillsContextType = {
  bills: Bill[];
  addBill: (bill: BillInput) => void;
  updateBill: (id: number, bill: BillInput) => void;
  deleteBill: (id: number) => void;
  getBillById: (id: number) => Bill | undefined;
};

const initialBills: Bill[] = [
  {
    id: 1,
    name: 'Готівка',
    type: 'готівка',
    balance: 1000,
    currency: 'грн.',
  },
  {
    id: 2,
    name: 'Картка',
    type: 'картка',
    balance: 5000,
    currency: 'дол.',
  },
];

const BillsContext = createContext<BillsContextType | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(initialBills);

  function addBill(bill: BillInput) {
    setBills((prevBills) => {
      const nextId = prevBills.length ? Math.max(...prevBills.map((item) => item.id)) + 1 : 1;
      return [...prevBills, { id: nextId, ...bill }];
    });
  }

  function updateBill(id: number, bill: BillInput) {
    setBills((prevBills) =>
      prevBills.map((item) => (item.id === id ? { id, ...bill } : item)),
    );
  }

  function deleteBill(id: number) {
    setBills((prevBills) => prevBills.filter((item) => item.id !== id));
  }

  function getBillById(id: number) {
    return bills.find((bill) => bill.id === id);
  }

  const value = useMemo(
    () => ({ bills, addBill, updateBill, deleteBill, getBillById }),
    [bills],
  );

  return <BillsContext.Provider value={value}>{children}</BillsContext.Provider>;
}

export function useBills() {
  const context = useContext(BillsContext);

  if (!context) {
    throw new Error('useBills must be used within BillsProvider');
  }

  return context;
}
