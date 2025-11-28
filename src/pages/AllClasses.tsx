// src/pages/AllClasses.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { ClassCard } from "@/components/ClassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { fetchClasses, OneDayClass } from "@/lib/api";
import { useAccessibility } from "@/contexts/AccessibilityContext";

type StoredUser = {
  id: number;
  name: string;
  role: "SENIOR" | "YOUTH";
};

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

const AllClasses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState<ClassCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeSearch, setActiveSearch] = useState(searchParams.get("q") || "");
  
  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get("category") || undefined
  );
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    searchParams.get("region") || undefined
  );

  const { largeText, highContrast } = useAccessibility();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("onnaUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as StoredUser);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const isSenior = user?.role === "SENIOR";
  const isLargeMode = isSenior || largeText;
  const pageBgClass = highContrast ? "bg-white text-black" : "bg-background";

  const titleClass = isLargeMode
    ? "text-3xl md:text-5xl font-bold"
    : "text-2xl md:text-3xl font-bold";

  const categories = ["전체", "요리", "공예", "예술", "기타"];
  const regions = ["전체", "부산", "울산", "경남"];

  // 클래스 데이터 로드
  const loadClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendClasses: OneDayClass[] = await fetchClasses({
        category: selectedCategory === "전체" ? undefined : selectedCategory,
        region: selectedRegion === "전체" ? undefined : selectedRegion,
      });

      let filtered = backendClasses;

      // 검색어 필터링 (클라이언트 사이드)
      if (activeSearch) {
        const query = activeSearch.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query) ||
            c.location.toLowerCase().includes(query)
        );
      }

      const mapped: ClassCardData[] = filtered.map((c) => ({
        id: String(c.id),
        title: c.title,
        description: c.description,
        category: c.category,
        location: c.location,
        price: c.price,
        teacherName: "선생님", // 임시
        rating: c.rating ?? 4.8,
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

  // 검색 실행
  const handleSearch = () => {
    setActiveSearch(searchQuery);
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory && selectedCategory !== "전체") 
      params.set("category", selectedCategory);
    if (selectedRegion && selectedRegion !== "전체") 
      params.set("region", selectedRegion);
    
    setSearchParams(params);
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    setSearchParams(params);
  };

  // 카테고리 선택
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "전체" ? undefined : category);
    const params = new URLSearchParams(searchParams);
    if (category === "전체") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    setSearchParams(params);
  };

  // 지역 선택
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region === "전체" ? undefined : region);
    const params = new URLSearchParams(searchParams);
    if (region === "전체") {
      params.delete("region");
    } else {
      params.set("region", region);
    }
    setSearchParams(params);
  };

  // 필터나 검색어 변경시 재로드
  useEffect(() => {
    loadClasses();
  }, [selectedCategory, selectedRegion, activeSearch]);

  return (
    <div className={`min-h-screen ${pageBgClass}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className={`${titleClass} text-foreground mb-2`}>
            모든 클래스
          </h1>
          <p className={isLargeMode ? "text-lg md:text-xl" : "text-base"}>
            부울경 지역 어르신의 특별한 원데이 클래스를 찾아보세요
          </p>
        </div>

        {/* 검색바 */}
        <div className="mb-6">
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="클래스 제목, 카테고리, 지역 검색..."
                className={`pl-12 ${isLargeMode ? "h-14 text-lg" : "h-12"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              className={`bg-gradient-warm text-white hover:opacity-90 ${
                isLargeMode ? "h-14 px-8 text-lg" : "h-12 px-6"
              }`}
            >
              검색
            </Button>
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="mb-8 space-y-4">
          {/* 카테고리 필터 */}
          <div>
            <h3 className={`${isLargeMode ? "text-lg" : "text-sm"} font-semibold mb-2`}>
              카테고리
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={
                    (selectedCategory === cat || (cat === "전체" && !selectedCategory))
                      ? "default"
                      : "outline"
                  }
                  size={isLargeMode ? "lg" : "sm"}
                  onClick={() => handleCategoryChange(cat)}
                  className={
                    (selectedCategory === cat || (cat === "전체" && !selectedCategory))
                      ? "bg-gradient-warm text-white"
                      : ""
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* 지역 필터 */}
          <div>
            <h3 className={`${isLargeMode ? "text-lg" : "text-sm"} font-semibold mb-2`}>
              지역
            </h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={
                    (selectedRegion === region || (region === "전체" && !selectedRegion))
                      ? "default"
                      : "outline"
                  }
                  size={isLargeMode ? "lg" : "sm"}
                  onClick={() => handleRegionChange(region)}
                  className={
                    (selectedRegion === region || (region === "전체" && !selectedRegion))
                      ? "bg-gradient-warm text-white"
                      : ""
                  }
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 활성 검색어 표시 */}
        {activeSearch && (
          <div className="mb-6 flex items-center gap-2">
            <span className={isLargeMode ? "text-lg" : "text-sm"}>
              검색 결과: <strong>"{activeSearch}"</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* 결과 카운트 */}
        <div className="mb-4">
          <p className={`${isLargeMode ? "text-lg" : "text-sm"} text-muted-foreground`}>
            총 <strong>{classes.length}</strong>개의 클래스
          </p>
        </div>

        {/* 로딩/에러/결과 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">클래스 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && classes.length === 0 && (
          <div className="text-center py-12 border rounded-xl bg-muted/50">
            <p className="text-lg text-muted-foreground">
              조건에 맞는 클래스가 없습니다.
            </p>
          </div>
        )}

        {!loading && !error && classes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <ClassCard key={classItem.id} {...classItem} isLargeMode={isLargeMode} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllClasses;