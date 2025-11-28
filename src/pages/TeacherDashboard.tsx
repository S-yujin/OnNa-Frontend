import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    Sparkles,
    Upload,
    FileText,
    Loader2,
    CheckCircle,
    BookOpen
} from "lucide-react";

// Mock AI 응답 데이터
const mockAIResponse = {
    summary: `이 강의는 전통 김치 담그기 방법을 단계별로 설명하는 실용적인 클래스입니다. 

주요 내용:
1. 배추 준비 및 소금 절이기
2. 양념 만들기 (고춧가루, 마늘, 생강, 젓갈 등)
3. 김치 담그기 및 발효 과정
4. 보관 방법 및 맛 내는 비법

50년 경력의 선생님께서 직접 알려주시는 정통 방식으로, 초보자도 쉽게 따라할 수 있도록 친절하게 설명합니다.`,
    keywords: ["김치", "전통 음식", "발효", "한식", "요리"],
    estimatedDuration: "3시간",
    difficulty: "초급",
};

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [textInput, setTextInput] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<typeof mockAIResponse | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // 선생님 역할 확인
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (profile?.role !== "teacher") {
                    toast({
                        title: "접근 권한 없음",
                        description: "선생님만 접근할 수 있는 페이지입니다.",
                        variant: "destructive",
                    });
                    navigate("/");
                }
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [navigate, toast]);

    // 선생님의 클래스 목록 조회
    const { data: classes } = useQuery({
        queryKey: ["teacher-classes", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            const { data, error } = await supabase
                .from("classes")
                .select("*")
                .eq("teacher_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data || [];
        },
        enabled: !!user?.id,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith("audio/")) {
                setAudioFile(file);
                toast({
                    title: "파일 선택됨",
                    description: `${file.name} 파일이 선택되었습니다.`,
                });
            } else {
                toast({
                    title: "잘못된 파일 형식",
                    description: "오디오 파일만 업로드할 수 있습니다.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleAnalyze = async () => {
        if (!textInput.trim() && !audioFile) {
            toast({
                title: "입력 필요",
                description: "텍스트를 입력하거나 오디오 파일을 업로드해주세요.",
                variant: "destructive",
            });
            return;
        }

        setIsAnalyzing(true);
        setAiResult(null);

        // Mock AI 분석 시뮬레이션 (2-3초 대기)
        await new Promise((resolve) => setTimeout(resolve, 2500));

        setIsAnalyzing(false);
        setAiResult(mockAIResponse);

        toast({
            title: "AI 분석 완료!",
            description: "강의 내용이 성공적으로 분석되었습니다.",
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">로그인이 필요합니다</h1>
                    <Button onClick={() => navigate("/auth")}>로그인하기</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">강사 대시보드</h1>
                    <p className="text-muted-foreground">
                        AI를 활용하여 강의 콘텐츠를 자동으로 생성하고 관리하세요
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* AI 콘텐츠 등록 */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <CardTitle>AI 콘텐츠 등록</CardTitle>
                                </div>
                                <CardDescription>
                                    구술 내용을 입력하거나 음성 파일을 업로드하여 AI로 강의 요약을 생성하세요
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="text-input">구술 내용 입력</Label>
                                    <Textarea
                                        id="text-input"
                                        placeholder="강의 내용을 자유롭게 입력해주세요..."
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        className="min-h-[200px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="audio-upload">또는 음성 파일 업로드</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="audio-upload"
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleFileChange}
                                            className="flex-1"
                                        />
                                        {audioFile && (
                                            <Badge variant="outline" className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                {audioFile.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {isAnalyzing && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            AI가 내용을 분석하고 있습니다...
                                        </div>
                                        <Progress value={66} className="h-2" />
                                    </div>
                                )}

                                <Button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || (!textInput.trim() && !audioFile)}
                                    className="w-full bg-gradient-warm text-white"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            AI 분석 중...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            AI 분석 요청
                                        </>
                                    )}
                                </Button>

                                {aiResult && (
                                    <Card className="border-primary">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <CardTitle>AI 분석 결과</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-semibold">강의 요약</Label>
                                                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                                                    {aiResult.summary}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-semibold">키워드</Label>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {aiResult.keywords.map((keyword, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {keyword}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                                <div>
                                                    <Label className="text-sm font-semibold">예상 소요 시간</Label>
                                                    <p className="text-sm text-muted-foreground">{aiResult.estimatedDuration}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-semibold">난이도</Label>
                                                    <p className="text-sm text-muted-foreground">{aiResult.difficulty}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* 내 클래스 목록 */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <CardTitle>내 클래스</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {classes && classes.length > 0 ? (
                                    <div className="space-y-2">
                                        {classes.map((classItem) => (
                                            <Button
                                                key={classItem.id}
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => navigate(`/classes/${classItem.id}`)}
                                            >
                                                {classItem.title}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">등록된 클래스가 없습니다</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

