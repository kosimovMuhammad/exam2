import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector, fetchAllPayments } from '@/store';
import { PageHeader, LoadingSkeleton, ErrorAlert, EmptyState } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import type { Payment } from '@/types';

interface PaymentWithDebt extends Payment {
  debtDescription?: string;
  debtAmount?: number;
}

export default function PaymentsListPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { items: payments, status, error } = useAppSelector((state) => state.payments);
  const isLoading = status === 'loading' || status === 'idle';

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  if (isLoading && payments.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('payments.title')} description={t('payments.trackPayments')} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (error && payments.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('payments.title')} />
        <ErrorAlert message={error} onRetry={() => dispatch(fetchAllPayments())} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title={t('payments.title')}
        description={t('payments.trackManage')}
        action={
          <Button asChild>
            <Link to="/payments/new" id="new-payment-link">
              <Plus className="w-4 h-4 mr-2" />
              {t('payments.recordPayment')}
            </Link>
          </Button>
        }
      />

      <div className="pt-2">
        {payments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
            <EmptyState
              icon={Receipt}
              title={t('payments.noPayments')}
              description={t('payments.startRecording')}
              action={{
                label: t('payments.recordPayment'),
                onClick: () => document.getElementById('new-payment-link')?.click(),
              }}
            />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
              {(payments as PaymentWithDebt[]).map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:bg-slate-900/50 dark:hover:bg-slate-900/50 transition-all duration-300 border-b-2 border-b-transparent hover:border-b-teal-500 hover:shadow-[0_4px_15px_-3px_rgba(20,184,166,0.3)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:ring-2 group-hover:ring-teal-500 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]">
                            <Receipt className="w-6 h-6 text-primary group-hover:text-teal-400 transition-colors" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-lg">
                                {formatCurrency(payment.amount)}
                              </span>
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                {t('common.paid')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(payment.paid_at || payment.created_at)} • {formatRelativeTime(payment.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {payment.debt_id && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/debts/${payment.debt_id}`}>
                                <CreditCard className="w-4 h-4 mr-2" />
                                {t('payments.viewDebt')}
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>

                      {(payment.note || payment.debtDescription) && (
                        <div className="mt-3 p-2 rounded bg-muted text-sm text-muted-foreground">
                          {payment.debtDescription && (
                            <span className="font-medium">{payment.debtDescription}</span>
                          )}
                          {payment.note && (
                            <span>{payment.debtDescription ? ' — ' : ''}{payment.note}</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
        )}
      </div>
    </motion.div>
  );
}
