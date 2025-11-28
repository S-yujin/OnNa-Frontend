import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
    User,
    MapPin,
    Mail,
    BookOpen,
    Star,
    ArrowRight
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Class = Database["public"]["Tables"]["classes"]["Row"];

type TeacherWithClasses = Profile & {
    classes: Class[];
};

const Teachers = () => {
    const navigate = useNavigate();

    // 선생님 목록 조회 (클래스 정보 포함)
    const { data: teachers, isLoading } = useQuery({
        queryKey: ["teachers"],
        queryFn: async () => {
            // 선생님 역할의 프로필 조회
            const { data: teachersData, error: teachersError } = await supabase
                .from("profiles")
                .select("*")
                .eq("role", "teacher")
                .order("created_at", { ascending: false });

            if (teachersError) throw teachersError;
            if (!teachersData) return [];

            // 각 선생님이 개설한 클래스 조회
            const teachersWithClasses = await Promise.all(
                teachersData.map(async (teacher) => {
                    const { data: classesData } = await supabase
                        .from("classes")
                        .select("*")
                        .eq("teacher_id", teacher.id)
                        .order("created_at", { ascending: false });

                    return {
                        ...teacher,
                        classes: classesData || [],
                    };
                })
            );

            return teachersWithClasses as TeacherWithClasses[];
        },
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">어르신 선생님 소개</h1>
                    <p className="text-muted-foreground">
                        따뜻한 마음으로 특별한 기술을 전해주시는 어르신 선생님들을 만나보세요
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">로딩 중...</p>
                    </div>
                ) : teachers && teachers.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {teachers.map((teacher) => (
                            <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="w-20 h-20">
                                            {teacher.profile_image ? (
                                                <AvatarImage src={teacher.profile_image} alt={teacher.name} />
                                            ) : (
                                                <AvatarFallback className="bg-gradient-warm text-white text-2xl">
                                                    {teacher.name.charAt(0)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-1">{teacher.name} 선생님</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <User className="w-4 h-4" />
                                                <span>어르신 선생님</span>
                                            </div>
                                            {teacher.contact && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{teacher.contact}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {teacher.bio && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {teacher.bio}
                                        </p>
                                    )}

                                    {teacher.classes.length > 0 && (
                                        <div className="pt-4 border-t border-border">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BookOpen className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-semibold text-foreground">
                          개설한 클래스 ({teacher.classes.length}개)
                        </span>
                                            </div>
                                            <div className="space-y-2">
                                                {teacher.classes.slice(0, 3).map((classItem) => (
                                                    <div
                                                        key={classItem.id}
                                                        className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
                                                        onClick={() => navigate(`/classes/${classItem.id}`)}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-1">
                                                                    {classItem.title}
                                                                </h4>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {classItem.category}
                                                                    </Badge>
                                                                    <span className="text-primary font-semibold">
                                    {classItem.price.toLocaleString()}원
                                  </span>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                        </div>
                                                    </div>
                                                ))}
                                                {teacher.classes.length > 3 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full text-xs"
                                                        onClick={() => navigate("/", { state: { teacherId: teacher.id } })}
                                                    >
                                                        더 보기 ({teacher.classes.length - 3}개)
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {teacher.classes.length === 0 && (
                                        <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
                                            아직 개설한 클래스가 없습니다
                                        </div>
                                    )}

                                    {teacher.classes.length > 0 && (
                                        <Button
                                            className="w-full bg-gradient-warm text-white hover:opacity-90"
                                            onClick={() => navigate("/", { state: { teacherId: teacher.id } })}
                                        >
                                            모든 클래스 보기
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">등록된 어르신 선생님이 없습니다</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Teachers;
