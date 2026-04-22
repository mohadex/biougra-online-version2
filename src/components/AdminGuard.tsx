import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="container-page py-20 text-center text-muted-foreground">
          جارٍ التحقق...
        </div>
      </Layout>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container-page py-20 text-center">
          <h1 className="font-display text-2xl font-bold">لا تملك صلاحية الوصول</h1>
          <p className="mt-2 text-muted-foreground">
            هذه الصفحة محجوزة للمشرفين فقط.
          </p>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
