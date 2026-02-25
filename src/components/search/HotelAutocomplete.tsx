import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Hotel, MapPin } from "lucide-react";
import { hotels } from "@/data/hotelsData";

const cities = [
  { name: "الرياض", type: "city" as const },
  { name: "جدة", type: "city" as const },
  { name: "مكة المكرمة", type: "city" as const },
  { name: "المدينة المنورة", type: "city" as const },
  { name: "الدمام", type: "city" as const },
  { name: "أبها", type: "city" as const },
  { name: "الطائف", type: "city" as const },
  { name: "تبوك", type: "city" as const },
];

type Suggestion = { name: string; type: "city" | "hotel"; subtext?: string };

interface HotelAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function HotelAutocomplete({ value, onChange, placeholder, label }: HotelAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
      const cityResults: Suggestion[] = cities
        .filter((c) => c.name.includes(val))
        .map((c) => ({ name: c.name, type: "city", subtext: "مدينة" }));
      const hotelResults: Suggestion[] = hotels
        .filter((h) => h.name.includes(val) || h.city.includes(val))
        .slice(0, 5)
        .map((h) => ({ name: h.name, type: "hotel", subtext: h.city }));
      setSuggestions([...cityResults, ...hotelResults]);
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
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
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={`${s.name}-${i}`}
              type="button"
              onClick={() => { onChange(s.name); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-right hover:bg-muted/50 transition-colors border-b border-border/30 last:border-b-0"
            >
              {s.type === "city" ? (
                <MapPin className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Hotel className="w-4 h-4 text-secondary shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.subtext}</p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                {s.type === "city" ? "مدينة" : "فندق"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
