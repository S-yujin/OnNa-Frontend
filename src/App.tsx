import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClassDetail from "./pages/ClassDetail";
import Reservations from "./pages/Reservations";
import Teachers from "./pages/Teachers";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
    const [backendMessage, setBackendMessage] = useState("");

    useEffect(() => {
        // .env에 VITE_API_BASE_URL=http://localhost:9090 넣어놨다고 가정
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9090";

        fetch(`${baseUrl}/api/hello`)
            .then((res) => res.text())
            .then((text) => setBackendMessage(text))
            .catch((err) => {
                console.error(err);
                setBackendMessage("백엔드 호출 실패");
            });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AccessibilityProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/classes/:id" element={<ClassDetail />} />
                            <Route path="/reservations" element={<Reservations />} />
                            <Route path="/teachers" element={<Teachers />} />
                            <Route path="/dashboard" element={<TeacherDashboard />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>

                        {/* 👇 백엔드 응답 표시용 뱃지 */}
                        <p
                            style={{
                                position: "fixed",
                                bottom: "8px",
                                right: "8px",
                                fontSize: "12px",
                                background: "rgba(0,0,0,0.6)",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                zIndex: 9999,
                            }}
                        >
                            백엔드: {backendMessage || "불러오는 중..."}
                        </p>
                    </BrowserRouter>
                </TooltipProvider>
            </AccessibilityProvider>
        </QueryClientProvider>
    );
};

export default App;
