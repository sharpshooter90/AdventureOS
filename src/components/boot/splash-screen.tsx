"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { playSound } from "@/utils/sound-utils";

interface SplashScreenProps {
  onVerified: (email: string) => void;
}

export function SplashScreen({ onVerified }: SplashScreenProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "welcome">("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("diskDrive");
    setStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      playSound("beep");

      // Move to next input
      if (value && index < 5) {
        const nextInput = document.querySelector<HTMLInputElement>(
          `#otp-${index + 1}`
        );
        nextInput?.focus();
      }

      // Check if OTP is complete
      if (index === 5 && value) {
        setTimeout(() => {
          playSound("diskDrive");
          setStep("welcome");
          localStorage.setItem("userEmail", email);
          setTimeout(() => {
            onVerified(email);
          }, 3000);
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000080] text-white font-pixel">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 pb-16">
        <div
          className="w-full max-w-md border-2 border-white"
          style={{
            boxShadow: "6px 6px 0 rgba(255, 255, 255, 0.5)",
          }}
        >
          <div className="bg-[#000080] p-1">
            <div className="border border-white bg-[#000080] p-4">
              <div className="mb-4 text-center">
                <h1 className="text-xl mb-2">System Configuration</h1>
                <div className="h-[2px] bg-white mb-4" />
              </div>

              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block">
                      Visitor Identification Required
                    </label>
                    <p className="text-sm text-gray-300 mb-4">
                      Enter your email to personalize your retro computing
                      experience. Your data will be stored in our secure 5.25"
                      floppy disk vault.
                    </p>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        playSound("beep");
                      }}
                      className="w-full bg-[#000080] border border-white text-white placeholder-gray-400 p-2 rounded-none focus:ring-1 focus:ring-white"
                      placeholder="operator@system.terminal"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-white text-[#000080] hover:bg-gray-200 px-4 py-1 rounded-none"
                    >
                      Initialize →
                    </Button>
                  </div>
                </form>
              )}

              {step === "otp" && (
                <div className="space-y-4">
                  <p className="text-sm">
                    Security Protocol Initiated
                    <br />
                    Verification code transmitted to:
                    <br />
                    <span className="text-yellow-300">{email}</span>
                  </p>
                  <div className="space-y-2">
                    <label className="block">Enter Access Code:</label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          className="w-10 h-10 text-center bg-[#000080] border border-white text-white rounded-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === "welcome" && (
                <div className="space-y-4 text-center">
                  <div className="text-xl animate-pulse">ACCESS GRANTED</div>
                  <div className="space-y-2">
                    <p>Welcome to the System, Commander</p>
                    <p className="text-sm text-yellow-300">
                      {email.includes("@") ? `[${email.split("@")[0]}]` : email}
                    </p>
                    <p className="text-sm mt-4">
                      Loading personal workspace configuration...
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 text-sm">
                <div className="h-[2px] bg-white mb-2" />
                <div className="flex justify-between text-xs">
                  <span>ESC - System Reset</span>
                  <span>BIOS v1.0.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar Footer */}
      <div className="border-t-2 border-white bg-[#000080] p-1">
        <div
          className="border border-white"
          style={{
            boxShadow: "3px 3px 0 rgba(255, 255, 255, 0.5)",
          }}
        >
          <div className="px-4 py-2 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span>
                STATUS: {step === "welcome" ? "VERIFIED" : "AWAITING INPUT"}
              </span>
              <span>
                STEP:{" "}
                {step === "email" ? "1/3" : step === "otp" ? "2/3" : "3/3"}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="animate-pulse">
                {step === "email"
                  ? "READY"
                  : step === "otp"
                  ? "VERIFYING"
                  : "LOADING"}
              </span>
              <span>{time.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
