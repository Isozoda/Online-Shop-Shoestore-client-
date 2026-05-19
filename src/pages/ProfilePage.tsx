import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, ShoppingBag, Heart, Camera, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth.api';
import { ordersApi } from '../api/orders.api';
import { useLikesStore } from '../store/likes.store';
import { ProductCard } from '../components/ui/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { UserAvatar } from '../components/ui/UserAvatar';
import { formatPrice, getImageUrl } from '../lib/utils';

const TABS = ['profile', 'orders', 'wishlist'] as const;
type Tab = (typeof TABS)[number];

export function ProfilePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAuthenticated, user: storeUser } = useAuth();
  const { updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [name, setName] = useState(storeUser?.name || '');
  const likedProducts = useLikesStore((s) => s.likedProducts);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const { data: orders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: ordersApi.getMyOrders,
    enabled: activeTab === 'orders',
  });

  const updateMutation = useMutation({
    mutationFn: () => authApi.updateProfile({ name }),
    onSuccess: (user) => {
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success(t('common.save'));
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { avatar } = await authApi.uploadAvatar(file);
      updateUser({ avatar });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Аватар тағйир ёфт');
    } catch {
      toast.error(t('common.error'));
    }
  };

  const tabIcons = { profile: User, orders: ShoppingBag, wishlist: Heart };
  const tabLabels = {
    profile: t('profile.myProfile'),
    orders: t('profile.myOrders'),
    wishlist: t('profile.myWishlist'),
  };

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('nav.profile')}</title>
      </Helmet>
 
      <div className="pt-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <UserAvatar user={storeUser || { name: 'User' }} className="w-16 h-16 rounded-full" />
              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-600 transition-colors">
                <Camera className="w-3 h-3 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{storeUser?.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{storeUser?.phone}</p>
            </div>
            <button
              onClick={() => logout()}
              className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </button>
          </div>

          <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 mb-8 w-fit">
            {TABS.map((tab) => {
              const Icon = tabIcons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tabLabels[tab]}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t('profile.editProfile')}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    {t('auth.phone')}
                  </label>
                  <input
                    type="tel"
                    value={storeUser?.phone || ''}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-100 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>
                <button
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                  className="px-6 py-2.5 bg-rose-500 text-white text-sm font-medium rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? t('common.loading') : t('common.save')}
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {!orders || orders.length === 0 ? (
                  <EmptyState icon={ShoppingBag} title={t('profile.noOrders')} />
                ) : (
                  <div className="space-y-5">
                    {orders.map((order: any, index: number) => {
                      const rawStatus = (order.status || 'pending').toLowerCase();
                      const statusMap: Record<string, string> = {
                        pending: 'Дар интизор',
                        confirmed: 'Тасдиқ шуд',
                        processing: 'Коркард мешавад',
                        shipped: 'Фиристода шуд',
                        delivered: 'Расонида шуд',
                        cancelled: 'Бекор шуд',
                      };
                      const displayStatus = statusMap[rawStatus] || statusMap.pending;

                      const orderDateObj = new Date(order.createdAt);
                      const displayDate = orderDateObj.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      });
                      
                      const dbTotal = typeof order.totalAmount === 'number' ? order.totalAmount : parseFloat(String(order.totalAmount).replace(/[^0-9.]/g, '')) || 0;
                      const itemsTotal = order.items?.reduce((sum: number, item: any) => {
                        const p = item.product || {};
                        const itemPrice = (typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, ''))) || 
                                         (typeof p.finalPrice === 'number' ? p.finalPrice : parseFloat(String(p.finalPrice).replace(/[^0-9.]/g, ''))) || 
                                         (typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, ''))) || 0;
                        return sum + (itemPrice * (item.quantity || 1));
                      }, 0) || 0;
                      
                      const finalTotal = dbTotal > 0 ? dbTotal : itemsTotal;

                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="bg-white dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-slate-800">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                                Фармоиш №{orders.length - index}
                              </h3>
                              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5 block">
                                #{order.orderNumber || order.id.slice(0, 8)}
                              </span>
                            </div>
                            
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                              rawStatus === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400' :
                              rawStatus === 'cancelled' ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-500 dark:text-rose-400' :
                              'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400'
                            }`}>
                              {displayStatus}
                            </span>
                          </div>

                          <div className="py-4 space-y-3">
                            {order.items?.map((item: any) => {
                              const p = item.product || {};
                              const name = p.name_tj || p.name_ru || p.name_en || 'Маҳсулот';
                              const imgUrl = p.images?.[0]?.url || '';

                              return (
                                <div key={item.id} className="flex items-center gap-3.5">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 flex-shrink-0">
                                    <img
                                      src={getImageUrl(imgUrl)}
                                      alt={name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter mb-0.5">
                                      {p.category?.name_ru || p.category?.name_tj || 'Бе категория'}
                                    </p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate leading-tight">
                                      {name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                      <span className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">📏 {item.size}</span>
                                      <span className="text-rose-500 font-bold">× {item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-gray-400">{displayDate}</span>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatPrice(finalTotal)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                {likedProducts.length === 0 ? (
                  <EmptyState icon={Heart} title={t('wishlist.empty')} description={t('wishlist.emptyDesc')} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {likedProducts.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
