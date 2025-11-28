// src/pages/Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

import { login, signup } from "@/lib/api";

const Auth = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // 공통 로딩 상태
    const [loading, setLoading] = useState(false);

    // 로그인 폼 상태
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // 회원가입 폼 상태
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    // 백엔드에서 쓰는 값에 맞춰서 "YOUTH" | "SENIOR"
    const [signupRole, setSignupRole] = useState<"YOUTH" | "SENIOR">("YOUTH");

    // ----- 로그인 -----
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const res = await login({
                email: loginEmail,
                password: loginPassword,
            });

            toast({
                title: "로그인 성공",
                description: `${res.name}님, 환영합니다.`,
            });

            // 나중에: 전역 유저 상태 저장 + 토큰 저장 자리
            navigate("/");
        } catch (error: unknown) {
            const msg =
                error instanceof Error
                    ? error.message
                    : "이메일/비밀번호를 다시 확인해 주세요.";

            toast({
                title: "로그인 실패",
                description: msg,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // ----- 회원가입 -----
    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const res = await signup({
                name: signupName,
                email: signupEmail,
                password: signupPassword,
                role: signupRole, // "YOUTH" | "SENIOR"
            });

            toast({
                title: "회원가입 완료",
                description: `${res.name}님, 이제 로그인해 주세요.`,
            });

            // 회원가입 후 로그인 탭으로 이동하고 싶으면:
            // navigate("/auth");  // or Tabs 상태를 signin으로 바꾸는 로직
        } catch (error: unknown) {
            const msg =
                error instanceof Error
                    ? error.message
                    : "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.";

            toast({
                title: "회원가입 실패",
                description: msg,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 상단 로고 / 타이틀 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" fill="white" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">손재주 클래스</h1>
                    </div>
                    <p className="text-muted-foreground">부울경 세대연결 플랫폼</p>
                </div>

                {/* 탭: 로그인 / 회원가입 */}
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">로그인</TabsTrigger>
                        <TabsTrigger value="signup">회원가입</TabsTrigger>
                    </TabsList>

                    {/* 로그인 탭 */}
                    <TabsContent value="signin">
                        <Card>
                            <form onSubmit={handleLogin}>
                                <CardHeader>
                                    <CardTitle>로그인</CardTitle>
                                    <CardDescription>
                                        이메일과 비밀번호로 로그인하세요
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email">이메일</Label>
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">비밀번호</Label>
                                        <Input
                                            id="signin-password"
                                            type="password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-warm text-white"
                                        disabled={loading}
                                    >
                                        {loading ? "로그인 중..." : "로그인"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* 회원가입 탭 */}
                    <TabsContent value="signup">
                        <Card>
                            <form onSubmit={handleSignup}>
                                <CardHeader>
                                    <CardTitle>회원가입</CardTitle>
                                    <CardDescription>
                                        새 계정을 만들어 시작하세요
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">이름</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                            placeholder="홍길동"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">이메일</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">비밀번호</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">역할</Label>
                                        <select
                                            id="role"
                                            className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={signupRole}
                                            onChange={(e) =>
                                                setSignupRole(e.target.value as "YOUTH" | "SENIOR")
                                            }
                                        >
                                            {/* 값은 백엔드 enum 에 맞추고, 라벨만 한글로 보여주기 */}
                                            <option value="YOUTH">학생 (배우고 싶어요)</option>
                                            <option value="SENIOR">선생님 (가르치고 싶어요)</option>
                                        </select>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-warm text-white"
                                        disabled={loading}
                                    >
                                        {loading ? "가입 중..." : "회원가입"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="text-center mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        홈으로 돌아가기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
