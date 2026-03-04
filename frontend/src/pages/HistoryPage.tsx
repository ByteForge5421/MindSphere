import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MoodChart from "@/components/MoodChart"; // Fixed: changed from named import to default import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Calendar, 
  Target,
  Zap,
  Heart,
  Clock,
  Star,
  Brain,
  Award
} from "lucide-react";

const HistoryPage = () => {
  return (
    <DashboardLayout pageTitle="Wellness Journey">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
            <BarChart3 className="w-4 h-4" />
            Wellness Analytics
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Your 
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              wellness journey
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your mood patterns and emotional wellbeing over time to gain insights into your mental health journey.
          </p>
        </div>
        
        {/* Main Chart Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Mood History Analytics</CardTitle>
            <CardDescription className="text-base">
              Visualize your emotional patterns and track progress over time
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <div className="space-y-8">
              {/* Enhanced Chart with Better Labels */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">📊 Mood & Energy Tracking</h3>
                      <p className="text-sm text-gray-600">Last 14 days • Higher scores indicate better wellbeing</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">Mood (1-10 scale)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">Energy (1-10 scale)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <MoodChart />
                </div>
              </div>
              
              {/* Enhanced Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Moods Card */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg text-green-800">Top Moods</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Calm</span>
                        </div>
                        <span className="text-sm font-semibold text-green-700">32%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: '32%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">Happy</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">27%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '27%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium">Anxious</span>
                        </div>
                        <span className="text-sm font-semibold text-yellow-700">18%</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full transition-all duration-300" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Energy Patterns Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-200/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg text-blue-800">Energy Patterns</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">Morning</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">6.2/10</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '62%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">Afternoon</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">7.1/10</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '71%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">Evening</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">5.4/10</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '54%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Averages Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg text-purple-800">Key Metrics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Mood Score</span>
                          </div>
                          <span className="text-sm font-bold text-purple-700">6.8/10</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Energy Level</span>
                          </div>
                          <span className="text-sm font-bold text-purple-700">6.2/10</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium">Check-in Rate</span>
                          </div>
                          <span className="text-sm font-bold text-purple-700">85%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary Card */}
        <Card className="bg-gradient-to-r from-blue-50/50 via-green-50/50 to-purple-50/50 border border-blue-100/50 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-3 text-3xl mb-4">
                <span>📈</span>
                <span>🎯</span>
                <span>💪</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <Award className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Great Progress!
                </h3>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                You've been consistently tracking your wellness journey. Your average mood score has improved by 
                <span className="font-semibold text-green-600"> +12% </span> 
                over the past month, showing positive growth in your mental wellbeing.
              </p>
              <div className="flex justify-center gap-8 text-sm text-gray-600 mt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span><strong>28 days</strong> tracked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-green-600" />
                  <span><strong>24 entries</strong> recorded</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span><strong>18 insights</strong> generated</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;