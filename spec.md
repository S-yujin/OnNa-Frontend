# 💡 Lovable 프롬프트 문서 — 원데이 클래스 서비스 (부울경)

## 1. 서비스 목적

* **핵심 목표:** 부울경에 거주하는 어르신들이 가진 손재주로 청년들에게 원데이 클래스를 제공
* **사용자 가치:**

  * **어르신:** 자신의 기술을 공유하고 소득 창출, 지역사회 기여 및 보람 경험
  * **청년:** 특별하고 실용적인 원데이 클래스를 저렴하게 경험하며, 지역 어르신과 연결

---

## 2. 사용자 정의

### 어르신 (teacher)

* 연령대: 60~75세
* 디지털 친숙도: 카카오톡, 유튜브 사용 가능, 앱 설치/회원가입은 어려움
* 니즈: 손기술로 소득 창출
* 문제점: 수강생 모집이 어렵고 온라인 홍보에 익숙하지 않음
* 참여 동기: 기술을 지역사회에 나누고 보람을 느끼고 싶음

### 청년 (student)

* 연령대: 20~34세
* 디지털 친숙도: 앱 사용에 매우 익숙함
* 니즈: 지역 기반 원데이 클래스를 경험하고 싶음
* 문제점: 검색으로는 로컬 클래스 정보 찾기 어려움, 고퀄 클래스는 비용 부담
* 참여 동기: 저렴하게 실용적 기술 습득 + 지역 어르신과 연결 경험

---

## 3. 핵심 기능

1. **어르신 클래스 등록**

   * 손기술 기반 원데이 클래스를 등록하고 시간·장소·가격 설정
   * 사용자: 어르신 (teacher) 또는 담당 행정자

2. **클래스 검색 및 필터**

   * 지역/가격/기술 기준으로 클래스 탐색
   * 사용자: 청년 (student)

3. **예약 및 결제 시스템**

   * 청년이 클래스 예약 및 결제
   * 사용자: 청년 (student)

4. **어르신 프로필**

   * 경력, 사진, 기술 설명 제공
   * 사용자: 공통

5. **클래스 후기 작성 및 확인**

   * 수업 후 청년이 후기 작성 → 어르신 신뢰도 상승
   * 사용자: 공통

---

## 4. 데이터 모델 (Supabase 연동용)

### 1) Users 테이블

| 컬럼            | 타입                                | 설명                      |
| ------------- | --------------------------------- | ----------------------- |
| id            | UUID (PK)                         | 사용자 고유 ID               |
| name          | TEXT                              | 사용자 이름                  |
| role          | ENUM('teacher','student','admin') | 어르신=teacher, 청년=student |
| contact       | TEXT                              | 연락처                     |
| profile_image | TEXT                              | 프로필 이미지 URL             |

### 2) Classes 테이블

| 컬럼          | 타입                   | 설명                     |
| ----------- | -------------------- | ---------------------- |
| id          | UUID (PK)            | 클래스 고유 ID              |
| title       | TEXT                 | 클래스 이름                 |
| description | TEXT                 | 상세 설명                  |
| category    | TEXT                 | 기술 종류                  |
| location    | TEXT                 | 지역                     |
| price       | INT                  | 원 단위 가격                |
| schedule    | TIMESTAMP            | 수업 시간                  |
| teacher_id  | UUID (FK → Users.id) | 클래스 생성자 (role=teacher) |

### 3) Reservations 테이블

| 컬럼         | 타입                                      | 설명                    |
| ---------- | --------------------------------------- | --------------------- |
| id         | UUID (PK)                               | 예약 고유 ID              |
| class_id   | UUID (FK → Classes.id)                  | 예약한 클래스               |
| student_id | UUID (FK → Users.id)                    | 예약한 청년 (role=student) |
| status     | ENUM('reserved','canceled','completed') | 예약 상태                 |

### 4) Reviews 테이블

| 컬럼         | 타입                     | 설명                      |
| ---------- | ---------------------- | ----------------------- |
| id         | UUID (PK)              | 후기 고유 ID                |
| class_id   | UUID (FK → Classes.id) | 해당 클래스                  |
| student_id | UUID (FK → Users.id)   | 후기 작성 청년 (role=student) |
| rating     | INT (1~5)              | 평점                      |
| comment    | TEXT                   | 후기 내용                   |

---

## 5. Supabase 연동 포인트

* **Users** → 로그인/회원관리, role 기반 접근제어
* **Classes** → 클래스 CRUD, teacher_id 연결
* **Reservations** → 예약 상태 관리, student_id 연결
* **Reviews** → 후기 관리, class_id & student_id 연결
* RLS(Role-Level Security) 적용: teacher는 자신 클래스만 수정, student는 예약/후기 작성 가능
