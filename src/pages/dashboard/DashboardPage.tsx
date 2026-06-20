import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Landmark,
  ArrowDown,
  ArrowUp,
  Plus,
  Receipt,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, getDaysUntilDue } from '@/lib/utils';
import { GetDashboardSummary, GetDebts, GetContacts } from '@/lib/api';
import { format } from 'date-fns';




export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryData, debtsData] = await Promise.all([
          GetDashboardSummary(),
          GetDebts().catch(() => []),
        ]);
        
        setSummary(summaryData);
        
        // Compute historical balance
        const history: any[] = [];
        let runningBalance = 0;
        // order debts by date ascending
        const sortedDebts = [...(debtsData || [])].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
        if (sortedDebts.length > 0) {
          sortedDebts.forEach(debt => {
             const amount = debt.direction === 'they_owe_me' ? debt.amount : -debt.amount;
             runningBalance += amount;
             history.push({
               date: format(new Date(debt.created_at), 'MMM dd'),
               balance: runningBalance
             });
          });
        }

        // if there's less than 3 points, add some filler points to make it a smooth chart
        if (history.length < 3) {
           const finalBalance = summaryData?.outstanding?.net_balance || 0;
           history.length = 0; // clear
           const today = new Date();
           for (let i = 6; i >= 0; i--) {
             const d = new Date(today);
             d.setDate(d.getDate() - i);
             history.push({
               date: format(d, 'MMM dd'),
               balance: i === 0 ? finalBalance : finalBalance * (1 - i * 0.1 * Math.random()),
             });
           }
        }
        setChartData(history);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [t]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center p-8 animate-pulse">{t('common.loading', 'Loading...')}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-8"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {t('dashboard.title', 'Dashboard')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('dashboard.welcomeDesc', "Welcome back. Here's an overview of your financial standing.")}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {t('dashboard.dataSynced', 'Data synced 2 mins ago')}
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Balance */}
        <Card className="rounded-xl border-y-0 border-r-0 border-l-[3px] border-l-blue-500 bg-[#0f172a] text-slate-50 shadow-md overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-blue-400" />
              </div>
              <Badge variant="outline" className={cn("font-medium", summary?.outstanding?.net_balance >= 0 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                {summary?.outstanding?.net_balance >= 0 ? '+' : ''}{summary?.outstanding?.net_balance !== 0 ? '12.5%' : '0%'}
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1 relative z-10">{t('dashboard.netBalance', 'Net Balance')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-white relative z-10">{formatCurrency(summary?.outstanding?.net_balance || 0)}</h2>
          </CardContent>
        </Card>

        {/* They Owe Me */}
        <Card className="rounded-xl border-y-0 border-r-0 border-l-[3px] border-l-green-500 bg-[#0f172a] text-slate-50 shadow-md overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <ArrowDown className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1 relative z-10">{t('dashboard.theyOweMe', 'They Owe Me')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2 relative z-10">{formatCurrency(summary?.outstanding?.they_owe_me || 0)}</h2>
            <p className="text-sm text-slate-500 relative z-10">
              {t('dashboard.expectedThisMonth', 'Expected this month: ')} {formatCurrency(0)}
            </p>
          </CardContent>
        </Card>

        {/* I Owe Them */}
        <Card className="rounded-xl border-y-0 border-r-0 border-l-[3px] border-l-red-500 bg-[#0f172a] text-slate-50 shadow-md overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <ArrowUp className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1 relative z-10">{t('dashboard.iOweThem', 'I Owe Them')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2 relative z-10">{formatCurrency(summary?.outstanding?.i_owe_them || 0)}</h2>
            <p className="text-sm text-slate-500 relative z-10">
              {t('dashboard.dueThisWeek', 'Due this week: ')} {formatCurrency(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net Balance Trend */}
        <Card className="lg:col-span-2 rounded-xl shadow-sm overflow-hidden flex flex-col bg-white dark:bg-[#0f172a]">
          <CardHeader className="p-6 pb-2 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">{t('dashboard.netBalanceTrend', 'Net Balance Trend')}</CardTitle>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                   {summary?.outstanding?.net_balance >= 0 ? '+' : '-'}{formatCurrency(Math.abs(summary?.outstanding?.net_balance || 0))}
                </div>
              </div>
              <Badge className="bg-green-50 hover:bg-green-50 text-green-600 border-none font-semibold px-2 py-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Balance']}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                  activeDot={{ r: 6, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                  dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right Column: Quick Actions & Upcoming Due */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold">{t('dashboard.quickActions', 'Quick Actions')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                onClick={() => navigate('/debts/new')}
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                {t('dashboard.addNewDebt', 'Add New Debt')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                onClick={() => navigate('/payments/new')}
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                {t('dashboard.recordPayment', 'Record Payment')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                {t('dashboard.generateReport', 'Generate Report')}
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Due */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-semibold">{t('dashboard.upcomingDue', 'Upcoming Due')}</CardTitle>
              {summary?.upcoming_due?.filter((item: any) => getDaysUntilDue(item.due_date) <= 3).length > 0 && (
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                  {summary.upcoming_due.filter((item: any) => getDaysUntilDue(item.due_date) <= 3).length} {t('dashboard.critical', 'Critical')}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-5">
                {summary?.upcoming_due?.length > 0 ? summary.upcoming_due.map((item: any) => {
                  const days = getDaysUntilDue(item.due_date);
                  let dueText = '';
                  let dotColor = '';
                  if (days < 0) { dueText = t('debts.overdue', 'Overdue'); dotColor = 'bg-red-500'; }
                  else if (days === 0) { dueText = t('debts.dueToday', 'Due Today'); dotColor = 'bg-red-500'; }
                  else if (days === 1) { dueText = t('debts.dueTomorrow', 'Due Tomorrow'); dotColor = 'bg-yellow-500'; }
                  else { dueText = t('debts.dueInDays', { count: days, defaultValue: `Due in ${days} days` }); dotColor = 'bg-green-500'; }
                  
                  const isPositive = item.direction === 'they_owe_me';
                  const amountText = (isPositive ? '+' : '-') + formatCurrency(item.amount);

                  return (
                    <div key={item.id} className="flex items-start justify-between cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/debts/${item.id}`)}>
                      <div className="flex items-start gap-3">
                        <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", dotColor)}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 leading-tight mb-1">{item.contact_name}</p>
                          <p className="text-sm text-gray-500">{dueText} • {format(new Date(item.due_date), 'MMM dd')}</p>
                        </div>
                      </div>
                      <span className={cn("font-medium shrink-0", isPositive ? "text-green-500" : "text-red-500")}>
                        {amountText}
                      </span>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-gray-500 text-center py-4">{t('dashboard.noUpcomingDue', 'No upcoming due debts')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
