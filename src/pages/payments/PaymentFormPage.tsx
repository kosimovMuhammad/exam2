import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save, CalendarIcon, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector, fetchDebts, createDebtPayment } from '@/store';
import { paymentSchema, PaymentFormData } from '@/lib/utils';
import { PageHeader } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function PaymentFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const preselectedDebtId = searchParams.get('debtId');
  const { t } = useTranslation();

  const { items: debts } = useAppSelector((state) => state.debts);
  const [selectedDebt, setSelectedDebt] = useState(preselectedDebtId || '');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      note: '',
      payment_date: '',
    },
  });

  const amountValue = watch('amount');

  useEffect(() => {
    dispatch(fetchDebts({}));
  }, [dispatch]);

  useEffect(() => {
    if (selectedDate) {
      setValue('payment_date', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, setValue]);

  const selectedDebtData = debts.find((d) => d.id === selectedDebt);

  const onSubmit = async (data: PaymentFormData) => {
    if (!selectedDebt) {
      toast.error(t('payments.selectDebtError'));
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createDebtPayment({
        debtId: selectedDebt,
        data: {
          amount: data.amount,
          note: data.note || undefined,
          paid_at: data.payment_date,
        }
      })).unwrap();
      toast.success(t('payments.paymentRecorded'));
      navigate('/payments');
    } catch {
      toast.error(t('payments.paymentFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title={t('payments.recordPayment')}
        description={t('payments.logPayment')}
        breadcrumbs={[
          { label: t('payments.title'), href: '/payments' },
          { label: t('common.record') },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('payments.paymentDetails')}</CardTitle>
            <CardDescription>
              {t('payments.enterPaymentInfo')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="debtId">{t('payments.selectDebt')} *</Label>
                <Select value={selectedDebt} onValueChange={setSelectedDebt}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('payments.selectDebtPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {debts.map((debt) => (
                      <SelectItem key={debt.id} value={debt.id}>
                        {debt.description || t('payments.untitled')} - {formatCurrency(debt.amount)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDebtData && (
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('payments.totalAmount')}</span>
                    <span className="font-semibold">{formatCurrency(selectedDebtData.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('common.status')}</span>
                    <span>{t(`common.${selectedDebtData.status}`)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('common.currency')}</span>
                    <span>{selectedDebtData.currency}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">{t('common.amount')} *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={`pl-9 ${errors.amount ? 'border-destructive' : ''}`}
                    {...register('amount', { valueAsNumber: true })}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount.message}</p>
                )}
                {selectedDebtData && amountValue > selectedDebtData.amount && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {t('payments.amountExceedsWarning')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('payments.paymentDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : t('common.today')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">{t('common.note')}</Label>
                <Textarea
                  id="note"
                  placeholder={t('payments.notePlaceholder')}
                  {...register('note')}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/payments')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('payments.recording')}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t('payments.recordPayment')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('payments.paymentTips')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong>{t('payments.tipAccurate')}</strong> {t('payments.tipAccurateDesc')}
              </p>
              <p>
                <strong>{t('payments.tipNotes')}</strong> {t('payments.tipNotesDesc')}
              </p>
              <p>
                <strong>{t('payments.tipDate')}</strong> {t('payments.tipDateDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
