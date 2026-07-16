import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { Loader2 } from "lucide-react";

type Props = { children: React.ReactNode };

export default function AdminRoute({ children }: Props) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Still loading profile (after login, setUser hasn't fired yet)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
