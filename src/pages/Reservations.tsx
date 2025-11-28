// src/pages/Reservations.tsx (이 코드로 전체 교체하세요!)

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, MapPin } from "lucide-react";

// 예약 데이터 타입 정의
type ReservationType = {
    id: number;
    classId: number;
    userId: number;
    headCount: number;
    reservedAt: string;
};

// 클래스 데이터 타입 정의
type ClassInfo = {
    id: number;
    title: string;
    location: string;
    startTime: string; 
    endTime: string;   
    date: string;
};

// 클래스 ID -> 클래스 정보를 저장할 맵 타입
type ClassMap = { [key: number]: ClassInfo };

const Reservations = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<ReservationType[]>([]);
    const [classMap, setClassMap] = useState<ClassMap>({}); // 클래스 정보 저장 맵
    const [loading, setLoading] = useState(true);

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9090";
    const MOCK_USER_ID = 2;

    // 날짜/시간 포맷 함수
    const formatTimeLabel = (classInfo: ClassInfo) => {
        if (!classInfo.startTime || !classInfo.endTime) return "시간 정보 없음";
        const startTime = classInfo.startTime.slice(0, 5);
        const endTime = classInfo.endTime.slice(0, 5);
        return `${classInfo.date} ${startTime} ~ ${endTime}`;
    }

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // 1. 🚀 클래스 목록 전체를 불러와 맵으로 변환 (필수!)
                //    ⚠️ 백엔드에 GET /api/classes 엔드포인트가 반드시 존재해야 합니다.
                const classResponse = await axios.get(`${baseUrl}/api/classes`);
                const classes: ClassInfo[] = classResponse.data;
                
                const map: ClassMap = classes.reduce((acc, current) => {
                    acc[current.id] = current;
                    return acc;
                }, {} as ClassMap);
                
                setClassMap(map);

                // 2. 내 예약 목록 조회 (GET /api/reservations/my?userId=1)
                const reservationResponse = await axios.get(`${baseUrl}/api/reservations/my?userId=${MOCK_USER_ID}`);
                setReservations(reservationResponse.data);

            } catch (e) {
                console.error("데이터 로드 실패:", e);
                setReservations([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [baseUrl]);
    
    if (loading) {
        return (
            <div className="min-h-screen container mx-auto py-8 text-center text-muted-foreground">
                <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                내 예약 정보를 불러오는 중입니다...
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-8">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-sm text-muted-foreground mb-4 hover:underline"
            >
                ← 뒤로가기
            </button>

            <h1 className="text-2xl font-bold mb-6">내 예약 목록 ({reservations.length}개)</h1>
            
            {reservations.length === 0 ? (
                <div className="text-center py-12 border rounded-xl bg-muted/50">
                    <p className="text-lg text-muted-foreground">예약 내역이 없습니다. 지금 클래스를 예약해 보세요! 🥳</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservations.map((res) => {
                        const classInfo = classMap[res.classId]; 
                        
                        // 클래스 정보가 없으면 이 예약은 표시하지 않거나 오류 표시
                        if (!classInfo) {
                            return (
                                <div key={res.id} className="p-4 border rounded-xl shadow-sm bg-red-50 text-red-700">
                                    [오류] 예약 번호 {res.id}의 클래스 정보(ID: {res.classId})를 찾을 수 없습니다.
                                </div>
                            );
                        }

                        const timeLabel = formatTimeLabel(classInfo);

                        return (
                            <Link 
                                key={res.id} 
                                to={`/reservations/${res.id}`} 
                                className="block p-4 border rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-semibold text-xl mb-2">{classInfo.title}</div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{classInfo.location}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{timeLabel}</span>
                                    </p>
                                </div>
                                <div className="mt-3 text-sm text-right text-gray-600">
                                    <span className="font-medium text-gray-800">예약 완료</span> | 
                                    예약 번호: {res.id} | 인원: {res.headCount}명
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Reservations;