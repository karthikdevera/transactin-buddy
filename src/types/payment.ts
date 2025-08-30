export interface Payment {
  id: string;
  date: string;
  amount: number;
  payee: string;
  method: 'debit_card' | 'bank_transfer' | 'credit_card' | 'cash' | 'check';
  category: 'bills' | 'groceries' | 'rent' | 'entertainment' | 'transportation' | 'healthcare' | 'other';
  description?: string;
  createdAt: string;
}

export type PaymentMethod = Payment['method'];
export type PaymentCategory = Payment['category'];