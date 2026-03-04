import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { Loader2, Save, User, Settings, Shield, Palette, Bell, Eye, Target } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  goalsAndInterests: string;
  notificationsEnabled: boolean;
  privacyLevel: "public" | "private" | "community";
  theme: "light" | "dark" | "system";
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    bio: "",
    goalsAndInterests: "",
    notificationsEnabled: true,
    privacyLevel: "community",
    theme: "light",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/profile');
      setProfile({
        ...profile,
        ...response.data,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Could not load your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleToggleChange = (checked: boolean) => {
    setProfile({
      ...profile,
      notificationsEnabled: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.put('/users/profile', profile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Could not update your profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Profile">
      <div className="space-y-8">
        {/* Enhanced Welcome Header */}
        <section>
          <div className="relative overflow-hidden bg-gradient-to-br from-wellness-green/20 via-wellness-blue/10 to-wellness-teal/15 p-8 rounded-2xl border border-wellness-green/20 shadow-sm">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-wellness-yellow/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-wellness-blue/20 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-wellness-green to-wellness-blue rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-wellness-green-dark to-wellness-blue-dark bg-clip-text text-transparent">
                    Profile Settings
                  </h2>
                  <p className="text-gray-600 font-medium mt-1">
                    Manage your account and personalize your experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-wellness-green mx-auto" />
                <p className="text-gray-600">Loading your profile...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Personal Information Card */}
                <div className="lg:col-span-2">
                  <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-wellness-blue/10 rounded-full blur-2xl"></div>
                    <CardHeader className="relative">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-wellness-blue to-wellness-blue-dark rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-wellness-blue-dark">Personal Information</CardTitle>
                          <CardDescription>
                            Manage your personal details and account information
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="border-blue-200 focus:border-wellness-blue focus:ring-wellness-blue/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
                          <Select 
                            value={profile.role} 
                            onValueChange={(value) => handleSelectChange("role", value)}
                          >
                            <SelectTrigger id="role" className="border-blue-200 focus:border-wellness-blue">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">🎓 Student</SelectItem>
                              <SelectItem value="professional">💼 Professional</SelectItem>
                              <SelectItem value="other">🌟 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Email address cannot be changed for security
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-700 font-medium">About You</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us a little about yourself..."
                          value={profile.bio}
                          onChange={handleChange}
                          className="min-h-[100px] border-blue-200 focus:border-wellness-blue focus:ring-wellness-blue/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goalsAndInterests" className="text-gray-700 font-medium flex items-center gap-2">
                          <Target className="w-4 h-4 text-wellness-green" />
                          Wellness Goals & Interests
                        </Label>
                        <Textarea
                          id="goalsAndInterests"
                          name="goalsAndInterests"
                          placeholder="What are your mental wellness goals and interests?"
                          value={profile.goalsAndInterests}
                          onChange={handleChange}
                          className="min-h-[100px] border-blue-200 focus:border-wellness-blue focus:ring-wellness-blue/20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Notification Settings */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full blur-xl"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-purple-700">Notifications</CardTitle>
                        <CardDescription>
                          Control how we communicate with you
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-purple-100">
                      <div className="space-y-1">
                        <Label htmlFor="notifications" className="text-gray-700 font-medium">Daily Reminders</Label>
                        <p className="text-sm text-gray-600">
                          Receive check-in reminders and wellness tips
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={profile.notificationsEnabled}
                        onCheckedChange={handleToggleChange}
                        className="data-[state=checked]:bg-purple-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy & Theme Settings */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-teal-50 to-green-50 border-teal-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-teal-200/20 rounded-full blur-xl"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-teal-700">Privacy & Appearance</CardTitle>
                        <CardDescription>
                          Customize your privacy and theme preferences
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="privacyLevel" className="text-gray-700 font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4 text-teal-600" />
                        Privacy Level
                      </Label>
                      <Select 
                        value={profile.privacyLevel} 
                        onValueChange={(value) => handleSelectChange("privacyLevel", value as "public" | "private" | "community")}
                      >
                        <SelectTrigger id="privacyLevel" className="border-teal-200 focus:border-teal-500">
                          <SelectValue placeholder="Select privacy level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">🌍 Public - Anyone can see my profile</SelectItem>
                          <SelectItem value="community">👥 Community - Only community members</SelectItem>
                          <SelectItem value="private">🔒 Private - Hide my profile from others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="text-gray-700 font-medium flex items-center gap-2">
                        <Palette className="w-4 h-4 text-teal-600" />
                        App Theme
                      </Label>
                      <Select 
                        value={profile.theme} 
                        onValueChange={(value) => handleSelectChange("theme", value as "light" | "dark" | "system")}
                      >
                        <SelectTrigger id="theme" className="border-teal-200 focus:border-teal-500">
                          <SelectValue placeholder="Select app theme" />
                        </SelectTrigger>
                        
                        <SelectContent>
                          <SelectItem value="light">☀️ Light</SelectItem>
                          <SelectItem value="dark">🌙 Dark</SelectItem>
                          <SelectItem value="system">⚡ System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button Card */}
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-r from-wellness-green/10 to-wellness-blue/10 border-wellness-green/30 shadow-sm">
                    <CardFooter className="p-6">
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm text-gray-600">
                          Changes are saved automatically and take effect immediately
                        </p>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-wellness-green to-wellness-green-dark hover:from-wellness-green-dark hover:to-wellness-green text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                          disabled={isSaving}
                          size="lg"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save All Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;