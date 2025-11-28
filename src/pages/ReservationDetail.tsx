// src/pages/ReservationDetail.tsx (최종 수정)

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Clock, Users, Calendar } from "lucide-react";

// 예약 데이터 타입 정의
type ReservationType = {
    id: number;
    classId: number;
    userId: number;
    headCount: number;
    reservedAt: string;
};

// 클래스 데이터 타입 정의 (백엔드 /api/classes/{id} 응답 구조에 맞춤)
type ClassInfo = {
    id: number;
    title: string;
    location: string;
    price: number;
    description: string;
    date: string;
    startTime: string; 
    endTime: string;   
    durationHours: number;
};

const ReservationDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    
    const [reservation, setReservation] = useState<ReservationType | null>(null);
    const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9090";

    useEffect(() => {
        if (!id) {
            setError("유효하지 않은 예약 번호입니다.");
            setLoading(false);
            return;
        }
        
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const resId = Number(id);
                
                // 1. 예약 정보 조회 (GET /api/reservations/{id})
                // ⚠️ 주의: 백엔드 ReservationController에 GET /api/reservations/{id} 엔드포인트가 필요합니다. 
                //    현재는 이 엔드포인트가 없으므로 임시로 /api/reservations/my 전체를 불러와 필터링합니다.
                // 🚀 임시 조치: 전체 예약 목록에서 해당 ID를 찾습니다.
                const allReservationsResponse = await axios.get<ReservationType[]>(`${baseUrl}/api/reservations/my?userId=1`);
                const resData = allReservationsResponse.data.find(r => r.id === resId);

                if (!resData) {
                    setError("예약 정보를 찾을 수 없습니다.");
                    setLoading(false);
                    return;
                }
                setReservation(resData);


                // 2. 🚀 클래스 상세 정보 조회 (GET /api/classes/{classId})
                const classResponse = await axios.get<ClassInfo>(`${baseUrl}/api/classes/${resData.classId}`);
                setClassInfo(classResponse.data);

            } catch (e) {
                console.error("데이터 로드 실패:", e);
                setError("예약 정보를 불러오는 데 실패했습니다. (클래스 API 확인 필요)");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, baseUrl]);

    if (loading) {
        return (
            <div className="min-h-screen container mx-auto py-8 text-center text-muted-foreground">
                <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                예약 상세 정보를 불러오는 중입니다...
            </div>
        );
    }
    
    if (error || !reservation || !classInfo) {
        return (
            <div className="container mx-auto py-8">
                <p className="text-center text-red-500">{error ?? "예약 정보를 찾을 수 없거나 클래스 정보가 누락되었습니다."}</p>
            </div>
        );
    }

    // 렌더링에 필요한 값 계산
    const timeLabel = `${classInfo.date} ${classInfo.startTime?.slice(0, 5)} ~ ${classInfo.endTime?.slice(0, 5)}`;
    const totalPrice = classInfo.price * reservation.headCount;

    return (
        <div className="container mx-auto py-8">
            <button
                type="button"
                onClick={() => navigate("/reservations")}
                className="text-sm text-muted-foreground mb-4 hover:underline"
            >
                ← 내 예약 목록으로 돌아가기
            </button>
            
            <h1 className="text-3xl font-bold mb-6">예약 상세 정보</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* 왼쪽: 클래스 정보 */}
                <section className="lg:col-span-2">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">{classInfo.title}</h2>
                        
                        <div className="space-y-4 text-base">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <span className="text-muted-foreground">일시</span>
                                <span className="font-medium">{timeLabel}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                <span className="text-muted-foreground">장소</span>
                                <span className="font-medium">{classInfo.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground" />
                                <span className="text-muted-foreground">총 수업 시간</span>
                                <span className="font-medium">{classInfo.durationHours}시간</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-muted-foreground" />
                                <span className="text-muted-foreground">예약 인원</span>
                                <span className="font-bold text-red-600">{reservation.headCount}명</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {classInfo.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 오른쪽: 결제 정보 */}
                <aside>
                    <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xl border border-primary-light">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">결제 정보</h2>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">예약 번호</span>
                                <span className="font-semibold text-primary">{reservation.id}</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">클래스당 금액</span>
                                <span>{classInfo.price.toLocaleString()}원</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">예약 인원</span>
                                <span>{reservation.headCount}명</span>
                            </li>
                            <li className="flex justify-between pt-4">
                                <span className="text-xl font-extrabold">총 결제 금액</span>
                                <span className="text-xl font-extrabold text-red-600">
                                    {totalPrice.toLocaleString()}원
                                </span>
                            </li>
                        </ul>
                        <p className="mt-6 text-xs text-muted-foreground text-center">
                            예약 생성 시각: {new Date(reservation.reservedAt).toLocaleString('ko-KR')}
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ReservationDetail;