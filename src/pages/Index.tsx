import { useEffect, useState } from "react";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ClassCard } from "@/components/ClassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchClasses, OneDayClass } from "@/lib/api";

// 카드 컴포넌트에 맞춘 타입 (백엔드 데이터 + 프론트에서 쓰는 필드)
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

const Index = () => {
    const [classes, setClasses] = useState<ClassCardData[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | "cooking" | "craft" | "art">("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 탭 → 백엔드 category 값 매핑
    const categoryMap: Record<typeof activeTab, string | undefined> = {
        all: undefined,
        cooking: "요리",
        craft: "공예",
        art: "예술",
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const backendClasses: OneDayClass[] = await fetchClasses({
                    // region은 아직 안 쓰니 undefined
                    category: categoryMap[activeTab],
                });

                const mapped: ClassCardData[] = backendClasses.map((c) => ({
                    id: String(c.id),
                    title: c.title,
                    description: c.description,
                    category: c.category,
                    location: c.location,
                    price: c.price,
                    // 백엔드에는 아직 없는 필드라 임시 값으로 채움
                    teacherName: "어르신 선생님",
                    rating: 4.8,
                }));

                setClasses(mapped);
            } catch (e) {
                console.error(e);
                setError("클래스 목록을 불러오지 못했어요.");
                setClasses([]); // 혹시 원하면 여기서 예전 mock 데이터로 fallback 가능
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <Hero />

            <section className="py-16 container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">인기 클래스</h2>
                        <p className="text-muted-foreground">
                            지금 가장 사랑받는 원데이 클래스
                        </p>
                    </div>
                </div>

                <Tabs
                    defaultValue="all"
                    value={activeTab}
                    onValueChange={(v) =>
                        setActiveTab(v as "all" | "cooking" | "craft" | "art")
                    }
                    className="mb-8"
                >
                    <TabsList className="bg-muted">
                        <TabsTrigger value="all">전체</TabsTrigger>
                        <TabsTrigger value="cooking">요리</TabsTrigger>
                        <TabsTrigger value="craft">공예</TabsTrigger>
                        <TabsTrigger value="art">예술</TabsTrigger>
                    </TabsList>

                    {/* 필요하면 탭별 다른 컨텐츠 넣을 수 있지만,
              지금은 같은 리스트를 필터만 바꿔서 보여주니까 내용은 하나만 둬도 됨 */}
                    <TabsContent value="all" />
                    <TabsContent value="cooking" />
                    <TabsContent value="craft" />
                    <TabsContent value="art" />
                </Tabs>

                {loading && (
                    <p className="text-center text-muted-foreground mb-4">
                        클래스 불러오는 중...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-500 mb-4">{error}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {classes.map((classItem) => (
                        <ClassCard key={classItem.id} {...classItem} />
                    ))}

                    {!loading && !error && classes.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground">
                            조건에 맞는 클래스가 아직 없어요.
                        </p>
                    )}
                </div>

                <div className="text-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-primary text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        더 많은 클래스 보기
                    </Button>
                </div>
            </section>

            <section className="py-16 bg-gradient-soft">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                어떻게 시작하나요?
                            </h2>
                            <p className="text-muted-foreground">
                                간단한 3단계로 특별한 배움을 시작하세요
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-warm flex items-center justify-center text-white text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-foreground">클래스 선택</h3>
                                <p className="text-muted-foreground">
                                    배우고 싶은 기술을 선택하고 어르신 선생님을 만나보세요
                                </p>
                            </div>

                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-warm flex items-center justify-center text-white text-2xl font-bold">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-foreground">간편 예약</h3>
                                <p className="text-muted-foreground">
                                    원하는 날짜와 시간을 선택하고 예약하세요
                                </p>
                            </div>

                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-warm flex items-center justify-center text-white text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-foreground">즐거운 수업</h3>
                                <p className="text-muted-foreground">
                                    따뜻한 이야기와 함께 특별한 기술을 배워가세요
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-border bg-card">
                <div className="container mx-auto px-4">
                    <div className="text-center text-muted-foreground">
                        <p className="mb-2">© 2024 손재주 클래스. All rights reserved.</p>
                        <p className="text-sm">부울경 세대연결 플랫폼</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;
