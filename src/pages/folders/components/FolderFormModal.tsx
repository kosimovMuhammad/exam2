import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FolderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder | null;
  onSubmit: (data: { name: string; color?: string }) => void;
  isLoading: boolean;
}

export function FolderFormModal({
  open,
  onOpenChange,
  folder,
  onSubmit,
  isLoading,
}: FolderFormModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (open) {
      if (folder) {
        setName(folder.name);
        setColor(folder.color || '');
      } else {
        setName('');
        setColor('');
      }
    }
  }, [open, folder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, color: color || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {folder ? t('folders.editFolder') : t('folders.addFolder')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('folders.folderName')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('folders.folderName')}
              required
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">{t('common.color', 'Color')} ({t('common.optional', 'Optional')})</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color || '#3b82f6'}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 p-1 h-10"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading 
                ? (folder ? t('folders.updating') : t('folders.creating'))
                : (folder ? t('folders.updateFolder') : t('folders.createFolder'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
