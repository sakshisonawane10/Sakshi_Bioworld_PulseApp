
import React from 'react';
import { Compass, Zap, ShieldCheck, ArrowRight, Globe, BarChart3, TrendingUp, Activity, Clock, Shield } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-blue-500/20">P</div>
          <span className="text-xl font-black tracking-tighter">BIOWORLD <span className="text-blue-500">PULSE</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Platform</a>
          <a href="#" className="hover:text-white transition-colors">Insights</a>
        </div>
        <button 
          onClick={onStart}
          className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-blue-500 hover:text-white transition-all shadow-xl"
        >
          Enter Platform
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 animate-bounce">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Next-Gen Demand Sensing</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          PREDICT THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">MOMENTUM.</span><br />
          OWN THE TREND.
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          BioWorld Pulse is the industry's first real-time demand sensing engine designed for licensed merchandise. We turn cultural signals into actionable sourcing decisions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={onStart}
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-2xl shadow-blue-500/40"
          >
            Launch Dashboards <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white rounded-2xl font-bold text-lg transition-all">
            Watch Technical Demo
          </button>
        </div>

        {/* Dashboard UI Preview (The "Mockup") */}
        <div className="relative w-full max-w-5xl group perspective-1000">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02] group-hover:-rotate-1">
            {/* Mock Dashboard UI */}
            <div className="flex h-[500px]">
              {/* Mock Sidebar */}
              <div className="w-16 border-r border-gray-800 flex flex-col items-center py-6 gap-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                <Activity className="w-5 h-5 text-gray-600" />
                <Compass className="w-5 h-5 text-gray-600" />
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
              {/* Mock Content */}
              <div className="flex-1 p-8 text-left">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <div className="w-32 h-4 bg-gray-800 rounded-full mb-3" />
                    <div className="w-64 h-10 bg-gray-700 rounded-xl" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 h-10 bg-gray-800 rounded-xl" />
                    <div className="w-24 h-10 bg-blue-600 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800">
                      <div className="w-20 h-3 bg-gray-700 rounded-full mb-4" />
                      <div className="w-32 h-8 bg-white/10 rounded-xl" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-8">
                  <div className="flex-1 bg-gray-800/30 rounded-2xl p-6 border border-gray-800 h-40 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/10 to-transparent" />
                    <svg className="absolute bottom-0 left-0 w-full h-24" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0 80 Q 25 20, 50 60 T 100 10" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="w-1/3 space-y-4">
                    <div className="h-10 bg-gray-800 rounded-xl w-full" />
                    <div className="h-10 bg-gray-800 rounded-xl w-3/4" />
                    <div className="h-10 bg-gray-800 rounded-xl w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Badges */}
          <div className="absolute -top-10 -right-10 bg-blue-600 p-6 rounded-2xl shadow-2xl animate-bounce hidden lg:block">
            <TrendingUp className="w-8 h-8 text-white" />
            <p className="text-white text-xs font-black mt-2">TREND DETECTED</p>
            <p className="text-blue-100 text-[10px] font-bold">Confidence: 98%</p>
          </div>
          <div className="absolute -bottom-10 -left-10 bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl hidden lg:block">
            <Shield className="w-8 h-8 text-emerald-500" />
            <p className="text-white text-xs font-black mt-2">SECURE SYNC</p>
            <p className="text-gray-400 text-[10px] font-bold">Real-time Grounding</p>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 bg-gray-950/50 py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-400" />}
              title="Global Sensing"
              description="Analyze search patterns, news beats, and social velocity across 40+ markets simultaneously."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
              title="AI Confidence"
              description="Eliminate guesswork with our confidence scoring system calibrated against 10 years of licensing data."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
              title="Impact Prediction"
              description="Visualize the projected ROI of every action before you commit a single dollar of capital."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center">
        <p className="text-gray-500 text-sm font-medium">© 2025 BioWorld Merchandising. All rights reserved. Built for AP & Licensing Teams.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 bg-gray-900/40 border border-white/5 rounded-3xl hover:bg-gray-900/60 transition-all hover:-translate-y-1 group">
    <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-block group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
  </div>
);
