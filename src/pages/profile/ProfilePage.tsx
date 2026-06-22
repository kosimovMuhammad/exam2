import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector, updateMe } from '@/store';
import { profileSchema, ProfileFormData } from '@/lib/utils';
import { PageHeader, LoadingSkeleton } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { formatDate, getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({ name: user.name });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      await dispatch(updateMe({ name: data.name })).unwrap();
      toast.success(t('profile.profileUpdated'));
    } catch {
      toast.error(t('profile.profileUpdateFailed'));
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('profile.title')} />
        <LoadingSkeleton variant="details" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader title={t('profile.title')} description={t('profile.manageAccount')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="text-2xl">
                    {user ? getInitials(user.name || '') : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="mt-4 text-xl font-semibold">
                {user?.name}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{t('profile.memberSince', { date: formatDate(user?.created_at || '') })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">{t('profile.profileInfo')}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.personalInfo')}</CardTitle>
                  <CardDescription>{t('profile.updateDetails')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('common.fullName')}</Label>
                      <Input
                        id="name"
                        {...registerProfile('name')}
                        defaultValue={user?.name}
                        className={profileErrors.name ? 'border-destructive' : ''}
                      />
                      {profileErrors.name && (
                        <p className="text-xs text-destructive">{profileErrors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('common.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">{t('profile.emailCannotChange')}</p>
                    </div>

                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('profile.saving')}
                        </>
                      ) : (
                        t('profile.saveChanges')
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
