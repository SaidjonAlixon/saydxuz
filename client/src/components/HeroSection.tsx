import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@assets/generated_images/Modern_tech_workspace_hero_c9c8682e.png";

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Uddalab bo'lmas topshiriqlar bajaruvchisi";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="SAYD.X xizmatlari" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="inline-block border-r-2 border-white animate-blink">
              {displayText}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Telegram bot, veb-sayt, avtomatlashtirish va boshqa IT yechimlarni 
            mobil qurilmalarda tez va sifatli taqdim etamiz
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold"
            data-testid="button-quick-request"
            onClick={() => console.log("Tez ariza triggered")}
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Tez ariza yuborish
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/30 text-white backdrop-blur-sm bg-white/10 hover:bg-white/20"
            data-testid="button-view-services"
            onClick={() => console.log("Xizmatlarni ko'rish triggered")}
          >
            <Play className="w-5 h-5 mr-2" />
            Xizmatlarni ko'rish
          </Button>
        </div>
      </div>
    </section>
  );
}