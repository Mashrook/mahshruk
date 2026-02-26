import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTenantStore } from "@/stores/tenantStore";
import khattahLogo from "@/assets/khattah-logo.png";

const footerLinks = {
  services: [
    { href: "/flights", label: "حجز الطيران" },
    { href: "/hotels", label: "حجز الفنادق" },
    { href: "/cars", label: "تأجير السيارات" },
    { href: "/tours", label: "الجولات السياحية" },
    { href: "/transfers", label: "خدمة التنقلات" },
  ],
  explore: [
    { href: "/offers", label: "العروض" },
    { href: "/destinations", label: "الوجهات" },
    { href: "/articles", label: "المقالات" },
  ],
  company: [
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "اتصل بنا" },
    { href: "/privacy", label: "سياسة الخصوصية" },
    { href: "/terms", label: "الشروط والأحكام" },
  ],
};

export default function Footer() {
  const { branding, tenant } = useTenantStore();

  const logoUrl = branding?.logo_url || khattahLogo;
  const brandName = tenant?.name || "خته";
  const brandNameEn = tenant?.slug?.toUpperCase() || "5ATTAH";
  const supportEmail = branding?.support_email || "info@5attah.com";
  const supportPhone = branding?.support_phone || "+966 54 245 4094";
  const footerText = branding?.footer_text || `© ${new Date().getFullYear()} 5ATTAH - خته. جميع الحقوق محفوظة.`;

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={logoUrl} alt={brandName} className="w-12 h-12 rounded-xl object-contain shadow-gold" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">{brandName}</span>
                <span className="text-xs text-muted-foreground tracking-wider">{brandNameEn}</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              منصتك الموثوقة لحجز الرحلات والفنادق والسيارات والجولات السياحية بأفضل الأسعار.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>{supportEmail}</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span dir="ltr">{supportPhone}</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>المملكة العربية السعودية، الرياض، طريق الملك فهد</span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-foreground font-bold mb-6">خدماتنا</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-foreground font-bold mb-6">استكشف</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground font-bold mb-6">الشركة</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">{footerText}</p>
        </div>
      </div>
    </footer>
  );
}
