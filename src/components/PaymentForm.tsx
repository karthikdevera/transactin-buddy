import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Payment, PaymentMethod, PaymentCategory } from '@/types/payment';
import { Plus, DollarSign } from 'lucide-react';

interface PaymentFormProps {
  onAddPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
];

const categories: { value: PaymentCategory; label: string }[] = [
  { value: 'bills', label: 'Bills & Utilities' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'rent', label: 'Rent & Housing' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'other', label: 'Other' },
];

export function PaymentForm({ onAddPayment }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    payee: '',
    method: '' as PaymentMethod,
    category: '' as PaymentCategory,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.payee || !formData.method || !formData.category) {
      return;
    }

    onAddPayment({
      date: formData.date,
      amount: parseFloat(formData.amount),
      payee: formData.payee,
      method: formData.method,
      category: formData.category,
      description: formData.description,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      payee: '',
      method: '' as PaymentMethod,
      category: '' as PaymentCategory,
      description: '',
    });
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Plus className="h-4 w-4 text-primary-foreground" />
          </div>
          Add New Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-10"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payee">Payee</Label>
              <Input
                id="payee"
                placeholder="Who did you pay?"
                value={formData.payee}
                onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value: PaymentMethod) =>
                  setFormData({ ...formData, method: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: PaymentCategory) =>
                setFormData({ ...formData, category: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-primary hover:shadow-button">
            Add Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}