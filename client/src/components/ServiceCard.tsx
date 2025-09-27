import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Star } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  rating: number;
  category: string;
  icon: React.ReactNode;
  features: string[];
}

export default function ServiceCard({
  title,
  description,
  price,
  duration,
  rating,
  category,
  icon,
  features
}: ServiceCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-300 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
            <div>
              <Badge variant="secondary" className="text-xs mb-2">
                {category}
              </Badge>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="font-semibold text-primary">{price}</div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Asosiy imkoniyatlar:</p>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          className="w-full mt-4" 
          data-testid={`button-service-${title.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={() => console.log(`${title} service selected`)}
        >
          Batafsil ma'lumot
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}