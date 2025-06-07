import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginWithEmail, registerWithEmail, signInWithGoogle, signInWithApple } from "@/lib/auth";
import { biometricAuth } from "@/lib/biometric-auth";
import { useToast } from "@/hooks/use-toast";
import { Scan, KeyIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().min(1, "Display name is required"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkBiometric = async () => {
      const supported = await biometricAuth.isSupported();
      setBiometricSupported(supported);
      
      // Try conditional UI authentication
      if (supported && biometricAuth.isBiometricEnabled()) {
        try {
          const result = await biometricAuth.authenticateWithConditionalUI();
          if (result.success) {
            setLocation("/");
          }
        } catch (error) {
          console.log("Conditional authentication not available");
        }
      }
    };
    
    checkBiometric();
  }, [setLocation]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await loginWithEmail(data.email, data.password);
      
      // Prompt for Face ID setup after successful login
      if (biometricSupported && !biometricAuth.isBiometricEnabled()) {
        await biometricAuth.promptForBiometricSetup("user_id", data.email);
      }
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await biometricAuth.authenticateWithBiometric();
      if (result.success) {
        toast({
          title: "Success",
          description: "Authenticated with Face ID!",
        });
        setLocation("/");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Face ID authentication failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Face ID authentication not available",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      
      toast({
        title: "Success",
        description: "Signed in with Apple successfully!",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Apple", 
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await registerWithEmail(data.email, data.password, data.displayName);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2">Thoughtmarks</h1>
          <p className="text-gray-400">Bookmarks for your brain</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4" autoComplete="on">
                {/* OAuth Sign-in Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white hover:bg-gray-100 text-black font-medium border border-gray-300"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleAppleSignIn}
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium border border-gray-600"
                  >
                    <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                  </Button>
                </div>

                {/* Face ID Authentication Button */}
                {biometricSupported && biometricAuth.isBiometricEnabled() && (
                  <Button
                    type="button"
                    onClick={handleBiometricLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Sign in with Face ID
                  </Button>
                )}

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-800 px-2 text-gray-400">Or continue with email</span>
                  </div>
                </div>

                <div>
                  <Input
                    {...loginForm.register("email")}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...loginForm.register("password")}
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black font-medium"
                >
                  {loginForm.formState.isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4" autoComplete="on">
                {/* OAuth Sign-up Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white hover:bg-gray-100 text-black font-medium border border-gray-300"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleAppleSignIn}
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium border border-gray-600"
                  >
                    <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Sign up with Apple
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-800 px-2 text-gray-400">Or create account with email</span>
                  </div>
                </div>

                <div>
                  <Input
                    {...registerForm.register("displayName")}
                    type="text"
                    placeholder="Display Name"
                    autoComplete="name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {registerForm.formState.errors.displayName && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.displayName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...registerForm.register("email")}
                    type="email"
                    placeholder="Email"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...registerForm.register("password")}
                    type="password"
                    placeholder="Password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...registerForm.register("confirmPassword")}
                    type="password"
                    placeholder="Confirm Password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={registerForm.formState.isSubmitting}
                  className="w-full bg-[#C6D600] hover:bg-[#B5C100] text-black font-medium"
                >
                  {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#C6D600] hover:text-[#B5C100]"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Log in"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
