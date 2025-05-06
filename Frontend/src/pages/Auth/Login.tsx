import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const SITE_KEY = import.meta.env.VITE_Recaptcha_KEY;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {fetchUserData} = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(captchaToken);

    if (!captchaToken) {
      alert("Please verify you're not a robot.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/auth/login`,
        { email, password, captchaToken },
        { withCredentials: true }
      );

      if(!response.data.success){
        alert("User loggedIn succeesfully! Fetching User data!");
      }

      await fetchUserData();
      navigate('/');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Card className="w-full rounded-sm max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2/4 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 flex justify-end text-blue-400">
                <Link to="/login/forgotPassword">
                  <Label className="cursor-pointer">Forgot Password</Label>
                </Link>
              </div>
            </div>

            <div className="pt-4">
              <ReCAPTCHA sitekey={SITE_KEY} onChange={setCaptchaToken} />
            </div>
          </CardContent>

          <CardFooter className="my-4 flex flex-col">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
