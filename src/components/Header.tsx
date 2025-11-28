import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Calendar, Eye, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAccessibility } from "../contexts/AccessibilityContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" fill="white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">손재주 클래스</h1>
                        <p className="text-xs text-muted-foreground">부울경 세대연결 플랫폼</p>
                    </div>
                </div>

                <nav className="flex items-center gap-4">
                    <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => navigate("/")}>
                        클래스 찾기
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-foreground hover:text-primary"
                        onClick={() => navigate("/teachers")}
                    >
                        어르신 소개
                    </Button>

                    {/* 접근성 설정 */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-foreground hover:text-primary">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-2 py-1.5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                                        <Eye className="w-4 h-4" />
                                        <span>고대비 모드</span>
                                    </Label>
                                    <Switch
                                        id="high-contrast"
                                        checked={highContrast}
                                        onCheckedChange={toggleHighContrast}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="large-text" className="flex items-center gap-2 cursor-pointer">
                                        <Type className="w-4 h-4" />
                                        <span>큰 글씨 모드</span>
                                    </Label>
                                    <Switch
                                        id="large-text"
                                        checked={largeText}
                                        onCheckedChange={toggleLargeText}
                                    />
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user ? (
                        <>
                            <Button
                                variant="ghost"
                                className="text-foreground hover:text-primary"
                                onClick={() => navigate("/reservations")}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                예약 현황
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleSignOut}
                            >
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="bg-gradient-warm text-white hover:opacity-90 transition-opacity"
                            onClick={() => navigate("/auth")}
                        >
                            로그인
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
};
