import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClassCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  teacherName: string;
  teacherImage?: string;
  rating?: number;
  imageUrl?: string;
}

export const ClassCard = ({
  id,
  title,
  description,
  category,
  location,
  price,
  teacherName,
  teacherImage,
  rating = 4.8,
  imageUrl,
}: ClassCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover cursor-pointer border-border bg-card" onClick={() => navigate(`/classes/${id}`)}>
      <div className="relative h-48 overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-soft flex items-center justify-center">
            <span className="text-4xl opacity-20">🎨</span>
          </div>
        )}
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {teacherImage ? (
              <img src={teacherImage} alt={teacherName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-warm flex items-center justify-center text-white font-bold">
                {teacherName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{teacherName} 선생님</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs text-muted-foreground">{rating}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">원</span>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-warm text-white hover:opacity-90 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/classes/${id}`);
          }}
        >
          자세히 보기
        </Button>
      </CardContent>
    </Card>
  );
};
