import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { GetDebtById, CreateDebt, UpdateDebt } from '@/lib/api';
import { GetContacts } from '@/lib/api';
import { debtSchema, DebtFormData } from '@/lib/utils';
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
import { toast } from 'sonner';
import type { Contact, DebtDirection, DebtStatus } from '@/types';

export default function DebtFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const folderName = searchParams.get('folderName');
  const isEditing = Boolean(id);
  const { t } = useTranslation();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingDebt, setIsLoadingDebt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedContact, setSelectedContact] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<DebtDirection>('i_owe_them');
  const [selectedStatus, setSelectedStatus] = useState<DebtStatus>('pending');
  const [selectedDate, setSelectedDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      contact_id: '',
      direction: 'i_owe_them',
      amount: 0,
      currency: 'USD',
      description: '',
      due_date: '',
    },
  });

  useEffect(() => {
    const fetchContactsData = async () => {
      const data = await GetContacts();
      if (folderId && data) {
        setContacts(data.filter((c: any) => c.folder_id === folderId));
      } else {
        setContacts(data || []);
      }
    };

    fetchContactsData();
  }, []);
  useEffect(() => {
    if (!id) return; 

    const fetchDebtData = async () => {
      setIsLoadingDebt(true);
      
      try {
        const data = await GetDebtById(id); 
        
        reset({
          contact_id: data.contact_id,
          direction: data.direction,
          amount: data.amount,
          currency: data.currency || 'USD',
          description: data.description || '',
          due_date: data.due_date || '',
        });
        
        setSelectedContact(data.contact_id);
        setSelectedDirection(data.direction);
        setSelectedStatus(data.status);
        
        if (data.due_date) {
          setSelectedDate(new Date(data.due_date));
        }
        
      } catch (error) {
        // Ба ҷои .catch
        toast.error(t('debts.failedToLoadDebt'));
      } finally {
        // Ба ҷои .finally
        setIsLoadingDebt(false);
      }
    };

    // Функсияро ба кор медарорем
    fetchDebtData(); 
    
  }, [id, reset, t]);

  useEffect(() => {
    setValue('contact_id', selectedContact);
    setValue('direction', selectedDirection);
    if (selectedDate) {
      setValue('due_date', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedContact, selectedDirection, selectedDate, setValue]);

  const onSubmit = async (data: DebtFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        due_date: data.due_date || undefined,
        description: data.description || undefined,
      };
      
      if (isEditing && id) {
        await UpdateDebt(id, {
          ...payload,
          status: selectedStatus,
        });
        toast.success(t('debts.debtUpdated'));
      } else {
        await CreateDebt(payload);
        toast.success(t('debts.debtCreated'));
      }
      if (folderId) {
        navigate(`/debts?folderId=${folderId}&folderName=${encodeURIComponent(folderName || '')}`);
      } else {
        navigate('/debts');
      }
    } catch {
      toast.error(isEditing ? t('debts.debtUpdateFailed') : t('debts.debtCreateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDebt) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('debts.editDebt')} />
        <div className="animate-pulse">{t('common.loading')}</div>
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
        title={isEditing ? t('debts.editDebt') : t('debts.addNewDebt')}
        description={isEditing ? t('debts.updateDetails') : t('debts.trackNewDebt')}
        breadcrumbs={[
          { label: t('debts.title'), href: '/debts' },
          { label: isEditing ? t('common.edit') : t('common.add') },
        ]}
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t('debts.debtDetails')}</CardTitle>
          <CardDescription>
            {t('debts.debtDetailsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_id">{t('debts.contact')} *</Label>
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger className={errors.contact_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t('debts.selectContact')} />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.contact_id && (
                  <p className="text-xs text-destructive">{errors.contact_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">{t('debts.direction')} *</Label>
                <Select value={selectedDirection} onValueChange={(v) => setSelectedDirection(v as DebtDirection)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('debts.selectDirection')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="they_owe_me">{t('debts.theyOweMe')}</SelectItem>
                    <SelectItem value="i_owe_them">{t('debts.iOweThem')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('debts.amountLabel')} *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className={errors.amount ? 'border-destructive' : ''}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t('debts.currencyLabel')}</Label>
                <Select
                  defaultValue="USD"
                  onValueChange={(v) => setValue('currency', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('debts.selectCurrency')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">{t('debts.currencyUSD')}</SelectItem>
                    <SelectItem value="EUR">{t('debts.currencyEUR')}</SelectItem>
                    <SelectItem value="GBP">{t('debts.currencyGBP')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('common.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('debts.descriptionPlaceholder')}
                {...register('description')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('common.dueDate')}</Label>
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
                      {selectedDate ? format(selectedDate, 'PPP') : t('common.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="status">{t('common.status')}</Label>
                  <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as DebtStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('debts.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('common.pending')}</SelectItem>
                      <SelectItem value="partial">{t('common.partial')}</SelectItem>
                      <SelectItem value="paid">{t('common.paid')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                if (folderId) {
                  navigate(`/debts?folderId=${folderId}&folderName=${encodeURIComponent(folderName || '')}`);
                } else {
                  navigate('/debts');
                }
              }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? t('debts.updating') : t('debts.creating')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? t('debts.updateDebt') : t('debts.createDebt')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
