import { Bill, BillInput } from '@/types/bill';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/providers/AuthProvider';
import {
  createAccountForUser,
  deleteAccountForUser,
  listAccountsByUser,
  updateAccountForUser,
} from '@/services/accounts';

type BillsContextType = {
  bills: Bill[];
  addBill: (bill: BillInput) => Promise<void>;
  updateBill: (id: number, bill: BillInput) => Promise<void>;
  deleteBill: (id: number) => Promise<void>;
  getBillById: (id: number) => Bill | undefined;
  refreshBills: () => Promise<void>;
  isLoading: boolean;
};

const BillsContext = createContext<BillsContextType | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBills = useCallback(async () => {
    if (!currentUser) {
      setBills([]);
      return;
    }

    setIsLoading(true);

    try {
      const accounts = await listAccountsByUser(currentUser.id);
      setBills(accounts);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void loadBills();
  }, [loadBills]);

  async function addBill(bill: BillInput) {
    if (!currentUser) {
      throw new Error('User must be logged in to add a bill.');
    }

    await createAccountForUser(currentUser.id, bill);
    await loadBills();
  }

  async function updateBill(id: number, bill: BillInput) {
    if (!currentUser) {
      throw new Error('User must be logged in to update a bill.');
    }

    await updateAccountForUser(currentUser.id, id, bill);
    await loadBills();
  }

  async function deleteBill(id: number) {
    if (!currentUser) {
      throw new Error('User must be logged in to delete a bill.');
    }

    await deleteAccountForUser(currentUser.id, id);
    await loadBills();
  }

  function getBillById(id: number) {
    return bills.find((bill) => bill.id === id);
  }

  const value = useMemo(
    () => ({ bills, addBill, updateBill, deleteBill, getBillById, refreshBills: loadBills, isLoading }),
    [bills, isLoading, loadBills],
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
