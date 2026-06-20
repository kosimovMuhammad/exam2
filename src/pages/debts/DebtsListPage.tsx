import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  CreditCard,
  Trash2,
  Pencil,
  Eye,
  MoreVertical,
  Folder,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GetDebts, DeleteDebt, GetContacts } from '@/lib/api';
import { PageHeader, LoadingSkeleton, ErrorAlert, EmptyState, ConfirmDialog } from '@/components/common';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DEBT_STATUS_COLORS, DEBT_DIRECTION_COLORS } from '@/constants';
import type { Debt } from '@/types';

export default function DebtsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const folderName = searchParams.get('folderName');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  const fetchDebts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (directionFilter !== 'all') params.direction = directionFilter;
      if (folderId) params.folder_id = folderId;
      
      const [debtsResult, contactsResult] = await Promise.all([
        GetDebts(params).catch(() => []),
        GetContacts().catch(() => [])
      ]);
      
      let filtered = debtsResult || [];
      if (folderId && contactsResult) {
        const validContactIds = contactsResult.filter((c: any) => c.folder_id === folderId).map((c: any) => c.id);
        // If backend already filtered it, this won't hurt. If not, this fixes it.
        filtered = filtered.filter((d: Debt) => validContactIds.includes(d.contact_id));
      }
      setDebts(filtered);
    } catch {
      setError(t('debts.failedToLoad'));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, directionFilter, folderId, t]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const handleDelete = async () => {
    if (!debtToDelete) return;
    setIsDeleting(true);
    try {
      await DeleteDebt(debtToDelete.id);
      toast.success(t('debts.debtDeleted'));
      setDeleteDialogOpen(false);
      setDebtToDelete(null);
      fetchDebts();
    } catch {
      toast.error(t('debts.debtDeleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDebts = debts.filter((debt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      debt.description?.toLowerCase().includes(term) ||
      debt.contact_id?.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('debts.title')} description={t('debts.manageDebts')} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('debts.title')} />
        <ErrorAlert message={error} onRetry={fetchDebts} />
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
        title={t('debts.title')}
        description={t('debts.totalDebts', { count: debts.length })}
        action={
          <Button asChild>
            <Link to={`/debts/new${folderId ? `?folderId=${folderId}&folderName=${encodeURIComponent(folderName || '')}` : ''}`}>
              <Plus className="w-4 h-4 mr-2" />
              {t('debts.addDebt')}
            </Link>
          </Button>
        }
      />

      {folderName && (
        <div className="flex items-center justify-between bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 px-4 py-3 rounded-lg mb-6 border border-teal-200 dark:border-teal-800">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            <span className="font-medium">{t('folders.title', 'Folder')}: {folderName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            searchParams.delete('folderId');
            searchParams.delete('folderName');
            setSearchParams(searchParams);
          }}>
            <X className="w-4 h-4 mr-2" />
            {t('common.viewAll')}
          </Button>
        </div>
      )}

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('debts.searchDebts')}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t('common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('debts.allStatus')}</SelectItem>
                  <SelectItem value="pending">{t('common.pending')}</SelectItem>
                  <SelectItem value="partial">{t('common.partial')}</SelectItem>
                  <SelectItem value="paid">{t('common.paid')}</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={directionFilter}
                onValueChange={(value) => setDirectionFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('debts.direction')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('debts.allDirections')}</SelectItem>
                  <SelectItem value="they_owe_me">{t('debts.theyOweMe')}</SelectItem>
                  <SelectItem value="i_owe_them">{t('debts.iOweThem')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
      </Card>

      <div className="pt-2">
        {filteredDebts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={CreditCard}
                title={t('debts.noDebtsFound')}
                description={t('debts.startTracking')}
                action={{
                  label: t('debts.addDebt'),
                  onClick: () => navigate('/debts/new'),
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDebts.map((debt, index) => (
              <motion.div
                key={debt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                  <Card className="group hover:bg-slate-900/50 dark:hover:bg-slate-900/50 transition-all duration-300 border-b-2 border-b-transparent hover:border-b-teal-500 hover:shadow-[0_4px_15px_-3px_rgba(20,184,166,0.3)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:ring-2 group-hover:ring-teal-500 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]">
                            <CreditCard className="w-6 h-6 text-primary group-hover:text-teal-400 transition-colors" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-lg">
                                {formatCurrency(debt.amount)}
                              </span>
                              <Badge className={DEBT_DIRECTION_COLORS[debt.direction]}>
                                {t(`debts.${debt.direction === 'they_owe_me' ? 'theyOweMe' : 'iOweThem'}`)}
                              </Badge>
                              <Badge className={DEBT_STATUS_COLORS[debt.status]}>
                                {t(`common.${debt.status}`)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {debt.description || t('common.noDescription')}
                              {debt.due_date && ` • ${t('debts.due', { date: formatDate(debt.due_date) })}`}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/debts/${debt.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t('debts.viewDetails')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/debts/${debt.id}/edit`)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setDebtToDelete(debt);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('debts.deleteDebt')}
        description={t('debts.deleteDebtConfirm')}
        confirmLabel={t('common.delete')}
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
