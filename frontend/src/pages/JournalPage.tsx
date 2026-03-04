import DashboardLayout from "@/components/DashboardLayout";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalList } from "@/components/JournalList";
import { 
  BookOpen, 
  Heart, 
  Brain, 
  Sparkles, 
  Star,
  TrendingUp,
  Shield
} from "lucide-react";

const JournalPage = () => {
  return (
    <DashboardLayout pageTitle="Mental Wellness Journal">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
            <BookOpen className="w-4 h-4" />
            Mental Wellness Journal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Your 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              thoughts matter
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Express your thoughts, process emotions, and track your mental health journey through mindful journaling.
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          <JournalEntry />
          <JournalList />
        </div>

        {/* Enhanced Footer Info */}
        <div className="bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/50 rounded-2xl p-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-2 text-2xl mb-3">
              <span>📝</span>
              <span>💭</span>
              <span>🌱</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <strong>Journaling benefits:</strong> Regular writing helps organize thoughts, reduce stress, and gain clarity. 
              Your entries are completely private and help track your emotional growth.
            </p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Private & Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>Mental Clarity</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Track Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JournalPage;