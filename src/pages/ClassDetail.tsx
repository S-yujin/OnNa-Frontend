// src/pages/ClassDetail.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    fetchClassDetail,
    createReservation,
    OneDayClass,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { toast } from "sonner";
// 필요한 경우 Lucide-React에서 아이콘을 가져올 수 있습니다.
// import { MapPin, Calendar, Clock, Users } from "lucide-react"; 

/**
 * 클래스 상세 페이지 (두 번째 이미지 디자인 적용)
 */
const ClassDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const classId = Number(id);
    const enabled = !Number.isNaN(classId);

    // 🔹 클래스 상세 조회
    const { data, isLoading, isError } = useQuery<OneDayClass>({
        queryKey: ["classDetail", classId],
        queryFn: () => fetchClassDetail(classId),
        enabled,
    });

    // 🔹 예약 생성
    const mutation = useMutation({
        mutationFn: () =>
            createReservation({
                classId,
                headCount: 1, // TODO: 인원 선택 UI 붙이면 여기 값 변경
                userId: 1,    // TODO: 로그인 붙이면 실제 로그인 유저 ID로 교체
            }),
        onSuccess: () => {
            toast.success("예약이 완료되었습니다.");
        },
        onError: () => {
            toast.error("예약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        },
    });

    if (!enabled) {
        return <div className="p-10">잘못된 클래스 ID 입니다.</div>;
    }

    if (isLoading) return <div className="p-10">불러오는 중...</div>;
    if (isError || !data) return <div className="p-10">클래스를 불러오지 못했습니다.</div>;

    // 💡 디자인의 일관성을 위해 Header 컴포넌트는 그대로 사용합니다.
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-10">
                {/* 뒤로가기 버튼 스타일 수정 */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-8 text-base text-gray-600 hover:text-gray-800 font-medium"
                >
                    ← 목록으로 돌아가기
                </button>

                {/* 메인 레이아웃: 2:1 비율 그리드 */}
                <section className="grid gap-10 md:grid-cols-[2fr,1fr] items-start">
                    {/* 왼쪽: 클래스 상세 정보 */}
                    <div className="space-y-6">
                        {/* 1. 이미지 영역 (placeholder) */}
                        <div className="relative w-full h-96 bg-gray-100 rounded-xl flex items-start justify-end p-5 shadow-inner">
                            {/* 카테고리 태그 (버튼과 동일한 웜톤 색상 적용) */}
                            <div className="bg-[#f08c35] text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                                {data.category}
                            </div>
                            {/* 실제 이미지 로딩 코드는 여기에 추가됩니다. */}
                            <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-400">
                                🎨
                            </div>
                        </div>

                        {/* 2. 클래스 제목 및 설명 */}
                        <h1 className="text-3xl font-extrabold text-gray-900 mt-4">{data.title}</h1>
                        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line border-b pb-6 border-gray-100">
                            {data.description}
                        </p>

                        {/* 3. 부가 정보 (위치, 날짜/시간, 정원) - 아이콘 및 구조 수정 */}
                        <div className="mt-8 pt-6 space-y-4 text-base">
                            <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">클래스 상세 정보</h2>
                            
                            {/* 위치 */}
                            <div className="flex items-center space-x-4">
                                <span className="text-[#f08c35] font-bold w-28 flex items-center">📍 위치</span>
                                <span className="text-gray-800">{data.location}</span>
                            </div>

                            {/* 날짜/시간 */}
                            <div className="flex items-center space-x-4">
                                <span className="text-[#f08c35] font-bold w-28 flex items-center">🗓️ 날짜/시간</span>
                                {/* 요일 정보가 데이터에 없으므로 (토)는 생략합니다. */}
                                <span className="text-gray-800">{data.date} {data.startTime} ~ {data.endTime}</span>
                            </div>

                            {/* 수업 시간 (데이터가 없으므로 임의로 3시간 표기) */}
                            <div className="flex items-center space-x-4">
                                <span className="text-[#f08c35] font-bold w-28 flex items-center">🕒 수업 시간</span>
                                <span className="text-gray-800">3시간</span>
                            </div>

                            {/* 정원 */}
                            <div className="flex items-center space-x-4">
                                <span className="text-[#f08c35] font-bold w-28 flex items-center">🧑‍🤝‍🧑 정원</span>
                                <span className="text-gray-800">{data.capacity}명</span>
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 예약 박스 (Sticky 적용) */}
                    <aside className="sticky top-20 h-fit rounded-xl border border-gray-200 p-8 space-y-6 bg-white shadow-xl">
                        {/* 가격 정보 */}
                        <div className="text-4xl font-extrabold text-gray-900">
                            {data.price.toLocaleString()}원
                            <span className="text-base font-normal text-gray-500 ml-3">1회 수강료</span>
                        </div>

                        {/* 예약하기 버튼 (색상 및 스타일 수정) */}
                        <Button
                            className="w-full h-12 bg-[#f08c35] hover:bg-[#e07c25] text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow" 
                            size="lg"
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "예약 중..." : "예약하기"}
                        </Button>

                        {/* 예약 부가 정보 (모집 인원, 수업 시간, 평점) */}
                        <div className="space-y-4 text-base border-t pt-6 border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">모집 인원</span>
                                {/* 임의로 '5/'를 추가했습니다. 실제로는 예약된 인원 데이터가 필요합니다. */}
                                <span className="font-bold text-gray-800">5/{data.capacity}명</span> 
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">수업 시간</span>
                                {/* 임의로 '3시간'을 추가했습니다. 실제 수업 시간 길이 데이터가 필요합니다. */}
                                <span className="font-bold text-gray-800">3시간</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">평점</span>
                                {/* 임의로 '4.9'를 추가했습니다. 실제 평점 데이터가 필요합니다. */}
                                <span className="font-bold text-gray-800">⭐ 4.9</span>
                            </div>
                        </div>
                        
                        {/* 임시 예약 안내 메시지 */}
                         <p className="text-xs text-muted-foreground pt-4 border-t border-gray-100">
                            ⚠️ 현재는 인원 1명, userId=1로 임시 예약 요청을 보냅니다. <br />
                            DB / 로그인 연동 시 이 부분만 수정하면 됩니다.
                        </p>
                    </aside>
                </section>
            </main>
        </div>
    );
};

export default ClassDetail;