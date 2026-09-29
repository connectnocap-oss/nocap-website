import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ContentContext, fetchContent, getToken } from "@/lib/content";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

export default function App() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site-content"], queryFn: fetchContent, staleTime: 30_000, retry: 1 });
  const [editMode, setEditMode] = useState(() => !!getToken());

  useEffect(() => {
    const onChange = () => setEditMode(!!getToken());
    window.addEventListener("nocap-auth-change", onChange);
    return () => window.removeEventListener("nocap-auth-change", onChange);
  }, []);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };
  if (isLoading && !data) return null;
  return (
    <ContentContext.Provider value={{ content: data ?? {}, refresh, editMode, setEditMode }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster />
    </ContentContext.Provider>
  );
}
