import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Brain } from "lucide-react";

/**
 * OAuth Callback Page
 * Receives token + user data from backend OAuth redirect,
 * stores in localStorage, and redirects to dashboard.
 */
const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("OAuth login failed. Please try again.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
      return;
    }

    if (token) {
      const userData = {
        id: searchParams.get("userId") || "",
        name: searchParams.get("name") || "",
        email: searchParams.get("email") || "",
        role: searchParams.get("role") || "student",
        createdAt: new Date().toISOString(),
        provider: searchParams.get("provider") || "local",
      };

      handleOAuthLogin(token, userData);
      navigate("/dashboard", { replace: true });
    } else {
      setError("No authentication token received.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    }
  }, [searchParams, navigate, handleOAuthLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
          <Brain className="w-8 h-8 text-white" />
        </div>
        {error ? (
          <div>
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-muted-foreground text-sm mt-1">Redirecting to login...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Completing sign in...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
