import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Search,
  Users,
  Trash2,
  Pencil,
  MoreVertical,
  Loader2,
  Phone,
  Mail,
  DollarSign,
  Folder,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GetContacts, CreateContact, UpdateContact, DeleteContact, GetFolders } from '@/lib/api';
import { PageHeader, LoadingSkeleton, ErrorAlert, EmptyState, ConfirmDialog } from '@/components/common';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { contactSchema, ContactFormData, getInitials } from '@/lib/utils';
import type { Contact, Folder as FolderType } from '@/types';

export default function ContactsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const folderName = searchParams.get('folderName');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      note: '',
      folder_id: '',
    },
  });

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [result, foldersResult] = await Promise.all([
        GetContacts(),
        GetFolders().catch(() => [])
      ]);
      setContacts(result || []);
      setFolders(foldersResult || []);
    } catch {
      setError(t('contacts.failedToLoad'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const openAddModal = () => {
    setContactToEdit(null);
    reset({ name: '', phone: '', email: '', note: '', folder_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setContactToEdit(contact);
    reset({
      name: contact.name,
      phone: contact.phone || '',
      email: contact.email || '',
      note: contact.note || '',
      folder_id: contact.folder_id || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        email: data.email === '' ? undefined : data.email,
        phone: data.phone === '' ? undefined : data.phone,
        note: data.note === '' ? undefined : data.note,
        folder_id: data.folder_id === '' ? undefined : data.folder_id,
      };

      if (contactToEdit) {
        await UpdateContact(contactToEdit.id, payload);
        toast.success(t('contacts.contactUpdated'));
      } else {
        await CreateContact(payload);
        toast.success(t('contacts.contactCreated'));
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch {
      toast.error(contactToEdit ? t('contacts.contactUpdateFailed') : t('contacts.contactCreateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      await DeleteContact(contactToDelete.id);
      toast.success(t('contacts.contactDeleted'));
      setDeleteDialogOpen(false);
      setContactToDelete(null);
      fetchContacts();
    } catch {
      toast.error(t('contacts.contactDeleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (folderId && contact.folder_id !== folderId) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(term) ||
      contact.phone?.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('contacts.title')} description={t('contacts.manageContacts')} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('contacts.title')} />
        <ErrorAlert message={error} onRetry={fetchContacts} />
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
        title={t('contacts.title')}
        description={t('contacts.manageContacts')}
        action={
          <Button onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            {t('contacts.addContact')}
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

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('contacts.searchContacts')}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {filteredContacts.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t('contacts.noContactsFound')}
              description={t('contacts.startAdding')}
              action={{
                label: t('contacts.addContact'),
                onClick: openAddModal,
              }}
            />
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">{t('common.fullName')}</th>
                      <th className="px-4 py-3 font-medium">{t('contacts.phone')}</th>
                      <th className="px-4 py-3 font-medium">{t('contacts.comments')}</th>
                      <th className="px-4 py-3 font-medium text-right">{t('contacts.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="group hover:bg-slate-900/50 dark:hover:bg-slate-900/50 transition-all duration-300 border-b border-border hover:border-teal-500 hover:shadow-[0_4px_15px_-3px_rgba(20,184,166,0.3)]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 transition-all duration-300 group-hover:ring-2 group-hover:ring-teal-500 group-hover:shadow-[0_0_10px_rgba(20,184,166,0.5)]">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(contact.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              {contact.email && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3" />
                                  {contact.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {contact.phone ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-[200px] truncate">
                          {contact.note ? (
                            <span className="text-muted-foreground" title={contact.note}>{contact.note}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/debts/new`)}>
                                <DollarSign className="w-4 h-4 mr-2" />
                                {t('contacts.addDebt')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditModal(contact)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                {t('contacts.editContact')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setContactToDelete(contact);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('contacts.deleteContact')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{contactToEdit ? t('contacts.editContact') : t('contacts.addContact')}</DialogTitle>
            <DialogDescription>
              {t('contacts.enterContactInfo')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('common.fullName')} *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">{t('contacts.phone')}</Label>
              <Input
                id="phone"
                placeholder={t('contacts.phonePlaceholder')}
                {...register('phone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">{t('contacts.comments')}</Label>
              <Textarea
                id="note"
                placeholder="..."
                {...register('note')}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="folder_id">{t('folders.title', 'Folder')}</Label>
              <Select
                value={watch('folder_id') || ''}
                onValueChange={(val) => setValue('folder_id', val === 'none' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('common.select', 'Select...')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('common.none', 'None')}</SelectItem>
                  {folders.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {contactToEdit ? (isSubmitting ? t('contacts.updating') : t('common.save')) : (isSubmitting ? t('contacts.creating') : t('common.add'))}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('contacts.deleteContact')}
        description={t('contacts.deleteConfirmDesc')}
        confirmLabel={t('common.delete')}
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
