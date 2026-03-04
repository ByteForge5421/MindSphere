import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { PlantGrowthTracker } from "@/components/PlantGrowthTracker";
import MoodChart  from "@/components/MoodChart";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Calendar, ArrowRight, TrendingUp, Target, Sparkles, Clock, Brain } from "lucide-react";

interface DashboardStats {
  streakCount: number;
  totalCheckIns: number;
  lastCheckIn: string | null;
  currentMood: string | null;
  completedJournals: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    streakCount: 0,
    totalCheckIns: 0,
    lastCheckIn: null,
    currentMood: null,
    completedJournals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
    fetchAIInsight();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsight = async () => {
    try {
      const response = await api.get('/dashboard/ai-insight');
      setAiInsight(response.data.insight);
    } catch (error) {
      console.error('Failed to load AI insight:', error);
    }
  };

  const needsCheckIn = () => {
    if (!stats.lastCheckIn) return true;
    
    const lastCheckInDate = new Date(stats.lastCheckIn).setHours(0, 0, 0, 0);
    const todayDate = new Date().setHours(0, 0, 0, 0);
    
    return lastCheckInDate < todayDate;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const name = user?.name?.split(' ')[0] || 'Friend';
    
    switch(timeOfDay) {
      case 'morning': return `Good morning, ${name}! ☀️`;
      case 'afternoon': return `Good afternoon, ${name}! 🌤️`;
      case 'evening': return `Good evening, ${name}! 🌙`;
      default: return `Hello, ${name}! 👋`;
    }
  };

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Enhanced Welcome Section with Gradient */}
        <section>
          <div className="relative overflow-hidden bg-gradient-to-br from-wellness-green/20 via-wellness-blue/10 to-wellness-teal/15 p-8 rounded-2xl border border-wellness-green/20 shadow-sm">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-wellness-yellow/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-wellness-blue/20 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative md:flex md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-wellness-green-dark to-wellness-blue-dark bg-clip-text text-transparent">
                  {getGreeting()}
                </h2>
                <p className="text-gray-600 font-medium">
                  {needsCheckIn() ? "Ready for your daily wellness check-in?" : "You're all caught up for today!"}
                </p>
              </div>
              <div className="mt-6 md:mt-0 space-y-3 md:space-y-0 md:space-x-3 md:flex">
                <Button 
                  onClick={() => navigate('/check-in')}
                  className="w-full md:w-auto bg-gradient-to-r from-wellness-green to-wellness-green-dark hover:from-wellness-green-dark hover:to-wellness-green text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Daily Check-in
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Plant Growth and Stats Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plant Growth Card - Enhanced */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
              <PlantGrowthTracker />
            </div>
          </div>
          
          {/* Stats Grid - Modern Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Streak Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-wellness-blue/10 rounded-full blur-xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="h-8 w-8 text-wellness-blue-dark" />
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Streak</span>
                </div>
                <h3 className="text-lg font-semibold text-wellness-blue-dark mb-2">Max Streak</h3>
                <p className="text-4xl font-bold text-wellness-blue-dark mb-2">{stats.streakCount}</p>
                <p className="text-sm text-gray-600">
                  {stats.streakCount > 0 ? "🔥 Keep it going!" : "Start your journey today!"}
                </p>
              </div>
            </div>
            
            {/* Total Check-ins Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200/20 rounded-full blur-xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Target className="h-8 w-8 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Total</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Check-ins</h3>
                <p className="text-4xl font-bold text-purple-700 mb-2">{stats.totalCheckIns}</p>
                <p className="text-sm text-gray-600">
                  {stats.totalCheckIns > 5 ? "🎉 Amazing progress!" : "Building your routine"}
                </p>
              </div>
            </div>
            
            {/* Summary Status Card */}
            <div className="sm:col-span-2 group relative overflow-hidden bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-200/20 rounded-full blur-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-8 w-8 text-teal-600" />
                    <span className="text-xs font-medium text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
                      {stats.totalCheckIns >= 3 ? "Ready!" : `${3 - stats.totalCheckIns} more needed`}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-teal-700 mb-2">Weekly Summary</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {stats.totalCheckIns >= 3 
                      ? "🎊 Your personalized insights are ready to view!" 
                      : `Complete ${3 - stats.totalCheckIns} more check-ins to unlock your wellness summary`
                    }
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/history')}
                  className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Summaries
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Mood Chart Section */}
        <section>
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-wellness-blue to-wellness-green rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Mood Tracking</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/history')}
                  className="text-wellness-blue hover:bg-wellness-blue/10 hover:text-wellness-blue-dark transition-all duration-300 group"
                >
                  View Detailed History
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <MoodChart />
            </div>
          </div>
        </section>
        
        {/* NEW: AI Weekly Insight */}
        <section>
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <Brain className="text-indigo-600" />
              <CardTitle>AI Weekly Insight</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700">
                {aiInsight || "Analyzing your recent wellness data..."}
              </p>

              <Button
                variant="ghost"
                className="mt-4 text-indigo-600"
                onClick={() => navigate("/history")}
              >
                See Full Insights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;