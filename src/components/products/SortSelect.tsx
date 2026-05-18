import { useTranslation } from 'react-i18next';

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const { t } = useTranslation();

  const options = [
    { value: 'newest', label: t('filter.sortNew') },
    { value: 'price_asc', label: t('filter.sortPriceAsc') },
    { value: 'price_desc', label: t('filter.sortPriceDesc') },
    { value: 'popular', label: t('filter.sortPopular') },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 text-sm outline-none focus:border-rose-400 cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
