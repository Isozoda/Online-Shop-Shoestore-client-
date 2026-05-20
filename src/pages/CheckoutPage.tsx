import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Send, MessageCircle, CheckCircle, ExternalLink, Edit3, AlertTriangle } from 'lucide-react';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '../lib/utils';
import { ordersApi } from '../api/orders.api';
import { settingsApi } from '../api/settings.api';
import { useCartStore } from '../store/cart.store';
import { useAuth } from '../hooks/useAuth';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import type { OrderPayload } from '../types';

const schema = z.object({
  name: z.string().min(2, 'Ном ҳадди ақал 2 ҳарф'),
  phone: z.string().min(9, 'Рақами нодуруст'),
  address: z.string().min(5, 'Манзил ҳадди ақал 5 ҳарф'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const [contactMethod, setContactMethod] = useState<'telegram' | 'whatsapp'>('telegram');

  const items = useCartStore((s) => s.items);
  const finalTotal = useCartStore((s) => s.getFinalTotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Intermediate order success tracking state
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [messageTextCache, setMessageTextCache] = useState<string>('');

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
  });

  const isNativeApp = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.();

  const openExternalUrl = async (appUrl: string, fallbackUrl: string) => {
    if (!isNativeApp) {
      window.open(fallbackUrl, '_blank');
      return;
    }

    const appPlugin = App as any;
    try {
      if (appPlugin.canOpenUrl) {
        const result = await appPlugin.canOpenUrl({ url: appUrl });
        if (result?.value) {
          await appPlugin.openUrl({ url: appUrl });
          return;
        }
      } else {
        await appPlugin.openUrl({ url: appUrl });
        return;
      }
    } catch {
      // continue to fallback if the app URL cannot be opened
    }

    try {
      await Browser.open({ url: fallbackUrl });
    } catch {
      window.open(fallbackUrl, '_blank');
    }
  };

  const openChatLink = async (method: 'telegram' | 'whatsapp', msgText: string, currentSettings: any) => {
    // Copy order text to clipboard so the user can just paste it once the chat opens
    navigator.clipboard.writeText(msgText).catch(() => {});

    if (method === 'telegram') {
      let tgDomain = 'iso_dev_09';
      if (currentSettings?.telegram) {
        const rawTg = currentSettings.telegram;
        const match = rawTg.match(/(?:t\.me\/|@)([a-zA-Z0-9_]+)/);
        if (match && match[1]) {
          tgDomain = match[1];
        } else if (!rawTg.includes('/') && rawTg.trim()) {
          tgDomain = rawTg.trim();
        }
      }
      const appUrl = `tg://resolve?domain=${tgDomain}&text=${encodeURIComponent(msgText)}`;
      const browserUrl = `https://t.me/${tgDomain}?text=${encodeURIComponent(msgText)}`;
      await openExternalUrl(appUrl, browserUrl);
    } else {
      const waNumber = currentSettings?.whatsappNumber ? currentSettings.whatsappNumber.replace(/[^0-9]/g, '') : '';
      const appUrl = waNumber
        ? `whatsapp://send?phone=${waNumber}&text=${encodeURIComponent(msgText)}`
        : `whatsapp://send?text=${encodeURIComponent(msgText)}`;
      const browserUrl = waNumber
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(msgText)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(msgText)}`;
      await openExternalUrl(appUrl, browserUrl);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload: OrderPayload = {
        clientName: data.name,
        clientPhone: data.phone,
        clientAddress: data.address,
        note: data.note,
        contactMethod: contactMethod === 'telegram' ? 'TELEGRAM' : 'WHATSAPP',
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.variant.size || 'Standard',
          colorName: item.variant.color || 'Standard',
        })),
        userId: user?.id || undefined,
      };
      return ordersApi.create(payload);
    },
    onSuccess: (order, variables) => {
      const orderDetails = items
        .map((item, idx) => {
          const name = ((item.product as any)[`name_${lang}`] || item.product.name_tj || item.product.name_ru || item.product.name_en || item.product.name || '') as string;
          const p = item.product.finalPrice ?? item.product.discountPrice ?? item.product.price;
          const colorName = item.variant.color || 
            item.product.colors?.find(c => c.hexCode === item.variant.colorHex)?.name_en || 
            item.product.colors?.find(c => c.hexCode === item.variant.colorHex)?.name_tj ||
            'Standard';
          return `${idx + 1}. ${name}\n📦 Андоза: ${item.variant.size || 'Standard'} | 🎨 Ранг: ${colorName}\n🔢 Миқдор: ${item.quantity} × ${formatPrice(p)} = ${formatPrice(p * item.quantity)}`;
        })
        .join('\n\n');

      const messageText = `🛍 ФАРМОИШИ НАВ (${order.orderNumber || 'ORD'})\n\n👤 Харидор: ${variables.name}\n📞 Телефон: ${variables.phone}\n📍 Манзил: ${variables.address}\n${variables.note ? `📝 Эзоҳ: ${variables.note}\n` : ''}\n🛒 Маҳсулотҳо:\n${orderDetails}\n\n💰 МАБЛАҒИ УМУМӢ: ${formatPrice(finalTotal)}`;

      setMessageTextCache(messageText);
      setCreatedOrder(order);

      // Open external app chat link automatically
      openChatLink(contactMethod, messageText, settings);
    },
    onError: (err: any) => {
      toast.dismiss();
      const msg = err?.response?.data?.message || 'Хатогӣ ҳангоми сабти фармоиш. Лутфан сабадро навсозӣ кунед.';
      toast.error(typeof msg === 'string' ? msg : 'Хатогӣ ҳангоми сабт');
    },
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>ShoeStore — {t('cart.checkout')}</title>
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {t('cart.checkout')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {createdOrder ? (
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-4 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 mb-2">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('order.confirmSendTitle', 'Тасдиқи ирсоли фармоиш')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('order.savedPending', 'Мо фармоиши шуморо бо рақами')} <strong className="text-gray-900 dark:text-white">#{createdOrder.orderNumber}</strong> {t('order.savedPendingSuffix', 'дар система сабт кардем.')}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 text-sm text-gray-600 dark:text-gray-300">
                  <p className="mb-2 font-medium text-gray-900 dark:text-white">
                    {t('order.importantStep', 'Қадами муҳим:')}
                  </p>
                  {t('order.pleaseSendMessage', 'Лутфан хабарро дар барномаи')} <strong className="text-rose-500">{contactMethod === 'telegram' ? 'Telegram' : 'WhatsApp'}</strong> {t('order.pleaseSendMessageSuffix', 'ирсол кунед, то менеҷер фармоишро фавран қабул намояд.')}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      clearCart();
                      navigate(`/order-success/${createdOrder.id}`);
                    }}
                    className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t('order.iSentMessage', 'Ман хабарро ирсол кардам')}
                  </button>

                  <button
                    onClick={() => openChatLink(contactMethod, messageTextCache, settings)}
                    className="w-full py-3 px-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    {t('order.reopenLink', 'Дубора кушодани чат')}
                  </button>

                  <button
                    onClick={() => setCreatedOrder(null)}
                    className="w-full py-2.5 text-gray-400 hover:text-rose-500 font-medium transition-colors text-xs flex items-center justify-center gap-1 mt-2"
                  >
                    <Edit3 className="w-3 h-3" />
                    {t('order.notSentEdit', 'Хабар ирсол нашуд / Тағйири сабад ё маълумот')}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit((data) => mutation.mutate(data))}
                className="lg:col-span-3 space-y-5"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-5">
                    {t('order.contactMethod')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setContactMethod('telegram')}
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-semibold text-sm transition-all ${
                        contactMethod === 'telegram'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                      {t('order.telegram')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod('whatsapp')}
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-semibold text-sm transition-all ${
                        contactMethod === 'whatsapp'
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-600'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t('order.whatsapp')}
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t('order.name')}
                  </h3>
                  {[
                    { name: 'name', label: t('order.name'), type: 'text', placeholder: 'Ном ва насаб' },
                    { name: 'phone', label: t('order.phone'), type: 'tel', placeholder: '+992 XX XXX XXXX' },
                    { name: 'address', label: t('order.address'), type: 'text', placeholder: 'Кӯча, манзил' },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        {...register(name as keyof FormData)}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-rose-400"
                      />
                      {errors[name as keyof FormData] && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors[name as keyof FormData]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      {t('order.note')}
                    </label>
                    <textarea
                      {...register('note')}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white outline-none focus:border-rose-400 resize-none"
                      placeholder="Эзоҳ..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-rose-500/30"
                >
                  {mutation.isPending ? t('common.loading') : t('order.submit')}
                </button>
              </form>
            )}

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('order.summary')}</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => {
                    const displayName = (((item.product as any)[`name_${lang}`] || item.product.name_tj || item.product.name_ru || item.product.name_en || item.product.name || '') as string);
                    const itemPrice = item.product.finalPrice ?? item.product.discountPrice ?? item.product.price;
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
                          <img
                            src={getImageUrl(item.product.images?.[0]?.url || PLACEHOLDER_IMAGE)}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={displayName}>
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500">×{item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-rose-500">
                          {formatPrice(itemPrice * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100 dark:border-slate-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>{t('cart.total')}</span>
                  <span className="text-rose-500">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
