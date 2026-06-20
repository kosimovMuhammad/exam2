import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Pencil,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GetDebtById, DeleteDebt, GetDebtPayments } from '@/lib/api';
import { PageHeader, LoadingSkeleton, ErrorAlert, ConfirmDialog } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { formatCurrency, formatDate, getDaysUntilDue, getDueDateStatus } from '@/lib/utils';
import { DEBT_STATUS_COLORS, DEBT_DIRECTION_COLORS } from '@/constants';
import type { Debt, Payment } from '@/types';

export default function DebtDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debt, setDebt] = useState<Debt | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchDebt = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [debtData, paymentsData] = await Promise.all([
        GetDebtById(id),
        GetDebtPayments(id).catch(() => []),
      ]);
      setDebt(debtData);
      setPayments(paymentsData || []);
    } catch {
      setError(t('debts.failedToLoadDetails'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebt();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await DeleteDebt(id);
      toast.success(t('debts.debtDeleted'));
      navigate('/debts');
    } catch {
      toast.error(t('debts.debtDeleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('debts.debtOverview')} />
        <LoadingSkeleton variant="details" />
      </div>
    );
  }

  if (error || !debt) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('debts.debtOverview')} />
        <ErrorAlert message={t('debts.failedToLoadDetails')} onRetry={fetchDebt} />
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(debt.amount - totalPaid, 0);
  const progress = debt.amount > 0 ? Math.round((totalPaid / debt.amount) * 100) : 0;
  const daysUntilDue = debt.due_date ? getDaysUntilDue(debt.due_date) : null;
  const dueStatus = debt.due_date ? getDueDateStatus(debt.due_date) : null;

  const infoItems = [
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: t('debts.totalAmount'),
      value: formatCurrency(debt.amount),
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: t('debts.totalPaid'),
      value: formatCurrency(totalPaid),
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: t('debts.remainingLabel'),
      value: formatCurrency(remaining),
      highlight: true,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: t('common.dueDate'),
      value: debt.due_date ? formatDate(debt.due_date) : t('common.notSet'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title={`${t('debts.title')} - ${formatCurrency(debt.amount)}`}
        description={debt.description || t('common.noDescription')}
        breadcrumbs={[
          { label: t('debts.title'), href: '/debts' },
          { label: t('common.details') },
        ]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/debts/${id}/edit`}>
                <Pencil className="w-4 h-4 mr-2" />
                {t('common.edit')}
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('common.delete')}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('debts.debtOverview')}</CardTitle>
                  <CardDescription>{debt.description || t('common.noDescription')}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={DEBT_STATUS_COLORS[debt.status]}>
                    {t(`common.${debt.status}`)}
                  </Badge>
                  <Badge className={DEBT_DIRECTION_COLORS[debt.direction]}>
                    {t(`debts.${debt.direction === 'they_owe_me' ? 'theyOweMe' : 'iOweThem'}`)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('debts.paymentProgress')}</span>
                    <span className="font-medium">{t('debts.percentPaid', { percent: progress })}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('debts.remaining', { amount: formatCurrency(remaining) })}</span>
                    <span>{t('debts.total', { amount: formatCurrency(debt.amount) })}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className={`font-semibold ${item.highlight ? 'text-destructive' : ''}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('debts.paymentHistory')}</CardTitle>
              <CardDescription>{t('debts.paymentsForDebt')}</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.paid_at || payment.created_at)}
                          </p>
                        </div>
                      </div>
                      {payment.note && (
                        <span className="text-sm text-muted-foreground">{payment.note}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {t('debts.noPaymentHistory')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('debts.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link to={`/payments/new?debtId=${id}`}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  {t('debts.makePayment')}
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/debts/${id}/edit`}>
                  <Pencil className="w-4 h-4 mr-2" />
                  {t('common.edit')}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {debt.due_date && (
            <Card>
              <CardHeader>
                <CardTitle>{t('debts.dueDateInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('common.dueDate')}</span>
                    <span className="font-semibold">{formatDate(debt.due_date)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('debts.daysUntilDue')}</span>
                    <Badge
                      variant={
                        dueStatus === 'overdue'
                          ? 'destructive'
                          : dueStatus === 'due_soon'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {daysUntilDue !== null && daysUntilDue < 0
                        ? t('common.daysOverdue', { count: Math.abs(daysUntilDue) })
                        : t('common.days', { count: daysUntilDue })}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t('debts.debtInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('common.created')}</span>
                <span>{formatDate(debt.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('common.lastUpdated')}</span>
                <span>{formatDate(debt.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('common.currency')}</span>
                <span>{debt.currency}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('debts.deleteDebt')}
        description={t('debts.deleteDebtConfirmFull')}
        confirmLabel={t('common.delete')}
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
