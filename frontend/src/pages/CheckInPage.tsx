import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Send, 
  Heart, 
  Zap, 
  Sparkles, 
  MessageCircle, 
  TrendingUp, 
  Brain, 
  Sun, 
  Moon, 
  Cloud,
  Star,
  Target
} from "lucide-react";

const CheckInPage = () => {
  const [moodScore, setMoodScore] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [textInput, setTextInput] = useState("");
  const [isSubmittingText, setIsSubmittingText] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch AI suggestions
  const fetchMoodSuggestions = async (userInput: string) => {
    const res = await api.post("/mood/suggestions", { userInput });
    return res.data.suggestions;
  };

  // Submit text check-in
  const submitTextCheckIn = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Text required",
        description: "Please enter some text about how you're feeling",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingText(true);

    try {
      // 1. Save check-in
      await api.post("/mood/check-in", {
        moodScore: moodScore,
        energyLevel: energyLevel,
        method: "text",
        text: textInput,
      });

      // 2. Fetch Gemini AI suggestions
      const result = await fetchMoodSuggestions(textInput);
      setSuggestions(result);

      toast({
        title: "Check-in recorded! ✨",
        description: "Your mood has been logged successfully. See your AI suggestions below!",
      });

    } catch (error) {
      console.error("Error with text check-in:", error);
      toast({
        title: "Error",
        description: "Failed to save your mood check-in",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingText(false);
    }
  };

  // Helper functions with enhanced descriptions
  const getMoodDescription = (score: number) => {
    if (score <= 2) return { text: "Feeling low", emoji: "😔", color: "text-red-500" };
    if (score <= 4) return { text: "A bit down", emoji: "😕", color: "text-orange-500" };
    if (score <= 6) return { text: "Neutral", emoji: "😐", color: "text-yellow-500" };
    if (score <= 8) return { text: "Pretty good", emoji: "😊", color: "text-green-500" };
    return { text: "Excellent", emoji: "😄", color: "text-emerald-500" };
  };

  const getEnergyDescription = (level: number) => {
    if (level <= 2) return { text: "Very low energy", emoji: "🔋", color: "text-red-500" };
    if (level <= 4) return { text: "Somewhat tired", emoji: "😴", color: "text-orange-500" };
    if (level <= 6) return { text: "Moderate energy", emoji: "⚡", color: "text-yellow-500" };
    if (level <= 8) return { text: "Energetic", emoji: "🚀", color: "text-green-500" };
    return { text: "Very high energy", emoji: "✨", color: "text-emerald-500" };
  };

  const getMoodGradient = (score: number) => {
    if (score <= 2) return "from-red-100 to-red-50";
    if (score <= 4) return "from-orange-100 to-orange-50";
    if (score <= 6) return "from-yellow-100 to-yellow-50";
    if (score <= 8) return "from-green-100 to-green-50";
    return "from-emerald-100 to-emerald-50";
  };

  const getEnergyGradient = (level: number) => {
    if (level <= 2) return "from-gray-100 to-gray-50";
    if (level <= 4) return "from-blue-100 to-blue-50";
    if (level <= 6) return "from-purple-100 to-purple-50";
    if (level <= 8) return "from-teal-100 to-teal-50";
    return "from-cyan-100 to-cyan-50";
  };

  const moodData = getMoodDescription(moodScore);
  const energyData = getEnergyDescription(energyLevel);

  return (
    <DashboardLayout pageTitle="Daily Check-in">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
            <Heart className="w-4 h-4" />
            Daily Wellness Check-in
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            How are you feeling 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              today?
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your emotions to track your mental well-being and receive personalized AI recommendations.
          </p>
        </div>

        {/* Main Check-in Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Express Yourself</CardTitle>
            <CardDescription className="text-base">
              Let's capture how you're feeling right now
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-8">
            {/* Enhanced Text Input Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-primary" />
                <label className="text-lg font-semibold text-gray-800">
                  Share your thoughts
                </label>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Today I feel... (describe your emotions, what happened, or what's on your mind)"
                  className="h-36 text-base resize-none border-2 border-gray-200 focus:border-primary/50 rounded-xl p-4 bg-white shadow-sm"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {textInput.length}/500
                </div>
              </div>
            </div>

            {/* Enhanced Mood & Energy Sliders */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mood Slider */}
              <div className={`p-6 rounded-2xl bg-gradient-to-br ${getMoodGradient(moodScore)} border border-gray-200/50`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <label className="text-lg font-semibold text-gray-800">
                        Mood Level
                      </label>
                      <p className="text-sm text-gray-600">Rate from 1-10</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">{moodScore}</div>
                    <div className="text-2xl">{moodData.emoji}</div>
                  </div>
                </div>
                
                <Slider
                  value={[moodScore]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setMoodScore(value[0])}
                  className="mb-3"
                />
                
                <div className={`text-center font-medium ${moodData.color}`}>
                  {moodData.text}
                </div>
              </div>

              {/* Energy Slider */}
              <div className={`p-6 rounded-2xl bg-gradient-to-br ${getEnergyGradient(energyLevel)} border border-gray-200/50`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Zap className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <label className="text-lg font-semibold text-gray-800">
                        Energy Level
                      </label>
                      <p className="text-sm text-gray-600">How energetic?</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">{energyLevel}</div>
                    <div className="text-2xl">{energyData.emoji}</div>
                  </div>
                </div>
                
                <Slider
                  value={[energyLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  className="mb-3"
                />
                
                <div className={`text-center font-medium ${energyData.color}`}>
                  {energyData.text}
                </div>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="text-center pt-4">
              <Button
                onClick={submitTextCheckIn}
                disabled={isSubmittingText || !textInput.trim()}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 px-12 py-3 text-lg"
              >
                {isSubmittingText ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing your feelings...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Submit Check-in & Get AI Insights
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              {textInput.trim() && (
                <p className="text-sm text-gray-500 mt-3">
                  ✨ AI will analyze your input and provide personalized recommendations
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced AI Suggestions Section */}
        {suggestions && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    AI Insights & Recommendations
                  </CardTitle>
                  <CardDescription className="text-base">
                    Personalized suggestions based on your check-in
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-gray-800">Recommendations for you:</span>
                </div>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                  {suggestions}
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Your Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Footer Info */}
        <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center gap-2 text-2xl mb-3">
                <span>🔒</span>
                <span>🤖</span>
                <span>📈</span>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your check-ins are <strong>private and secure</strong>. Our AI analyzes your patterns to provide personalized insights that help improve your mental well-being over time.
              </p>
              <div className="flex justify-center gap-6 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Track Progress</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CheckInPage;