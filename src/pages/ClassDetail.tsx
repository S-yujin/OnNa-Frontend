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

/**
 * 클래스 상세 페이지
 *
 * - GET /api/classes/{id} 로 상세 정보 가져오기
 * - "예약하기" 버튼 클릭 시 POST /api/reservations 호출
 *
 * ✅ 나중에 DB / 로그인 붙을 때 바꿀 자리들에는 주석으로 메모 달아둠
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
        return <div>잘못된 클래스 ID 입니다.</div>;
    }

    if (isLoading) return <div>불러오는 중...</div>;
    if (isError || !data) return <div>클래스를 불러오지 못했습니다.</div>;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-10">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-4 text-sm text-muted-foreground"
                >
                    ← 뒤로가기
                </button>

                <section className="grid gap-10 md:grid-cols-[2fr,1fr]">
                    {/* 왼쪽: 클래스 정보 */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <p className="text-muted-foreground">{data.description}</p>

                        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                            <div>카테고리: {data.category}</div>
                            <div>위치: {data.location}</div>
                            <div>
                                날짜: {data.date} / 시간: {data.startTime} ~ {data.endTime}
                            </div>
                            <div>정원: {data.capacity}명</div>
                        </div>
                    </div>

                    {/* 오른쪽: 예약 박스 */}
                    <aside className="rounded-xl border border-border p-6 space-y-4 bg-card shadow-sm">
                        <div className="text-2xl font-bold">
                            {data.price.toLocaleString()}원
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "예약 중..." : "예약하기"}
                        </Button>

                        <p className="text-xs text-muted-foreground">
                            지금은 임시로 인원 1명, userId=1로 예약 요청을 보냅니다.
                            <br />
                            나중에 DB / 로그인 연동 시 이 부분만 수정하면 됩니다.
                            <br />
                            글도 나중에 수정해
                        </p>
                    </aside>
                </section>
            </main>
        </div>
    );
};

export default ClassDetail;
