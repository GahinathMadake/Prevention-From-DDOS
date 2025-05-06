import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Eye, EyeOff } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(300);

  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setOtpSent(false);
      setOtp("");
      alert("OTP expired, please try again!");
    }

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const sendOtpHandler = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    // Simulating OTP send
    setOtpSent(true);
    setTimeLeft(300);
    alert('Simulated OTP sent to ${email}');
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (timeLeft <= 0) {
      alert("OTP has expired. Please resend OTP.");
      return;
    }

    alert("Password reset successfully!");
    navigate("/login");
  };

  return (
    <form
      className={'border my-10 p-4 flex flex-col gap-6 max-w-md ${className}'}
      {...props}
      onSubmit={formSubmitHandler}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to reset your password.
        </p>
      </div>

      {!otpSent ? (
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label>Email<sup className="text-[red]">*</sup></Label>
            <Input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="button" onClick={sendOtpHandler} className="w-full">
            Send OTP
          </Button>
        </div>
      ) : (
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
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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

          <div className="grid gap-2">
            <Label>New Password<sup className="text-red-500">*</sup></Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Confirm Password<sup className="text-red-500">*</sup></Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Verify OTP & Reset Password
          </Button>
        </div>
      )}

      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}