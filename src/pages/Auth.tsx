"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Heart, Loader2, Eye, EyeOff, Phone, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { generateNotificationMessage } from "@/utils/notificationEngine";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log("Recaptcha resolved");
        }
      });
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;

    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      
      // Simulation for demo purposes since real SMS requires console setup
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const msg = generateNotificationMessage("OTP_CODE", { code: mockOtp });
      
      window.dispatchEvent(new CustomEvent("wellcare-notification", { 
        detail: { ...msg, type: "OTP_CODE" } 
      }));

      toast.success("OTP sent to your phone!", {
        description: "Check your notifications for the simulation code."
      });
      
      setOtpSent(true);
      // In real app: const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      // setVerificationId(confirmationResult);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    toast.success("Phone verified successfully!");
    // Simulation: In real app, use verificationId.confirm(otp)
    setTimeout(() => navigate("/"), 1000);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: name });
      await sendEmailVerification(newUser);

      await setDoc(doc(db, "profiles", newUser.uid), {
        personal: {
          fullName: name,
          phone: phone,
          email: email,
          dob: "",
          gender: "",
          address: ""
        },
        medical: {
          bloodGroup: "",
          allergies: "",
          chronicConditions: "",
          medications: ""
        },
        emergency: {
          contactName: "",
          relation: "",
          contactPhone: ""
        },
        createdAt: new Date().toISOString()
      });

      toast.success("Account created! Verification email sent.", {
        description: "Please check your inbox to verify your account."
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl hero-gradient mb-4 shadow-lg">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gradient">MedCare</h1>
          <p className="text-muted-foreground mt-2">Your health journey starts here</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl h-12">
            <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="animate-fade-in">
            <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Access your health dashboard</CardDescription>
                  </div>
                  <div className="flex gap-1 bg-muted p-1 rounded-lg">
                    <Button 
                      variant={authMethod === 'email' ? 'default' : 'ghost'} 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-md"
                      onClick={() => setAuthMethod('email')}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={authMethod === 'phone' ? 'default' : 'ghost'} 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-md"
                      onClick={() => setAuthMethod('phone')}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {authMethod === 'email' ? (
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" name="email" type="email" placeholder="name@example.com" required className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="login-password" 
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          required 
                          className="rounded-xl h-12 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full hero-gradient h-12 rounded-xl font-bold shadow-lg" type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login with Email
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={otpSent ? handleVerifyOtp : handlePhoneSignIn}>
                  <CardContent className="space-y-4">
                    {!otpSent ? (
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" required className="rounded-xl h-12 pl-10" />
                        </div>
                        <p className="text-[10px] text-muted-foreground px-1">We'll send a 6-digit code to verify your number.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input id="otp" name="otp" placeholder="Enter 6-digit code" required className="rounded-xl h-12 pl-10 tracking-[0.5em] font-bold text-center" maxLength={6} />
                        </div>
                        <Button variant="link" className="text-xs p-0 h-auto" onClick={() => setOtpSent(false)}>Change phone number</Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full hero-gradient h-12 rounded-xl font-bold shadow-lg" type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {otpSent ? "Verify & Login" : "Send OTP Code"}
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="animate-fade-in">
            <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join MedCare to manage your health services</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" name="name" placeholder="John Doe" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Mobile Number</Label>
                    <Input id="signup-phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="name@example.com" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="signup-password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        className="rounded-xl h-12 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full hero-gradient h-12 rounded-xl font-bold shadow-lg" type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;