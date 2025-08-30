import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Payment, PaymentCategory } from '@/types/payment';
import { Search, Filter, Calendar, DollarSign, Trash2 } from 'lucide-react';

interface PaymentListProps {
  payments: Payment[];
  onDeletePayment: (id: string) => void;
}

const categoryColors: Record<PaymentCategory, string> = {
  bills: 'bg-destructive/10 text-destructive border-destructive/20',
  groceries: 'bg-success/10 text-success border-success/20',
  rent: 'bg-warning/10 text-warning border-warning/20',
  entertainment: 'bg-primary/10 text-primary border-primary/20',
  transportation: 'bg-accent/10 text-accent border-accent/20',
  healthcare: 'bg-muted text-muted-foreground border-muted',
  other: 'bg-secondary text-secondary-foreground border-secondary',
};

const methodLabels = {
  debit_card: 'Debit Card',
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  cash: 'Cash',
  check: 'Check',
};

export function PaymentList({ payments, onDeletePayment }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = payment.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || payment.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Calendar className="h-4 w-4 text-primary-foreground" />
          </div>
          Payment History
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: 'date' | 'amount') => setSortBy(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="amount">Sort by Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No payments found</p>
            <p className="text-sm text-muted-foreground">
              {payments.length === 0 ? 'Add your first payment above' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-foreground">{payment.payee}</h3>
                    <Badge className={categoryColors[payment.category]}>
                      {payment.category.charAt(0).toUpperCase() + payment.category.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatDate(payment.date)}</span>
                    <span>{methodLabels[payment.method]}</span>
                    {payment.description && (
                      <span className="hidden sm:inline truncate max-w-[200px]">
                        {payment.description}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-foreground">
                    ${payment.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeletePayment(payment.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}