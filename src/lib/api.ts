// src/lib/api.ts

// --- 클래스(원데이 클래스) 타입 ---
export interface OneDayClass {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;       // "2025-12-05"
    startTime: string;  // "14:00:00"
    endTime: string;    // "16:00:00"
    capacity: number;
    price: number;
    hostId: number;

    // 👇 UI용 추가 필드 (백엔드에서 안 주면 undefined)
    currentCount?: number;  // 현재 예약 인원
    rating?: number;        // 평점
}

// --- 예약 타입 ---
export interface Reservation {
    id: number;
    classId: number;
    userId: number;
    headCount: number;
}

// ===== 인증 타입 =====
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    name: string;
    role: string; // "SENIOR" | "YOUTH"
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    role: "SENIOR" | "YOUTH";
}

// 백엔드 기본 주소 (.env 에서 오버라이드 가능)
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9090";

/* ============================
 *  클래스 관련 API
 * ============================*/

// 클래스 목록 조회: GET /api/classes
export async function fetchClasses(params?: {
    region?: string;
    category?: string;
}): Promise<OneDayClass[]> {
    const search = new URLSearchParams();
    if (params?.region) search.set("region", params.region);
    if (params?.category) search.set("category", params.category);

    const qs = search.toString();
    const url = qs
        ? `${BASE_URL}/api/classes?${qs}`
        : `${BASE_URL}/api/classes`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("클래스 목록 조회 실패");
    return res.json();
}

// 클래스 상세 조회: GET /api/classes/{id}
export async function fetchClassDetail(id: number): Promise<OneDayClass> {
    const res = await fetch(`${BASE_URL}/api/classes/${id}`);
    if (!res.ok) throw new Error("클래스 상세 조회 실패");
    return res.json();
}

// 예약 생성: POST /api/reservations
export async function createReservation(params: {
    classId: number;
    headCount: number;
    userId?: number; // 로그인 붙으면 실제 유저 ID 넣을 자리
}): Promise<Reservation> {
    const res = await fetch(`${BASE_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            classId: params.classId,
            headCount: params.headCount,
            userId: params.userId ?? 1, // 임시로 1번 유저
        }),
    });

    if (!res.ok) {
        throw new Error("예약 생성 실패");
    }
    return res.json();
}

/* ============================
 *  인증 API
 * ============================*/

// 로그인: POST /api/auth/login
export async function login(body: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error("로그인 실패");
    }
    return res.json();
}

// 회원가입: POST /api/auth/signup
export async function signup(body: SignupRequest): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error("회원가입 실패");
    }
    return res.json();
}
