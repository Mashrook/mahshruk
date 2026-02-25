import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

const saudiCities = [
  { name: "الرياض", code: "RUH", country: "المملكة العربية السعودية" },
  { name: "جدة", code: "JED", country: "المملكة العربية السعودية" },
  { name: "الدمام", code: "DMM", country: "المملكة العربية السعودية" },
  { name: "المدينة المنورة", code: "MED", country: "المملكة العربية السعودية" },
  { name: "مكة المكرمة", code: "MKX", country: "المملكة العربية السعودية" },
  { name: "أبها", code: "AHB", country: "المملكة العربية السعودية" },
  { name: "تبوك", code: "TUU", country: "المملكة العربية السعودية" },
  { name: "الطائف", code: "TIF", country: "المملكة العربية السعودية" },
  { name: "القصيم", code: "ELQ", country: "المملكة العربية السعودية" },
  { name: "حائل", code: "HAS", country: "المملكة العربية السعودية" },
  { name: "نجران", code: "EAM", country: "المملكة العربية السعودية" },
  { name: "جازان", code: "GIZ", country: "المملكة العربية السعودية" },
  { name: "ينبع", code: "YNB", country: "المملكة العربية السعودية" },
  { name: "الباحة", code: "ABT", country: "المملكة العربية السعودية" },
  { name: "دبي", code: "DXB", country: "الإمارات العربية المتحدة" },
  { name: "أبوظبي", code: "AUH", country: "الإمارات العربية المتحدة" },
  { name: "القاهرة", code: "CAI", country: "مصر" },
  { name: "إسطنبول", code: "IST", country: "تركيا" },
  { name: "لندن", code: "LHR", country: "المملكة المتحدة" },
  { name: "باريس", code: "CDG", country: "فرنسا" },
  { name: "كوالالمبور", code: "KUL", country: "ماليزيا" },
  { name: "بانكوك", code: "BKK", country: "تايلاند" },
  { name: "عمّان", code: "AMM", country: "الأردن" },
  { name: "بيروت", code: "BEY", country: "لبنان" },
  { name: "الكويت", code: "KWI", country: "الكويت" },
  { name: "البحرين", code: "BAH", country: "البحرين" },
  { name: "مسقط", code: "MCT", country: "عُمان" },
  { name: "الدوحة", code: "DOH", country: "قطر" },
];

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showCode?: boolean;
}

export default function CityAutocomplete({ value, onChange, placeholder, label, showCode = false }: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(saudiCities);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (val: string) => {
    onChange(val);
    if (val.length > 0) {
      const results = saudiCities.filter(
        (c) => c.name.includes(val) || c.code.toLowerCase().includes(val.toLowerCase()) || c.country.includes(val)
      );
      setFiltered(results);
      setOpen(true);
    } else {
      setFiltered(saudiCities);
      setOpen(false);
    }
  };

  const handleSelect = (city: typeof saudiCities[0]) => {
    onChange(city.name);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && <label className="text-sm text-muted-foreground block mb-1">{label}</label>}
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="bg-muted/30"
        onFocus={() => { if (value.length > 0) setOpen(true); }}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {filtered.map((city) => (
            <button
              key={city.code}
              type="button"
              onClick={() => handleSelect(city)}
              className="flex items-center gap-3 w-full px-4 py-3 text-right hover:bg-muted/50 transition-colors border-b border-border/30 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{city.name}</p>
                <p className="text-xs text-muted-foreground">{city.country}</p>
              </div>
              {showCode && (
                <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{city.code}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
