import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { cmsApi } from "@/lib/cms";

const BackendLogin = () => {
  const navigate = useNavigate();
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: cmsApi.me,
    retry: false,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (meQuery.data?.authenticated) {
    return <Navigate to="/backend" replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await cmsApi.login(email, password);
      navigate("/backend", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-md border border-primary/20 bg-card/70 p-8 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Backend</p>
        <h1 className="font-display text-3xl mb-3">Admin Login</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Login to manage pages, posts, media, and settings.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</label>
            <div className="mt-2 flex items-center border border-border bg-background/70 focus-within:border-primary">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent px-4 py-3 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="px-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <p className="text-xs text-muted-foreground">
            Tip: if password is forgotten, a logged-in admin can change it in `Profile & Security`.
          </p>
          <button
            disabled={submitting}
            className="w-full bg-primary px-4 py-3 text-primary-foreground text-xs tracking-[0.25em] uppercase disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BackendLogin;
