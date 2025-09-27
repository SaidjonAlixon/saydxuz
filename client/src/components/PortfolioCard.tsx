import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Users, Clock } from "lucide-react";

interface PortfolioCardProps {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  results: {
    metric: string;
    value: string;
    icon: React.ReactNode;
  }[];
  image: string;
  duration: string;
}

export default function PortfolioCard({
  title,
  description,
  category,
  technologies,
  results,
  image,
  duration
}: PortfolioCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Technologies */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Texnologiyalar:</p>
          <div className="flex flex-wrap gap-1">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Natijalar:</p>
          <div className="grid grid-cols-2 gap-3">
            {results.map((result, index) => (
              <div key={index} className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="flex justify-center mb-1">
                  {result.icon}
                </div>
                <div className="text-lg font-bold text-primary">{result.value}</div>
                <div className="text-xs text-muted-foreground">{result.metric}</div>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          data-testid={`button-view-case-${title.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={() => console.log(`Viewing case study: ${title}`)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Batafsil ko'rish
        </Button>
      </CardContent>
    </Card>
  );
}