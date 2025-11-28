// src/pages/TeacherDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccessibility } from "@/contexts/AccessibilityContext";

// Header / Auth와 동일한 타입
type StoredUser = {
  id: number;
  name: string;
  role: "SENIOR" | "YOUTH";
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { highContrast, largeText } = useAccessibility();

  useEffect(() => {
    const stored = localStorage.getItem("onnaUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredUser;
        setUser(parsed);
      } catch (e) {
        console.error("저장된 사용자 정보 파싱 실패:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  // 글자 크게 + 대비 강하게
  const titleClass = largeText
    ? "text-4xl md:text-5xl font-extrabold"
    : "text-3xl md:text-4xl font-extrabold";

  const bodyTextClass = largeText
    ? "text-2xl md:text-3xl leading-relaxed"
    : "text-xl md:text-2xl leading-relaxed";

  const strongCardClass = highContrast
    ? "bg-white border-2 border-black shadow-xl"
    : "bg-[#fffaf3] border border-[#f3c9a8] shadow-md";

  const pageBgClass = highContrast
    ? "bg-white text-black"
    : "bg-[#fff7ed] text-[#3b2a1a]";

  const primaryButtonClass = highContrast
    ? "bg-[#c2410c] hover:bg-[#9a3412] text-white"
    : "bg-gradient-warm text-white hover:opacity-90";

  const secondaryButtonClass = highContrast
    ? "border-2 border-black text-black hover:bg-black hover:text-white"
    : "border border-[#f08c35] text-[#b45309] hover:bg-[#fef3c7]";

  // 1) 로그인 안 된 경우
  if (!user) {
    return (
      <div
        className={
          "min-h-[calc(100vh-4rem)] flex items-center justify-center " +
          pageBgClass
        }
      >
        <Card
          className={
            "w-full max-w-2xl text-center py-10 px-8 md:px-10 " +
            strongCardClass
          }
        >
          <CardHeader>
            <CardTitle className={titleClass}>로그인이 필요합니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className={bodyTextClass}>
              어르신이 직접 클래스를 개설하시려면
              <br />
              먼저 로그인해 주세요.
            </p>
            <Button
              className={
                primaryButtonClass +
                " h-14 px-10 text-xl font-semibold rounded-2xl"
              }
              onClick={() => navigate("/auth")}
            >
              로그인하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2) 청년이 URL로 직접 들어온 경우
  if (user.role !== "SENIOR") {
    return (
      <div
        className={
          "min-h-[calc(100vh-4rem)] flex items-center justify-center " +
          pageBgClass
        }
      >
        <Card
          className={
            "w-full max-w-2xl text-center py-10 px-8 md:px-10 " +
            strongCardClass
          }
        >
          <CardHeader>
            <CardTitle className={titleClass}>
              선생님 전용 페이지입니다
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className={bodyTextClass}>
              이 페이지는 어르신 선생님 계정에서만 이용하실 수 있어요.
              <br />
              클래스 수강을 원하시면{" "}
              <span className="font-semibold">클래스 찾기</span> 메뉴를
              이용해 주세요.
            </p>
            <Button
              variant="outline"
              className={
                secondaryButtonClass +
                " h-14 px-10 text-xl font-semibold rounded-2xl bg-white"
              }
              onClick={() => navigate("/")}
            >
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3) 시니어 정상 접근 (위 환영 박스만 사용)
  return (
    <div
      className={
        "min-h-[calc(100vh-4rem)] px-4 py-8 " +
        pageBgClass
      }
    >
      <div className="max-w-5xl mx-auto">
        <section
          className={
            "rounded-3xl px-6 py-8 md:px-10 md:py-10 flex flex-col gap-6 " +
            (highContrast
              ? "bg-white border-2 border-black shadow-xl"
              : "bg-gradient-to-r from-[#fed7aa] via-[#fdba74] to-[#fb923c] text-[#3b2a1a] shadow-lg")
          }
        >
          <h1 className={titleClass}>
            {user.name} 선생님, 반갑습니다 👋
          </h1>
          <p className={bodyTextClass}>
            선생님의 손재주와 지혜를 나눌 클래스를
            <br className="hidden md:block" />
            간단하게 등록하고 관리하실 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Button
              className={
                "h-14 px-10 text-xl font-bold rounded-2xl " +
                (highContrast
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white/95 text-[#c2410c] hover:bg-white")
              }
            >
              + 새 클래스 개설하기
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
