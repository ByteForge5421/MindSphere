import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  BarChart,
  Brain,
  MusicIcon,
  Smile,
  Sparkles,
  Users,
  Heart,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout hideNavigation>
      {/* Enhanced Hero Section with Animated Background */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Enhanced Left Column: Text Content */}
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
              <Sparkles className="w-4 h-4" />
              Your Mental Wellness Companion
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Mood, 
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Understood.
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
              Transform your emotional well-being with AI-powered insights, personalized recommendations, and beautiful mood tracking.
            </p>
            
            {/* Enhanced Stats Bar */}
            <div className="flex justify-center md:justify-start gap-8 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">100+</div>
                <div className="text-sm text-muted-foreground">Check-ins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {user ? (
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" asChild>
                  <Link to="/dashboard">
                    <Brain className="mr-2 h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" asChild>
                    <Link to="/register">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300" asChild>
                    <Link to="/login">
                      <Users className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Right Column: Interactive Card */}
          <div className="flex justify-center md:justify-end">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-[3.2rem] blur-xl opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
              
              <div className="relative w-80 h-80 p-2 bg-gradient-to-br from-primary via-secondary to-accent rounded-[3rem] shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1">
                <div className="w-full h-full bg-background rounded-[2.6rem] flex flex-col items-center justify-center p-6 backdrop-blur">
                  {/* Floating Icons Animation */}
                  <div className="relative mb-6">
                    <div className="text-6xl mb-2 transform transition-transform duration-500 group-hover:scale-125">
                      🧠
                    </div>
                    <div className="absolute -top-2 -right-2 text-2xl animate-bounce delay-300">✨</div>
                    <div className="absolute -bottom-1 -left-2 text-xl animate-pulse delay-700">💭</div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Understand Yourself
                  </h2>
                  <p className="text-muted-foreground text-center mb-4">
                    AI-powered insights into your emotional patterns
                  </p>
                  
                  {/* Mini Features */}
                  <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                      <Heart className="w-3 h-3" />
                      Mood AI
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      Insights
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gradient-to-r from-transparent via-border to-transparent" />

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-6">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MindSphere</span> Transforms Lives
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your companion for better mental well-being, with AI-powered features designed to guide your growth and maintain emotional balance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Feature Cards */}
            <div className="group bg-card/80 backdrop-blur p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Smile className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Smart Check-ins</h3>
              <p className="text-muted-foreground leading-relaxed">
                Express yourself naturally through text. Our AI understands context, emotions, and provides meaningful insights from your daily reflections.
              </p>
            </div>

            <div className="group bg-card/80 backdrop-blur p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-secondary/20 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">Personalized AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover curated music, videos, articles, and activities perfectly matched to your current mood and emotional needs.
              </p>
            </div>

            <div className="group bg-card/80 backdrop-blur p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-accent/20 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">Visual Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful charts and patterns reveal your emotional journey, helping identify triggers, celebrate progress, and plan ahead.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <Shield className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-semibold">Privacy First</h4>
                <p className="text-sm text-muted-foreground">End-to-end encrypted</p>
              </div>
              <div className="space-y-2">
                <Brain className="w-8 h-8 text-secondary mx-auto" />
                <h4 className="font-semibold">AI Powered</h4>
                <p className="text-sm text-muted-foreground">Smart insights</p>
              </div>
              <div className="space-y-2">
                <Heart className="w-8 h-8 text-accent mx-auto" />
                <h4 className="font-semibold">Clinically Backed</h4>
                <p className="text-sm text-muted-foreground">Evidence-based</p>
              </div>
              <div className="space-y-2">
                <Users className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-semibold">Community</h4>
                <p className="text-sm text-muted-foreground">Support network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gradient-to-r from-transparent via-border to-transparent" />

      {/* Enhanced CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl p-12 md:p-16 rounded-3xl max-w-5xl mx-auto border border-border/50 shadow-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-8">
              <Heart className="w-4 h-4" />
              Start Your Journey Today
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Begin Your 
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}Wellness Journey
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Start your journey to better emotional well-being with MindSphere. Your path to improved emotional well-being starts with a single click.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {user ? (
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg px-8" asChild>
                  <Link to="/dashboard">
                    <Brain className="mr-2 h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg px-8" asChild>
                  <Link to="/register">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              ✨ No credit card required • 🔒 100% privacy guaranteed • 💝 Free plan available
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gradient-to-r from-transparent via-border to-transparent" />

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-muted/20 to-muted/40 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindSphere
            </h3>
            <p className="text-muted-foreground">Your mental wellness companion</p>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Made with love &copy; {new Date().getFullYear()} MindSphere (VSK). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;