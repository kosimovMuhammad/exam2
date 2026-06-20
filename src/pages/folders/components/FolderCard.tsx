import { Folder } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder as FolderIcon, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FolderCardProps {
  folder: Folder;
  theyOweMe: number;
  iOweThem: number;
  totalBalance: number;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  onClick: (folder: Folder) => void;
}

export function FolderCard({ folder, theyOweMe, iOweThem, totalBalance, onEdit, onDelete, onClick }: FolderCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="group cursor-pointer hover:bg-slate-900/50 dark:hover:bg-slate-900/50 transition-all duration-300 border-b-2 border-b-transparent hover:border-b-blue-500 hover:shadow-[0_4px_15px_-3px_rgba(59,130,246,0.3)] h-full"
        onClick={() => onClick(folder)}
      >
        <CardContent className="p-5 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  style={{ backgroundColor: folder.color || 'rgba(59, 130, 246, 0.1)' }}
                >
                  <FolderIcon 
                    className="w-5 h-5 transition-colors" 
                    style={{ color: folder.color ? '#fff' : '#3b82f6' }} 
                  />
                </div>
                <h3 className="font-semibold text-lg line-clamp-1">{folder.name}</h3>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => onEdit(folder)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    {t('common.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(folder)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t('folders.totalBalance')}</span>
                <span className="font-medium text-blue-500 dark:text-blue-400">
                  {formatCurrency(totalBalance)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t('folders.theyOweMe')}</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(theyOweMe)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t('folders.iOweThem')}</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(iOweThem)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
