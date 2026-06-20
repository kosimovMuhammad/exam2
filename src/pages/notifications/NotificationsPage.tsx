import { useState } from 'react';
import { motion } from 'framer-motion';
import { BellOff } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationsPage() {
  const [tab, setTab] = useState('all');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Notifications"
        description="0 unread notifications"
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="space-y-4 mt-6">
          <EmptyState
            icon={BellOff}
            title="No notifications"
            description="You're all caught up! Check back later for new updates."
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
