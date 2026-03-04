import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  Loader2, 
  Brain, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Shield,
  Heart,
  Users,
  Briefcase,
  MoreHorizontal,
  UserPlus,
  CheckCircle
} from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a password",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, text: "", color: "" };
    if (pass.length < 6) return { strength: 1, text: "Weak", color: "text-red-500" };
    if (pass.length < 10) return { strength: 2, text: "Good", color: "text-yellow-500" };
    return { strength: 3, text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                MindSphere
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Transform your mental wellness journey
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Join thousands on their wellness journey
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span>100% private and secure platform</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                <span>Personalized AI insights & recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-accent" />
                </div>
                <span>Track progress with beautiful visualizations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindSphere
            </h1>
            <p className="text-muted-foreground mt-1">Your mental wellness companion</p>
          </div>

          {/* Enhanced Registration Card */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
              <CardDescription className="text-base">
                Start your mental wellness journey today
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 px-8">
                {/* Enhanced Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:border-primary/50 rounded-xl bg-white shadow-sm transition-all duration-300 focus:shadow-md"
                  />
                </div>

                {/* Enhanced Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:border-primary/50 rounded-xl bg-white shadow-sm transition-all duration-300 focus:shadow-md"
                  />
                </div>

                {/* Enhanced Password Field with Strength Indicator */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:border-primary/50 rounded-xl bg-white shadow-sm transition-all duration-300 focus:shadow-md"
                  />
                  {password && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === 1 ? 'bg-red-500 w-1/3' :
                            passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                            passwordStrength.strength === 3 ? 'bg-green-500 w-full' : 'w-0'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Enhanced Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:border-primary/50 rounded-xl bg-white shadow-sm transition-all duration-300 focus:shadow-md"
                  />
                  {confirmPassword && password && (
                    <div className="flex items-center gap-2 mt-1">
                      {password === confirmPassword ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Passwords match
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500 text-xs">
                          Passwords don't match
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Role Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">I am a</Label>
                  <RadioGroup 
                    value={role}
                    onValueChange={setRole}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="student" id="student" className="peer sr-only" />
                      <Label 
                        htmlFor="student" 
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/30 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all duration-300"
                      >
                        <Users className="w-6 h-6" />
                        <span className="text-sm font-medium">Student</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
                      <Label 
                        htmlFor="professional" 
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-secondary/5 hover:border-secondary/30 peer-checked:bg-secondary/10 peer-checked:border-secondary peer-checked:text-secondary transition-all duration-300"
                      >
                        <Briefcase className="w-6 h-6" />
                        <span className="text-sm font-medium">Professional</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="other" id="other" className="peer sr-only" />
                      <Label 
                        htmlFor="other" 
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-accent/5 hover:border-accent/30 peer-checked:bg-accent/10 peer-checked:border-accent peer-checked:text-accent transition-all duration-300"
                      >
                        <MoreHorizontal className="w-6 h-6" />
                        <span className="text-sm font-medium">Other</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6 px-8 pb-8">
                {/* Enhanced Submit Button */}
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 py-3 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create My Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Enhanced Sign In Link */}
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <Link 
                      to="/login" 
                      className="font-semibold text-primary hover:text-primary/80 transition-colors duration-300 inline-flex items-center gap-1 group"
                    >
                      Sign in instead
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>Private</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Free Forever</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;