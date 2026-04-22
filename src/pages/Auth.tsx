import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({
          title: "تم إنشاء الحساب",
          description: "تواصل مع مسؤول الموقع لمنحك صلاحية المشرف.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "مرحباً بك" });
      }
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err.message ?? "حدث خطأ ما",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="container-page py-12 max-w-md">
        <div className="card-soft p-7">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="chip">لوحة المشرفين</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold">
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب مشرف"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            هذه الصفحة مخصصة لإدارة محتوى الموقع.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة السر</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>
            <Button type="submit" disabled={submitting} className="bg-gradient-warm">
              <LogIn className="h-4 w-4 ml-2" />
              {submitting ? "جارٍ..." : mode === "signin" ? "دخول" : "إنشاء حساب"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-center">
            {mode === "signin" ? (
              <button
                type="button"
                className="text-primary font-semibold"
                onClick={() => setMode("signup")}
              >
                لا تملك حساباً؟ أنشئ حساباً جديداً
              </button>
            ) : (
              <button
                type="button"
                className="text-primary font-semibold"
                onClick={() => setMode("signin")}
              >
                لديك حساب؟ سجّل الدخول
              </button>
            )}
          </div>

          <div className="mt-6 text-xs text-muted-foreground text-center">
            <Link to="/" className="hover:text-primary">العودة إلى الصفحة الرئيسية</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
