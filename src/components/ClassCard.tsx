// src/components/ClassCard.tsx
import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ClassCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  teacherName: string;
  rating: number;
  isLargeMode?: boolean;
};

export const ClassCard: FC<ClassCardProps> = ({
  id,
  title,
  description,
  category,
  location,
  price,
  teacherName,
  rating,
  isLargeMode = false,
}) => {
  const navigate = useNavigate();

  const titleClass = isLargeMode
    ? "text-xl md:text-2xl font-bold text-foreground"
    : "text-lg font-semibold text-foreground";

  const descClass = isLargeMode
    ? "text-base md:text-lg text-muted-foreground"
    : "text-sm text-muted-foreground";

  const metaClass = isLargeMode
    ? "text-sm md:text-base text-muted-foreground"
    : "text-xs text-muted-foreground";

  const priceClass = isLargeMode
    ? "text-2xl md:text-3xl font-extrabold text-[#f97316]"
    : "text-xl font-bold text-[#f97316]";

  const buttonClass = isLargeMode
    ? "mt-3 h-12 text-lg rounded-xl"
    : "mt-3 h-10 text-sm rounded-lg";

  return (
    <Card className="overflow-hidden shadow-sm border border-[#f3e0c8] bg-card">
      {/* 상단 썸네일 & 카테고리 뱃지 */}
      <div className="relative h-32 bg-gradient-soft">
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-warm text-white text-xs font-semibold">
          {category}
        </span>
      </div>

      <CardContent className={isLargeMode ? "p-6" : "p-4"}>
        {/* 제목 & 설명 */}
        <div className="space-y-2 mb-4">
          <h3 className={titleClass}>{title}</h3>
          <p className={descClass}>{description}</p>
        </div>

        {/* 선생님 정보 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-warm flex items-center justify-center text-white text-sm font-bold">
            {teacherName[0]}
          </div>
          <div className="flex flex-col">
            <span className={metaClass + " flex items-center gap-1"}>
              <User className="w-3 h-3" />
              {teacherName} 선생님
            </span>
            <span className={metaClass}>★ {rating.toFixed(1)}</span>
          </div>
        </div>

        {/* 위치 & 가격 & 버튼 */}
        <div className="border-t pt-3 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className={metaClass + " flex items-center gap-1"}>
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          </div>
          <div className="text-right">
            <div className={priceClass}>{price.toLocaleString()}원</div>
            <button
              type="button"
              onClick={() => navigate(`/classes/${id}`)}
              className={
                "w-full bg-gradient-warm text-white font-semibold " +
                "hover:opacity-90 transition-opacity " +
                buttonClass
              }
            >
              자세히 보기
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
