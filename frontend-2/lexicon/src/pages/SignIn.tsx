import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";
import { endpoints, setAuthToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    try {
      const res = await endpoints.auth.login({ email, password });
  const token = res.token || (res as any).accessToken;
      if (token) setAuthToken(token);
  // Immediately hydrate global user from backend
  await refresh();
      // If user had onboarding saved locally (from pre-auth onboarding), sync it now
      try {
        const raw = localStorage.getItem("lexigrain:onboarding");
        if (raw) {
          const local = JSON.parse(raw);
          // Sanitize to server DTO shape and ensure required fields
          const payload = {
            goals: Array.isArray(local.goals) ? local.goals : [],
            skills: Array.isArray(local.skills) ? local.skills : [],
            dailyHours: typeof local.dailyHours === 'number' ? local.dailyHours : 1,
            schedulePreset: local.schedulePreset || local.preferredTime || 'Evening',
            daysOfWeek: Array.isArray(local.daysOfWeek) ? local.daysOfWeek : [],
            specificTime: typeof local.specificTime === 'string' ? local.specificTime : undefined,
            reminderEnabled: !!local.reminderEnabled,
            completedAt: typeof local.completedAt === 'string' ? local.completedAt : new Date().toISOString(),
          };
          try {
            await endpoints.onboarding.save(payload);
            // Verify persisted by reading back; retry once if empty
            const server = await endpoints.onboarding.get().catch(() => null);
            const empty = !server || (
              (!server.goals || server.goals.length === 0) &&
              (!server.skills || server.skills.length === 0) &&
              (!server.dailyHours || Number(server.dailyHours) <= 0)
            );
            if (empty) {
              // retry with minimal payload
              await endpoints.onboarding.save({
                goals: payload.goals,
                skills: payload.skills,
                dailyHours: payload.dailyHours,
                schedulePreset: payload.schedulePreset,
                daysOfWeek: payload.daysOfWeek,
                specificTime: payload.specificTime,
                reminderEnabled: payload.reminderEnabled,
                completedAt: payload.completedAt,
              });
            }
            // Keep local copy to support components that read onboarding from localStorage
            localStorage.setItem("lexigrain:onboarding", JSON.stringify(payload));
            toast.success("Onboarding synced to your account");
          } catch (err) {
            // keep local copy; surface a gentle hint
            toast.message("We’ll sync your onboarding once you’re online.");
          }
        }
      } catch {}
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.info("Google Sign In - Coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-bold text-2xl">
            L
          </div>
          <span className="font-heading font-bold text-3xl text-primary">Lexigrain</span>
        </Link>

        <Card className="shadow-medium animate-scale-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-heading font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover"
                size="lg"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              size="lg"
              onClick={handleGoogleSignIn}
            >
              <Chrome className="h-5 w-5" />
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-primary font-medium hover:underline">
                Sign up for free
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
