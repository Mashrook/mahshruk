import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const whatsappNumber = "+966542454094";

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "مرحبًا بك! أنا مساعد مشروك الذكي. اسألني عن العروض أو التسجيل أو أفضل وجهة حسب الموسم.",
  },
];

const getSmartReply = (message: string) => {
  const text = message.toLowerCase();
  if (text.includes("تسجيل") || text.includes("حساب")) {
    return "للتسجيل: اختر (تسجيل جديد) من الأعلى، أدخل بياناتك، وسيتم تفعيل الحساب فورًا.";
  }
  if (text.includes("عروض") || text.includes("خصم")) {
    return "لدينا عروض موسمية تشمل الطيران والفنادق والأنشطة. أخبرني بالوجهة والمدة لأقترح لك الأنسب.";
  }
  if (text.includes("شتاء")) {
    return "في الشتاء أنصحك بدبي، العُلا، أو البحر الأحمر لاعتدال الطقس والفعاليات المتنوعة.";
  }
  if (text.includes("صيف")) {
    return "في الصيف خياران مميزان: أبها وعسير للأجواء المعتدلة، أو جورجيا للهروب من الحرارة.";
  }
  if (text.includes("ربيع") || text.includes("خريف")) {
    return "الربيع والخريف مثاليان لتركيا، أوروبا، أو جبال السعودية حيث تكون الأجواء لطيفة.";
  }
  if (text.includes("دعم") || text.includes("واتساب") || text.includes("واتس")) {
    return "يمكنني تحويلك للدعم الفني عبر واتساب الآن.";
  }
  return "وصلتني رسالتك. هل ترغب في عروض موسمية، شهر عسل، دراسة بالخارج، أم نشاطات محلية؟";
};

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const nextId = messages.length + 1;
    const replyText = getSmartReply(trimmed);
    setMessages((prev) => [
      ...prev,
      { id: nextId, role: "user", text: trimmed },
      { id: nextId + 1, role: "assistant", text: replyText },
    ]);
    setInput("");
  };

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 transition-all ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="w-80 max-w-[90vw] bg-card rounded-2xl shadow-hover border border-border overflow-hidden">
          <div className="hero-gradient px-4 py-3 flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">مساعد مشروك</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-primary-foreground/10 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`text-sm leading-relaxed rounded-xl px-3 py-2 ${
                  message.role === "assistant"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground ml-6"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3 space-y-2">
            <Textarea
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="اكتب رسالتك هنا..."
            />
            <div className="flex items-center gap-2">
              <Button variant="hero" size="sm" className="flex-1 gap-2" onClick={sendMessage}>
                <Send className="w-4 h-4" />
                إرسال
              </Button>
              <a
                href={`https://wa.me/${whatsappNumber.replace("+", "")}`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-accent-foreground"
                title="تحويل إلى واتساب"
                rel="noreferrer"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 w-14 h-14 hero-gradient rounded-full shadow-hover flex items-center justify-center animate-pulse-soft hover:scale-110 transition-transform z-40"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="فتح المساعد الذكي"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>
    </>
  );
}
