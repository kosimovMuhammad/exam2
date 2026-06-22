import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Server, RefreshCw, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks';
import { PageHeader } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector, fetchSystemHealth } from '@/store';
import { formatDate } from '@/lib/utils';

const LANGUAGES = [
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'tg', label: '🇹🇯 Тоҷикӣ' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  
  const dispatch = useAppDispatch();
  const { health, status: systemStatus } = useAppSelector((state) => state.system);
  const isChecking = systemStatus === 'loading';

  const checkHealth = () => {
    dispatch(fetchSystemHealth());
  };

  useEffect(() => {
    if (systemStatus === 'idle') {
      checkHealth();
    }
  }, [dispatch, systemStatus]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader title={t('settings.title')} description={t('settings.managePrefs')} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            {t('settings.appearance')}
          </CardTitle>
          <CardDescription>{t('settings.customizeLook')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t('settings.theme')}</Label>
            <RadioGroup
              value={theme}
              onValueChange={(value) => {
                setTheme(value as 'light' | 'dark' | 'system');
              }}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="sr-only peer" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <Sun className="mb-2 h-6 w-6" />
                  {t('settings.light')}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="sr-only peer" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <Moon className="mb-2 h-6 w-6" />
                  {t('settings.dark')}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="sr-only peer" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer"
                >
                  <Monitor className="mb-2 h-6 w-6" />
                  {t('settings.system')}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {t('settings.language')}
          </CardTitle>
          <CardDescription>{t('settings.languageDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Select value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t('settings.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              {t('settings.systemStatus')}
            </div>
            <Button variant="outline" size="sm" onClick={checkHealth} disabled={isChecking}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {t('settings.checkStatus')}
            </Button>
          </CardTitle>
          <CardDescription>{t('settings.viewApiStatus')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">{t('settings.apiHealth')}</p>
              <p className="text-sm text-muted-foreground">
                {health?.time ? t('settings.lastChecked', { time: formatDate(health.time) }) : t('settings.checking')}
              </p>
            </div>
            {health?.status === 'online' ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {t('settings.online')}
              </Badge>
            ) : health?.status === 'offline' ? (
              <Badge variant="destructive">
                {t('settings.offline')}
              </Badge>
            ) : (
              <Badge variant="secondary">{t('settings.checking')}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
