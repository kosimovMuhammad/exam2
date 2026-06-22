import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Users,
  Folder,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth, useIsMobile } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleSidebar, setMobileMenuOpen } from '@/store';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NAVIGATION_ITEMS } from '@/constants';
import { getInitials } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  CreditCard,
  Receipt,
  BarChart3,
  Bell,
  Settings,
  Users,
  Folder,
};

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const mobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  const closeMobileMenu = () => {
    dispatch(setMobileMenuOpen(false));
  };

  const navItems = NAVIGATION_ITEMS.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
    title: t(item.titleKey),
    active: location.pathname === item.href || location.pathname.startsWith(item.href + '/'),
  }));

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeMobileMenu}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <Logo />
                <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      item.active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-2 pb-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/profile" onClick={closeMobileMenu}>
                      <User className="w-4 h-4 mr-2" />
                      {t('common.profile')}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 bottom-0 bg-card border-r border-border z-30 flex flex-col"
    >
      <div className="p-4 flex items-center justify-center border-b border-border overflow-hidden h-[73px]">
        <Logo collapsed={sidebarCollapsed} className="mx-auto" />
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative',
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="truncate"
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.title}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <Separator />

      <div className="p-3">
        <Link
          to="/profile"
          className={cn(
            'flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors',
            sidebarCollapsed && 'justify-center'
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(toggleSidebar())}
          className="w-full justify-center"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('common.collapse')}
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
