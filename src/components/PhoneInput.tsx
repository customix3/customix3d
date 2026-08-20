/** WhatsApp / mobile with country code — default India +91 */

export const COUNTRY_CODES = [
  { code: '+91', label: 'India', flag: '🇮🇳' },
  { code: '+1', label: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', label: 'UK', flag: '🇬🇧' },
  { code: '+971', label: 'UAE', flag: '🇦🇪' },
  { code: '+966', label: 'Saudi', flag: '🇸🇦' },
  { code: '+65', label: 'Singapore', flag: '🇸🇬' },
  { code: '+61', label: 'Australia', flag: '🇦🇺' },
  { code: '+49', label: 'Germany', flag: '🇩🇪' },
  { code: '+33', label: 'France', flag: '🇫🇷' },
  { code: '+81', label: 'Japan', flag: '🇯🇵' },
  { code: '+86', label: 'China', flag: '🇨🇳' },
  { code: '+92', label: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', label: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', label: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', label: 'Nepal', flag: '🇳🇵' },
] as const;

export function splitPhone(full: string): { country: string; local: string } {
  const raw = (full || '').trim();
  if (!raw) return { country: '+91', local: '' };
  // Match longest country code first
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (raw.startsWith(c.code)) {
      return { country: c.code, local: raw.slice(c.code.length).replace(/\D/g, '') };
    }
  }
  // 10-digit India without +91
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return { country: '+91', local: digits };
  if (digits.length === 12 && digits.startsWith('91')) {
    return { country: '+91', local: digits.slice(2) };
  }
  return { country: '+91', local: digits };
}

export function joinPhone(country: string, local: string): string {
  const d = (local || '').replace(/\D/g, '');
  return `${country}${d}`;
}

type Props = {
  value: string;
  onChange: (full: string) => void;
  required?: boolean;
  id?: string;
  className?: string;
};

export default function PhoneInput({ value, onChange, required, id, className }: Props) {
  const { country, local } = splitPhone(value);

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      <select
        className="w-[7.5rem] shrink-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-sm"
        value={country}
        onChange={(e) => onChange(joinPhone(e.target.value, local))}
        aria-label="Country code"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        placeholder={country === '+91' ? '10-digit mobile' : 'Mobile number'}
        required={required}
        value={local}
        onChange={(e) => onChange(joinPhone(country, e.target.value.replace(/\D/g, '')))}
      />
    </div>
  );
}
