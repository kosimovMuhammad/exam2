import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Languages,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth, useTheme, useIsMobile } from '@/hooks';
import { useAppDispatch } from '@/store';
import { setMobileMenuOpen } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { LogOut, Edit2, User, Users, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const LANGUAGES = [
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'tg', label: '🇹🇯 Тоҷикӣ' },
];

export default function TopBar() {
  const { user, logout } = useAuth();
  const { setTheme, isDark } = useTheme();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(setMobileMenuOpen(true))}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              className="pl-9 w-64 lg:w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="font-semibold text-sm">{t('notifications.title')}</p>
                <Link to="/notifications" className="text-xs text-primary hover:underline font-medium">
                  {t('common.viewAll')}
                </Link>
              </div>
              <div className="p-8 text-center text-sm text-muted-foreground">
                {t('notifications.noNotifications')}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={i18n.language === lang.code ? 'bg-accent' : ''}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="w-4 h-4 mr-2" />
                {t('settings.light')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="w-4 h-4 mr-2" />
                {t('settings.dark')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="w-4 h-4 mr-2" />
                {t('settings.system')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.name?.split(' ')[0]}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 border-border bg-card shadow-xl overflow-hidden rounded-xl">
              <div className="bg-slate-800 dark:bg-slate-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-slate-700">
                    <AvatarFallback className="bg-slate-700 text-white">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-white">{user?.name || 'Muhammad'}</span>
                    <span className="text-sm text-slate-400">Owner</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-full" onClick={logout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
              
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border bg-transparent h-12 p-0">
                  <TabsTrigger 
                    value="profile" 
                    className="rounded-none h-full data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="setting" 
                    className="rounded-none h-full data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Setting
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-2 m-0 outline-none">
                  <div className="flex flex-col gap-1">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm transition-colors">
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                      Edit Profile
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm transition-colors">
                      <User className="w-4 h-4 text-muted-foreground" />
                      View Profile
                    </Link>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm transition-colors cursor-pointer text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Social Profile
                    </div>
                    <div onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm transition-colors cursor-pointer text-muted-foreground">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="setting" className="p-4 m-0 outline-none space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      {isDark ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                      Dark Mode
                    </div>
                    <Switch 
                      checked={isDark} 
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Languages className="w-4 h-4 text-muted-foreground" />
                      Language
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`text-xs py-2 px-3 rounded-lg border transition-colors text-center ${
                            i18n.language === lang.code 
                              ? 'bg-primary/10 border-primary text-primary' 
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
