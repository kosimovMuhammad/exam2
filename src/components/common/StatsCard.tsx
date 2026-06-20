import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  const trendDirection = trend?.value
    ? trend.value > 0
      ? 'up'
      : trend.value < 0
        ? 'down'
        : 'neutral'
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold">{value}</h3>
                {trend && (
                  <span
                    className={cn(
                      'flex items-center text-xs font-medium',
                      trendDirection === 'up' && 'text-green-600 dark:text-green-400',
                      trendDirection === 'down' && 'text-red-600 dark:text-red-400',
                      trendDirection === 'neutral' && 'text-muted-foreground'
                    )}
                  >
                    {trendDirection === 'up' && <ArrowUp className="w-3 h-3 mr-0.5" />}
                    {trendDirection === 'down' && <ArrowDown className="w-3 h-3 mr-0.5" />}
                    {trendDirection === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
                    {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
              {(description || trend?.label) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {trend?.label || description}
                </p>
              )}
            </div>
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
