import { useState, useEffect } from 'react';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentList } from '@/components/PaymentList';
import { PaymentStats } from '@/components/PaymentStats';
import { Payment } from '@/types/payment';
import { Wallet, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { toast } = useToast();

  // Load payments from localStorage on component mount
  useEffect(() => {
    const savedPayments = localStorage.getItem('bank-payments');
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }
  }, []);

  // Save payments to localStorage whenever payments change
  useEffect(() => {
    localStorage.setItem('bank-payments', JSON.stringify(payments));
  }, [payments]);

  const addPayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    setPayments(prev => [newPayment, ...prev]);
    toast({
      title: "Payment Added",
      description: `Payment to ${paymentData.payee} for $${paymentData.amount.toFixed(2)} has been recorded.`,
    });
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(payment => payment.id !== id));
    toast({
      title: "Payment Deleted",
      description: "The payment has been removed from your records.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-foreground/10 rounded-xl">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">Payment Tracker</h1>
              <p className="text-primary-foreground/80 mt-1">Manage your bank payments with ease</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Overview</h2>
            </div>
            <PaymentStats payments={payments} />
          </section>

          {/* Add Payment Form */}
          <section>
            <PaymentForm onAddPayment={addPayment} />
          </section>

          {/* Payment List */}
          <section>
            <PaymentList payments={payments} onDeletePayment={deletePayment} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
