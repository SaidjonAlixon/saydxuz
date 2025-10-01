import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  phone: string;
  telegram: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
  file: File | null;
}

interface QuickLeadFormProps {
  defaultService?: string;
}

const services = [
  "Telegram Bot",
  "Veb-sayt",
  "Sheets Avtomatlashtirish", 
  "UI/UX Dizayn",
  "Mini-ilova",
  "Target Reklama",
  "Mobil ilovalar",
  "Avtomatlashtirilgan AyTi xizmatlar",
  "Mijoz talabi asosida"
];

const budgetRanges = [
  "$100 - $300",
  "$300 - $500", 
  "$500 - $1,000",
  "$1,000 - $1,500",
  "$1,500+"
];

const timelines = [
  "1 hafta ichida",
  "2-3 hafta ichida",
  "1 oy ichida",
  "Muddati muhim emas"
];

export default function QuickLeadForm({ defaultService }: QuickLeadFormProps = { defaultService: undefined }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    telegram: "",
    service: defaultService || "",
    budget: "",
    timeline: "",
    description: "",
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultService) {
      setFormData(prev => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('998')) {
      const formatted = numbers.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
      return formatted;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        toast({
          title: "Fayl juda katta",
          description: "Fayl hajmi 15MB dan katta bo'lmasligi kerak",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('serviceType', formData.service);
      
      if (formData.telegram) formDataToSubmit.append('telegram', formData.telegram);
      if (formData.budget) formDataToSubmit.append('budget', formData.budget);
      if (formData.timeline) formDataToSubmit.append('timeline', formData.timeline);
      if (formData.description) formDataToSubmit.append('description', formData.description);
      if (formData.file) formDataToSubmit.append('file', formData.file);
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formDataToSubmit
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Buyurtma qabul qilindi!",
          description: "Tez orada siz bilan bog'lanamiz. Rahmat!"
        });
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          telegram: "",
          service: defaultService || "",
          budget: "",
          timeline: "",
          description: "",
          file: null
        });
      } else {
        toast({
          title: "Xatolik!",
          description: result.message || "Arizani yuborishda xatolik yuz berdi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Xatolik!",
        description: "Tarmoq xatoligi. Iltimos qaytadan urinib ko'ring",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.phone && formData.service;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Tez Ariza Yuborish</CardTitle>
        <CardDescription>
          Ma'lumotlaringizni qoldiring, biz tez orada siz bilan bog'lanamiz
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ism-familiya *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ismingizni kiriting"
              data-testid="input-name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqam *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="+998 90 123 45 67"
              data-testid="input-phone"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram username</Label>
            <Input
              id="telegram"
              value={formData.telegram}
              onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
              placeholder="@username"
              data-testid="input-telegram"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Xizmat turi *</Label>
            <Select 
              value={formData.service} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
            >
              <SelectTrigger data-testid="select-service">
                <SelectValue placeholder="Xizmatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Taxminiy byudjet</Label>
            <Select 
              value={formData.budget} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
            >
              <SelectTrigger data-testid="select-budget">
                <SelectValue placeholder="Byudjetni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Kerakli muddat</Label>
            <Select 
              value={formData.timeline} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
            >
              <SelectTrigger data-testid="select-timeline">
                <SelectValue placeholder="Muddatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Qisqa tavsif</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Loyihangiz haqida qisqacha ma'lumot bering..."
              rows={3}
              data-testid="textarea-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Qo'shimcha fayl (≤15MB)</Label>
            <div className="space-y-2">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                data-testid="input-file"
              />
              {!formData.file ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('file')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Fayl yuklash
                </Button>
              ) : (
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm truncate">{formData.file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid || isSubmitting}
            data-testid="button-submit-lead"
          >
            {isSubmitting ? (
              <>Yuborilmoqda...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ariza yuborish
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}