// src/pages/ClassDetail.tsx
import { useEffect, useState, useCallback } from "react"; // 💡 useCallback 추가
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MapPin, Clock, Users } from "lucide-react";
import axios from "axios"; // 💡 axios import 추가

import { Header } from "@/components/Header";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { OneDayClass, fetchClassDetail } from "@/lib/api";

type StoredUser = {
  id: number;
  name: string;
  role: "SENIOR" | "YOUTH";
};

const ClassDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const { largeText, highContrast } = useAccessibility();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [classData, setClassData] = useState<OneDayClass | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 💡 API Base URL 선언 (환경 변수 사용)
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9090";

  // 💡 클래스 상세 정보를 불러오는 함수를 분리하여 useCallback 적용
  const loadClassDetail = useCallback(async (classId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClassDetail(classId);
      setClassData(data);
    } catch (e) {
      console.error(e);
      setError("클래스 정보를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  }, []); // 의존성 배열이 비어 있음 (함수가 변하지 않음)

  // 로그인 정보 로드
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

  // 클래스 상세 정보 로드 (초기 로딩)
  useEffect(() => {
    if (!id) return;
    loadClassDetail(Number(id));
  }, [id, loadClassDetail]);

  const isLargeMode = largeText || user?.role === "SENIOR";
  const pageBgClass = highContrast ? "bg-white text-black" : "bg-background";

  const handleReserveClick = async () => {
    // 1. 로그인 여부 및 권한 확인
    if (!user) {
      const redirect = encodeURIComponent(location.pathname);
      navigate(`/auth?redirect=${redirect}`);
      return;
    }

    if (user.role !== "YOUTH") {
      alert("예약은 청년 회원만 가능합니다.");
      return;
    }

    // 2. 클래스 데이터 유효성 검사
    if (!classData || !classData.id) {
        alert("클래스 정보가 유효하지 않아 예약할 수 없습니다.");
        return;
    }

    // 3. 사용자 확인
    const confirmReservation = window.confirm(
        `${classData.title} 클래스를 예약하시겠습니까? (인원: 1명)`
    );

    if (confirmReservation) {
        try {
            // 4. 예약 생성 API 호출 (백엔드 컨트롤러의 POST /api/reservations 호출)
            const response = await axios.post(`${baseUrl}/api/reservations`, {
                classId: classData.id,
                userId: user.id, // InMemoryService에서 userId를 받도록 정의됨
                headCount: 1,    // MVP에서는 1명으로 고정
            });

            if (response.status === 200 || response.status === 201) {
                alert(`✅ 예약이 완료되었습니다! 예약 번호: ${response.data.id}`);
                
                // 💡 예약 성공 후 데이터를 다시 불러와서 인원 수 갱신
                await loadClassDetail(classData.id);

                // 예약 성공 후 내 예약 목록 페이지로 이동
                setTimeout(() => navigate("/reservations"), 300); 
            } else {
                alert(`❌ 예약에 실패했습니다. 서버 응답 코드: ${response.status}`);
            }
        } catch (e) {
            console.error("예약 생성 실패:", e);
            const message = axios.isAxiosError(e) && e.response 
                ? `❌ 예약 생성 중 오류가 발생했습니다: ${e.response.data?.message || e.message}`
                : "❌ 예약 생성 중 네트워크 오류가 발생했습니다.";
            alert(message);
        }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBgClass}`}>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground">
            클래스 정보를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className={`min-h-screen ${pageBgClass}`}>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <p className="text-center text-red-500">
            {error ?? "클래스를 찾을 수 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  // ====== 여기서부터 화면에 쓸 값들 가공 ======

  // 날짜/시간 표시용
  const dateLabel = classData.date;
  const startLabel = classData.startTime?.slice(0, 5); 
  const endLabel = classData.endTime?.slice(0, 5);     

  // 수업 시간 계산 (startTime/endTime 기준, 실패하면 3시간으로)
  const calcDurationHours = () => {
    try {
      const [sh, sm] = classData!.startTime!.split(":").map(Number);
      const [eh, em] = classData!.endTime!.split(":").map(Number);
      if (
        Number.isNaN(sh) ||
        Number.isNaN(sm) ||
        Number.isNaN(eh) ||
        Number.isNaN(em)
      ) {
        return 3;
      }
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;
      const diff = Math.max(endMinutes - startMinutes, 0);
      return diff / 60;
    } catch {
      return 3;
    }
  };

  const durationHours = calcDurationHours();

  // 현재 인원 & 정원 & 평점
  const capacity = classData.capacity;
  const currentCount = classData.currentCount ?? capacity; 
  const rating = classData.rating ?? 4.9;
  const ratingLabel = rating.toFixed(1);

  return (
    <div className={`min-h-screen ${pageBgClass}`}>
      <Header />

      <main className="container mx-auto px-4 py-10">
        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground mb-4 hover:underline"
        >
          ← 목록으로 돌아가기
        </button>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* 왼쪽: 썸네일 + 설명 */}
          <section>
            <div className="mb-8">
              <div className="relative h-72 md:h-96 bg-muted rounded-3xl flex items-center justify-center">
                <span className="text-5xl">🎨</span>
                <span className="absolute top-4 right-4 px-4 py-1 rounded-full bg-gradient-warm text-white text-sm font-semibold">
                  {classData.category}
                </span>
              </div>

              <h1
                className={
                  (isLargeMode
                    ? "text-3xl md:text-4xl"
                    : "text-2xl md:text-3xl") +
                  " font-bold text-foreground mt-6 mb-2"
                }
              >
                {classData.title}
              </h1>
              <p
                className={
                  (isLargeMode ? "text-lg md:text-xl" : "text-base") +
                  " text-muted-foreground"
                }
              >
                {classData.description}
              </p>
            </div>

            {/* 클래스 상세 정보 */}
            <div className="mt-8">
              <h2
                className={
                  (isLargeMode ? "text-2xl md:text-3xl" : "text-xl") +
                  " font-semibold mb-4"
                }
              >
                클래스 상세 정보
              </h2>

              <ul className="space-y-3 text-sm md:text-base text-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>위치</span>
                  <span className="ml-2 text-muted-foreground">
                    {classData.location}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>날짜/시간</span>
                  <span className="ml-2 text-muted-foreground">
                    {dateLabel} {startLabel} ~ {endLabel}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>수업 시간</span>
                  <span className="ml-2 text-muted-foreground">
                    {durationHours}시간
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>정원</span>
                  <span className="ml-2 text-muted-foreground">
                    {capacity}명
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 오른쪽: 가격 / 예약 카드 */}
          <aside>
            <div className="bg-card rounded-3xl shadow-lg p-6 md:p-8">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <div
                    className={
                      (isLargeMode ? "text-3xl md:text-4xl" : "text-2xl") +
                      " font-bold text-foreground"
                    }
                  >
                    {classData.price.toLocaleString()}원
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    1회 수강료
                  </p>
                </div>
              </div>

              {/* 예약 버튼 */}
              <button
                type="button"
                onClick={handleReserveClick}
                className="w-full bg-gradient-warm text-white font-semibold h-12 rounded-xl hover:opacity-90 transition-opacity"
              >
                예약하기
              </button>

              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>모집 인원</span>
                  <span>
                    {currentCount}/{capacity}명
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>수업 시간</span>
                  <span>{durationHours}시간</span>
                </div>
                <div className="flex justify-between">
                  <span>평점</span>
                  <span>⭐ {ratingLabel}</span>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  현재는 임시 정보입니다. DB / 로그인 연동 시 예약 정보와 함께
                  수정될 예정입니다.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ClassDetail;