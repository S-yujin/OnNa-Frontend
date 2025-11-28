import { useEffect, useState } from "react";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ClassCard } from "@/components/ClassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchClasses, OneDayClass } from "@/lib/api";
import { useAccessibility } from "@/contexts/AccessibilityContext";

// 로그인 정보 타입 (Header/Auth에서 쓰는 것과 동일하게 맞추기)
type StoredUser = {
  id: number;
  name: string;
  role: "SENIOR" | "YOUTH";
};

// 카드 컴포넌트에 맞춘 타입 (백엔드 데이터 + 프론트에서 쓰는 필드)
type ClassCardData = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  teacherName: string;
  rating: number;
};

const Index = () => {
  const [classes, setClasses] = useState<ClassCardData[]>([]);
  const [activeTab, setActiveTab] =
    useState<"all" | "cooking" | "craft" | "art">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 접근성 + 시니어 여부
  const { largeText, highContrast } = useAccessibility();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("onnaUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredUser;
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const isSenior = user?.role === "SENIOR";
  // 시니어이거나 접근성 큰 글씨 모드가 켜졌으면 전체 크게
  const isLargeMode = isSenior || largeText;

  const pageBgClass = highContrast ? "bg-white text-black" : "bg-background";

  const sectionTitleClass = isLargeMode
    ? "text-3xl md:text-6xl font-bold text-foreground mb-2"
    : "text-3xl font-bold text-foreground mb-2";

  const sectionSubClass = isLargeMode
    ? "text-lg md:text-4xl text-muted-foreground"
    : "text-muted-foreground";

  const tabsTriggerClass = isLargeMode ? "text-lg px-8 py-3" : "";

  const stepTitleClass = isLargeMode
    ? "text-3xl md:text-6xl font-bold text-foreground"
    : "text-xl font-bold text-foreground";

  const stepBodyClass = isLargeMode
    ? "text-lg md:text-4xl text-muted-foreground"
    : "text-muted-foreground";

  const footerTextClass = isLargeMode
    ? "text-lg text-muted-foreground"
    : "text-muted-foreground";

  const footerSmallClass = isLargeMode
    ? "text-base text-muted-foreground"
    : "text-sm text-muted-foreground";

  const loadClasses = async (category: string | undefined) => {
    setLoading(true);
    setError(null);
    try {
      const backendClasses: OneDayClass[] = await fetchClasses({
        category,
      });

      const mapped: ClassCardData[] = backendClasses.map((c) => ({
        id: String(c.id),
        title: c.title,
        description: c.description,
        category: c.category,
        location: c.location,
        price: c.price,
        teacherName: "홍길동", // 임시 필드
        rating: 4.8,
      }));

      setClasses(mapped);
    } catch (e) {
      console.error(e);
      setError("클래스 목록을 불러오지 못했어요.");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // 탭 → 백엔드 category 값 매핑
  const categoryMap: Record<typeof activeTab, string | undefined> = {
    all: undefined,
    cooking: "요리",
    craft: "공예",
    art: "예술",
  };

  useEffect(() => {
    loadClasses(categoryMap[activeTab]);
  }, [activeTab]);

  return (
    <div className={`min-h-screen ${pageBgClass}`}>
      <Header />
      <Hero />

      {/* 인기 클래스 섹션 */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={sectionTitleClass}>인기 클래스</h2>
            <p className={sectionSubClass}>지금 가장 사랑받는 원데이 클래스</p>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "all" | "cooking" | "craft" | "art")
          }
          className="mb-8"
        >
          <TabsList className="bg-muted">
            <TabsTrigger value="all" className={tabsTriggerClass}>
              전체
            </TabsTrigger>
            <TabsTrigger value="cooking" className={tabsTriggerClass}>
              요리
            </TabsTrigger>
            <TabsTrigger value="craft" className={tabsTriggerClass}>
              공예
            </TabsTrigger>
            <TabsTrigger value="art" className={tabsTriggerClass}>
              예술
            </TabsTrigger>
          </TabsList>

          {/* 탭 내용은 동일 (필터만 바뀌니까 비워둬도 됨) */}
          <TabsContent value="all" />
          <TabsContent value="cooking" />
          <TabsContent value="craft" />
          <TabsContent value="art" />
        </Tabs>

        {loading && (
          <p className="text-center text-muted-foreground mb-4">
            클래스 불러오는 중...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {classes.map((classItem) => (
            <ClassCard key={classItem.id} {...classItem} isLargeMode={isLargeMode} />
            
          ))}

          {!loading && !error && classes.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              조건에 맞는 클래스가 아직 없어요.
            </p>
          )}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size={isLargeMode ? "lg" : "default"}
            className={
              "border-primary text-primary hover:bg-primary hover:text-white transition-all " +
              (isLargeMode ? "text-lg px-8 py-6" : "")
            }
          >
            더 많은 클래스 보기
          </Button>
        </div>
      </section>

      {/* 3단계 안내 섹션 */}
      <section className="py-16 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={sectionTitleClass}>어떻게 시작하나요?</h2>
              <p className={sectionSubClass}>
                간단한 3단계로 특별한 배움을 시작하세요
              </p>
            </div>

            {/* 정렬 수정: 큰 글씨에서도 겹치지 않게 */}
            <div className="grid gap-12 md:grid-cols-1 xl:grid-cols-3">
              {/* 1단계 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-warm flex items-center justify-center text-white text-3xl font-bold">
                  1
                </div>
                <h3 className={`${stepTitleClass} leading-tight`}>클래스 선택</h3>
                <p
                  className={`${stepBodyClass} leading-snug max-w-xs md:max-w-md`}
                >
                  배우고 싶은 기술을 선택하고 어르신 선생님을 만나보세요
                </p>
              </div>

              {/* 2단계 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-warm flex items-center justify-center text-white text-3xl font-bold">
                  2
                </div>
                <h3 className={`${stepTitleClass} leading-tight`}>간편 예약</h3>
                <p
                  className={`${stepBodyClass} leading-snug max-w-xs md:max-w-md`}
                >
                  원하는 날짜와 시간을 선택하고 예약하세요
                </p>
              </div>

              {/* 3단계 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-warm flex items-center justify-center text-white text-3xl font-bold">
                  3
                </div>
                <h3 className={`${stepTitleClass} leading-tight`}>즐거운 수업</h3>
                <p
                  className={`${stepBodyClass} leading-snug max-w-xs md:max-w-md`}
                >
                  따뜻한 이야기와 함께 특별한 기술을 배워가세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className={footerTextClass + " mb-2"}>
              © 2024 손재주 클래스. All rights reserved.
            </p>
            <p className={footerSmallClass}>부울경 세대연결 플랫폼</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
