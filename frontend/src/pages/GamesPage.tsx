import DashboardLayout from "@/components/DashboardLayout";
import { BreathingGame } from "@/components/games/BreathingGame";

const GamesPage = () => {
  return (
    <DashboardLayout pageTitle="Stress Relief Games">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-wellness-green-light to-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-wellness-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m5 6h1a3 3 0 000-6h-1m-7 6h7a7 7 0 11-7 7H3v-4z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-wellness-green-dark to-blue-600 bg-clip-text text-transparent mb-3">
              Mini-Games for Stress Relief
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Take a mindful break and reduce stress with our simple wellness game. 
              <br />
              <span className="text-wellness-green-dark font-medium">Playing helps improve focus and emotional balance.</span>
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Reduce Stress</h3>
              <p className="text-sm text-gray-600">Lower cortisol levels naturally</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-green-100 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-wellness-green-light rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-wellness-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Improve Focus</h3>
              <p className="text-sm text-gray-600">Enhance mental clarity & attention</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Boost Mood</h3>
              <p className="text-sm text-gray-600">Release feel-good hormones</p>
            </div>
          </div>

          {/* Game Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-wellness-green-light/50 to-blue-100/50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">🌬️ Breathing Exercise Game</h3>
              <p className="text-sm text-gray-600 mt-1">Follow the guided breathing pattern to relax your mind</p>
            </div>
            
            <div className="p-6">
              <BreathingGame onComplete={() => {}} />
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-wellness-green-light/30 to-blue-100/30 rounded-2xl p-6 border border-wellness-green-light/50">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 text-wellness-green-dark mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Tips for Best Results
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-wellness-green-dark rounded-full mt-2 flex-shrink-0"></div>
                <span>Find a quiet, comfortable space</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-wellness-green-dark rounded-full mt-2 flex-shrink-0"></div>
                <span>Play for 3-5 minutes daily</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-wellness-green-dark rounded-full mt-2 flex-shrink-0"></div>
                <span>Focus on your breath rhythm</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-wellness-green-dark rounded-full mt-2 flex-shrink-0"></div>
                <span>Use headphones for better experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GamesPage;