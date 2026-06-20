import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useIsMobile } from '@/hooks';
import { useAppSelector } from '@/store';
import { cn } from '@/lib/utils';

export default function DashboardLayout() {
  const isMobile = useIsMobile();
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div
          className={cn(
            'flex-1 flex flex-col min-h-screen transition-all duration-300',
            !isMobile && (sidebarCollapsed ? 'ml-16' : 'ml-64')
          )}
        >
          <TopBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
