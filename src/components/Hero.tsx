// src/components/Hero.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/classes?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/classes");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gradient-soft py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-block">
            <span className="inline-block px-4 py-2 rounded-full bg-warm-peach-light text-sm font-medium text-foreground mb-4">
              부울경 지역 세대연결 플랫폼
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            어르신의 손재주를
            <br />
            <span className="text-primary">배우고 나누는</span> 시간
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            60년 경험이 담긴 특별한 원데이 클래스, 
            지역 어르신과 청년이 함께 만드는 따뜻한 배움의 공간입니다
          </p>

          <div className="flex gap-3 max-w-2xl mx-auto pt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="어떤 기술을 배우고 싶으신가요?"
                className="pl-12 h-14 text-base bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-14 px-8 bg-gradient-warm text-white hover:opacity-90 transition-opacity text-base font-semibold"
            >
              클래스 찾기
            </Button>
          </div>

          <div className="flex justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">150+</span>
              <span>등록된 클래스</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">80+</span>
              <span>선생님</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">1,200+</span>
              <span>수강생</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};