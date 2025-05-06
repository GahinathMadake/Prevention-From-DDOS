
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Eye, EyeOff } from "lucide-react" ;
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";


const Register = () => {
  const navigate = useNavigate();


  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");


  const [timeLeft, setTimeLeft] = useState(300); 

  // Timer effect
  useEffect(() => {
    if(timeLeft <= 0){
      setEmailSent(false);
    }

    if (!emailSent || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, emailSent]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };



  const otpSendHandler = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if(!email || !password || !name){
        alert("All fields are necessary!");
        return;
      }
  
      // Call backend API to send OTP
      const res = await axios.post(`${import.meta.env.VITE_BackendURL}/api/auth/send-otp`,
        {
          name, email, password
        }
      );
  
      if(res.data.success != true) {
        throw new Error(res.data.message || 'Failed to send OTP');
      }
      setEmailSent(true);
      setTimeLeft(300);
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message || 'Something went wrong';
        alert(message);
      } else if (err instanceof Error){
        alert(err.message || 'Something went wrong');
      } else {
        alert('Something went wrong');
      }
    }
  };
  
  // Updated handleSubmit for verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Verify OTP with backend
      const response = await axios.post(
        `${import.meta.env.VITE_BackendURL}/api/auth/verify-otp`,
        {
          email,
          name,
          password,
          code: verificationCode
        }
      );
  
      if (!response.data.success) {
        alert(response.data.message || 'Verification failed');
      }
  
      // If successful, redirect to login
      alert("User registered succeessfully! Please Login");
      navigate("/login");
    } catch (err) {
      alert('Verification failed');
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div className="flex rounded-sm flex-col">

        <Card className="w-full rounded-sm max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {emailSent ? "Verify Your Email" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-center">
              {emailSent 
                ? "Enter the verification code sent to your email" 
                : "Register to start using Platform"
              }
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {
                emailSent ?
                <div className="grid gap-6">
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Clock className="text-muted-foreground" size={18} />
                    <div
                      className={`text-center font-mono text-lg ${
                        timeLeft < 60 ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(timeLeft)}
                    </div>
                  </div>
      
                  <div className="grid gap-4 py-2">
                    <Label>Enter OTP<sup className="text-[red]">*</sup></Label>
                    <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                </div>
                :
                  <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </>


              }

            </CardContent>
            <CardFooter className="my-4 flex flex-col">
              {
                emailSent ?
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </Button>
                :
                <Button type="button" className="w-full" onClick={otpSendHandler}>
                  Send OTP
                </Button>
              }
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      {/* </div> */}
    </div>
  );
};

export default Register;
