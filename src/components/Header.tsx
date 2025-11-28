// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Calendar, Eye, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "../contexts/AccessibilityContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 로그인 성공 시 저장해 둘 role 타입
type UserRole = "SENIOR" | "YOUTH" | null;

// localStorage에 저장되는 사용자 정보 타입
type StoredUser = {
  id: number;
  name: string;
  role: "SENIOR" | "YOUTH";
};

export const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const { highContrast, largeText, toggleHighContrast, toggleLargeText } =
    useAccessibility();

  // 앱 로드 시 localStorage에서 로그인 정보 읽기
  useEffect(() => {
    const stored = localStorage.getItem("onnaUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredUser;
        setUser(parsed);
        setUserRole(parsed.role);
      } catch (e) {
        console.error("저장된 사용자 정보 파싱 실패:", e);
        setUser(null);
        setUserRole(null);
      }
    } else {
      setUser(null);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  // 로그아웃: localStorage 비우고 상태 초기화
  const handleSignOut = () => {
    // 1) 로그인 정보 제거
    localStorage.removeItem("onnaUser");

    // 2) 헤더 내부 상태도 초기화
    setUser(null);
    setUserRole(null);

    // 3) 전체 앱 새로고침 + 홈으로 이동
    window.location.href = "/"; // navigate 대신 전체 새로고침
  };

  const isSenior = userRole === "SENIOR";
  const isYouth = userRole === "YOUTH";

  // 역할별 브랜드 텍스트
  const brandTitle = isSenior ? "온-나" : "On-Na";

  // 로딩 중일 때 헤더 깜빡임 방지
  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 h-16 flex items-center justify-center" />
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 영역 */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1
              className={`text-xl font-bold text-foreground ${
                isSenior ? "text-2xl" : ""
              }`}
            >
              {brandTitle}
            </h1>
            <p
              className={`text-xs text-muted-foreground ${
                isSenior ? "text-sm" : ""
              }`}
            >
              부울경 세대연결 플랫폼
            </p>
          </div>
        </div>

        {/* 오른쪽 네비게이션 */}
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={() => navigate("/")}
          >
            클래스 찾기
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={() => navigate("/teachers")}
          >
            어르신 소개
          </Button>

          {/* 접근성 설정 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isSenior ? "default" : "ghost"}
                className={
                  isSenior
                    ? "bg-[#f08c35] text-white hover:bg-[#e07c25] transition-colors font-bold h-10 px-4"
                    : "text-foreground hover:text-primary"
                }
              >
                <Eye
                  className={`mr-1 ${
                    isSenior ? "w-5 h-5" : "w-4 h-4"
                  }`}
                />
                {isSenior ? "접근성 설정" : ""}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="high-contrast"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>고대비 모드</span>
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={toggleHighContrast}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="large-text"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Type className="w-4 h-4" />
                    <span>큰 글씨 모드</span>
                  </Label>
                  <Switch
                    id="large-text"
                    checked={largeText}
                    onCheckedChange={toggleLargeText}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 로그인 여부에 따른 버튼 분기 */}
          {user ? (
            <>
              {/* 청년: 예약 상세 페이지 */}
              {isYouth && (
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary font-semibold"
                  onClick={() => navigate("/reservations")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  예약 상세 페이지
                </Button>
              )}

              {/* 시니어: 클래스 개설 / 관리 페이지 */}
              {isSenior && (
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary font-bold text-lg"
                  onClick={() => navigate("/dashboard")} // 시니어는 /dashboard 로 이동
                >
                  <Calendar className="w-6 h-6 mr-2" />
                  클래스 개설 / 관리
                </Button>
              )}

              {/* 로그아웃 */}
              <Button
                variant={isSenior ? "default" : "outline"}
                onClick={handleSignOut}
                className={
                  isSenior
                    ? "bg-red-500 text-white hover:bg-red-600 border-red-500 hover:text-white h-10 px-6 text-base font-bold"
                    : ""
                }
              >
                로그아웃
              </Button>
            </>
          ) : (
            // 비로그인: 로그인 버튼
            <Button
              className="bg-gradient-warm text-white hover:opacity-90 transition-opacity"
              onClick={() => navigate("/auth")}
            >
              로그인
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
