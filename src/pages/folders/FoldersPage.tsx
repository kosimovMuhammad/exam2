import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Folder as FolderIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GetFolders, CreateFolder, UpdateFolder, DeleteFolder, GetContacts, GetDebts } from '@/lib/api';
import { PageHeader, ErrorAlert, EmptyState, ConfirmDialog } from '@/components/common';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Folder, Contact, Debt } from '@/types';
import { FolderCard } from './components/FolderCard';
import { FolderFormModal } from './components/FolderFormModal';

export default function FoldersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [foldersData, contactsData, debtsData] = await Promise.all([
        GetFolders({ limit: 1000 }).catch(() => []),
        GetContacts({ limit: 1000 }).catch(() => []),
        GetDebts({ limit: 1000 }).catch(() => []),
      ]);
      setFolders(foldersData || []);
      setContacts(contactsData || []);
      setDebts(debtsData || []);
    } catch {
      setError(t('folders.failedToLoad'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const folderStats = useMemo(() => {
    const stats: Record<string, { theyOweMe: number; iOweThem: number; total: number }> = {};
    
    folders.forEach(folder => {
      const folderIdStr = String(folder.id);
      stats[folderIdStr] = { theyOweMe: 0, iOweThem: 0, total: 0 };
      
      const folderContacts = contacts.filter(c => {
        const cFolderId = typeof c.folder_id === 'object' && c.folder_id !== null ? (c.folder_id as any).id : c.folder_id;
        return cFolderId && String(cFolderId) === folderIdStr;
      }).map(c => String(c.id));
      
      const folderDebts = debts.filter(d => {
        const dContactId = typeof d.contact_id === 'object' && d.contact_id !== null ? (d.contact_id as any).id : d.contact_id;
        return dContactId && folderContacts.includes(String(dContactId));
      });
      
      folderDebts.forEach(debt => {
        // Parse amount defensively in case it's a formatted string
        const amtStr = String(debt.amount).replace(/[^0-9.-]+/g, "");
        const amt = parseFloat(amtStr) || 0;
        
        // Only include active debts in outstanding balances
        if (debt.status === 'paid') return;
        
        if (debt.direction === 'they_owe_me') {
          stats[folderIdStr].theyOweMe += amt;
          stats[folderIdStr].total += amt;
        } else {
          stats[folderIdStr].iOweThem += amt;
          stats[folderIdStr].total -= amt;
        }
      });
    });
    
    return stats;
  }, [folders, contacts, debts]);

  const handleCreateOrUpdate = async (data: { name: string; color?: string }) => {
    setIsSubmitting(true);
    try {
      if (editingFolder) {
        await UpdateFolder(editingFolder.id, data);
        toast.success(t('folders.folderUpdated', 'Folder updated successfully'));
      } else {
        await CreateFolder(data);
        toast.success(t('folders.folderCreated', 'Folder created successfully'));
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error(editingFolder ? t('folders.updateFailed', 'Failed to update folder') : t('folders.createFailed', 'Failed to create folder'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!folderToDelete) return;
    setIsDeleting(true);
    try {
      await DeleteFolder(folderToDelete.id);
      toast.success(t('folders.folderDeleted', 'Folder deleted successfully'));
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
      fetchData();
    } catch {
      toast.error(t('folders.deleteFailed', 'Failed to delete folder'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFolderClick = (folder: Folder) => {
    navigate(`/debts?folderId=${folder.id}&folderName=${encodeURIComponent(folder.name)}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('folders.title')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('folders.title')} />
        <ErrorAlert message={error} onRetry={fetchData} />
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
        title={t('folders.title')}
        action={
          <Button onClick={() => {
            setEditingFolder(null);
            setModalOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {t('folders.addFolder')}
          </Button>
        }
      />

      {folders.length === 0 ? (
        <EmptyState
          icon={FolderIcon}
          title={t('folders.noFolders')}
          description={t('folders.noFoldersDesc', 'Create a folder to group your contacts and debts.')}
          action={{
            label: t('folders.addFolder'),
            onClick: () => {
              setEditingFolder(null);
              setModalOpen(true);
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {folders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <FolderCard
                folder={folder}
                theyOweMe={folderStats[String(folder.id)]?.theyOweMe || 0}
                iOweThem={folderStats[String(folder.id)]?.iOweThem || 0}
                totalBalance={folderStats[String(folder.id)]?.total || 0}
                onClick={handleFolderClick}
                onEdit={(f) => {
                  setEditingFolder(f);
                  setModalOpen(true);
                }}
                onDelete={(f) => {
                  setFolderToDelete(f);
                  setDeleteDialogOpen(true);
                }}
              />
            </motion.div>
          ))}
        </div>
      )}

      <FolderFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        folder={editingFolder}
        onSubmit={handleCreateOrUpdate}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('folders.deleteFolder')}
        description={t('folders.deleteConfirm')}
        confirmLabel={t('common.delete')}
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
