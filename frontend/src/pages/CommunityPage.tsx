import DashboardLayout from "@/components/DashboardLayout";
import {CommunityChat} from "@/components/CommunityChat"; // Fixed: changed to default import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Shield, 
  Star,
  UserPlus,
  Activity,
  Award,
  Sparkles
} from "lucide-react";

const CommunityPage = () => {
  return (
    <DashboardLayout pageTitle="Community Support">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
            <Users className="w-4 h-4" />
            Wellness Community
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Support
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with others on similar wellness journeys. Share experiences, 
            support each other, and learn coping strategies in a safe environment.
          </p>
        </div>

        {/* Community Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">Active Members</p>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">100%</p>
                  <p className="text-sm text-gray-600">Support Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">24/7</p>
                  <p className="text-sm text-gray-600">Always Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Community Guidelines Card */}
        <Card className="bg-gradient-to-r from-teal-50/50 to-blue-50/50 border border-teal-200/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-teal-800">Safe Space Guidelines</CardTitle>
                <CardDescription>Creating a supportive environment for everyone</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Be Kind & Respectful</h4>
                  <p className="text-sm text-gray-600">Treat everyone with empathy and understanding</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Maintain Privacy</h4>
                  <p className="text-sm text-gray-600">Keep personal details confidential and secure</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Support Others</h4>
                  <p className="text-sm text-gray-600">Offer encouragement and share experiences</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Community Chat Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Community Chat</CardTitle>
                  <CardDescription>Connect with your wellness community in real-time</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CommunityChat />
          </CardContent>
        </Card>

        {/* Community Achievements */}
        <Card className="bg-gradient-to-r from-yellow-50/50 via-orange-50/50 to-pink-50/50 border border-yellow-100/50 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Award className="w-8 h-8 text-orange-600" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Community Impact
                </h3>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Together, our community has shared over 
                <span className="font-semibold text-orange-600"> 500 messages </span> 
                of support and encouragement, creating a positive impact on mental wellness journeys.
              </p>
              <div className="flex justify-center gap-8 text-sm text-gray-600 mt-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <span><strong>Many</strong> success stories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-600" />
                  <span><strong>4.9/5</strong> community rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  <span><strong>95%</strong> feel supported</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;