import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Payment } from '@/types/payment';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

interface PaymentStatsProps {
  payments: Payment[];
}

export function PaymentStats({ payments }: PaymentStatsProps) {
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const thisMonthPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const categoryTotals = payments.reduce((acc, payment) => {
    acc[payment.category] = (acc[payment.category] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];

  const stats = [
    {
      title: 'Total Payments',
      value: `$${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      description: `${payments.length} transactions`,
      gradient: 'bg-gradient-primary'
    },
    {
      title: 'This Month',
      value: `$${thisMonthTotal.toFixed(2)}`,
      icon: Calendar,
      description: `${thisMonthPayments.length} payments`,
      gradient: 'bg-gradient-success'
    },
    {
      title: 'Average Payment',
      value: payments.length > 0 ? `$${(totalAmount / payments.length).toFixed(2)}` : '$0.00',
      icon: TrendingUp,
      description: 'Per transaction',
      gradient: 'bg-gradient-primary'
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1) : 'None',
      icon: CreditCard,
      description: topCategory ? `$${topCategory[1].toFixed(2)}` : '$0.00',
      gradient: 'bg-gradient-success'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.gradient}`}>
                <stat.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}