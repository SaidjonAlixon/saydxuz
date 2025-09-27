import { Bot, Globe, FileSpreadsheet, Palette, Smartphone, Target } from "lucide-react";
import ServiceCard from "./ServiceCard";

//todo: remove mock functionality
const services = [
  {
    title: "Telegram Bot",
    description: "Biznesingiz uchun maxsus Telegram bot yaratamiz. Buyurtma qabul qilish, to'lov va mijozlar bilan muloqot.",
    price: "500,000 so'mdan",
    duration: "5-7 kun",
    rating: 4.8,
    category: "Avtomatlashtirish",
    icon: <Bot className="w-5 h-5" />,
    features: ["Buyurtma qabul qilish", "To'lov integratsiyasi", "Admin panel", "Mijozlar bazasi"]
  },
  {
    title: "Veb-sayt",
    description: "Zamonaviy, tezkor va SEO optimallashtirilgan veb-sayt. Mobil qurilmalarga moslashgan dizayn.",
    price: "800,000 so'mdan",
    duration: "7-14 kun",
    rating: 4.9,
    category: "Veb-dasturlash",
    icon: <Globe className="w-5 h-5" />,
    features: ["Responsive dizayn", "SEO optimizatsiya", "CMS tizimi", "Analitika"]
  },
  {
    title: "Sheets Avtomatlashtirish",
    description: "Google Sheets orqali biznes jarayonlarini avtomatlashtirish. Hisobotlar va ma'lumotlar tahlili.",
    price: "300,000 so'mdan",
    duration: "3-5 kun",
    rating: 4.7,
    category: "Avtomatlashtirish",
    icon: <FileSpreadsheet className="w-5 h-5" />,
    features: ["Avtomatik hisobotlar", "Ma'lumotlar tahlili", "Integratsiya", "Dashboard"]
  },
  {
    title: "UI/UX Dizayn",
    description: "Foydalanuvchilar uchun qulay va chiroyli interfeys dizayni. Prototip va dizayn tizimi.",
    price: "600,000 so'mdan",
    duration: "5-10 kun",
    rating: 4.9,
    category: "Dizayn",
    icon: <Palette className="w-5 h-5" />,
    features: ["Prototip yaratish", "Dizayn tizimi", "Foydalanuvchi testlari", "Brending"]
  },
  {
    title: "Mini-ilova",
    description: "Kichik va foydali ilovalar yaratish. Kalkulyator, booking tizimi va boshqa yechimlar.",
    price: "400,000 so'mdan",
    duration: "3-7 kun",
    rating: 4.6,
    category: "Dasturlash",
    icon: <Smartphone className="w-5 h-5" />,
    features: ["PWA texnologiyasi", "Offline ishlash", "Push bildirishnomalar", "API integratsiya"]
  },
  {
    title: "Target Reklama",
    description: "Samarali reklama kampaniyalari yaratish va boshqarish. Facebook, Instagram va Google Ads.",
    price: "200,000 so'mdan",
    duration: "2-5 kun",
    rating: 4.5,
    category: "Marketing",
    icon: <Target className="w-5 h-5" />,
    features: ["Auditoriya tahlili", "Kreativ yaratish", "A/B testing", "ROI optimizatsiya"]
  }
];

export default function ServiceGrid() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bizning Xizmatlar</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Biznesingizni rivojlantirish uchun zamonaviy IT yechimlar va professional xizmatlar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}