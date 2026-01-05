
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, LicenseTrend, ActionType, ImpactLevel } from './types';
import { MOCK_LICENSES } from './constants';
import { LicenseCard } from './components/LicenseCard';
import { TrendDetails } from './components/TrendDetails';
import { geminiService } from './services/geminiService';
import { 
  Search, 
  Settings, 
  Bell, 
  RefreshCw,
  LayoutDashboard,
  Boxes,
  Compass,
  FileText,
  AlertCircle,
  Globe
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    licenses: MOCK_LICENSES,
    isSensing: false,
    lastUpdated: new Date().toLocaleTimeString(),
    selectedLicenseId: MOCK_LICENSES[0].id
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sensingError, setSensingError] = useState<string | null>(null);

  const handleSensing = async () => {
    const selected = state.licenses.find(l => l.id === state.selectedLicenseId);
    if (!selected) return;

    setState(prev => ({ ...prev, isSensing: true }));
    setSensingError(null);
    
    try {
      const result = await geminiService.analyzeTrends(selected.name, selected.category);
      
      if (result) {
        const dates = ['-21d', '-14d', '-7d', 'Today'];
        const chartData = (result.points || [10, 20, 30, 40]).map((val: number, i: number) => ({
          date: dates[i],
          value: val
        }));

        setState(prev => ({
          ...prev,
          isSensing: false,
          lastUpdated: new Date().toLocaleTimeString(),
          licenses: prev.licenses.map(l => {
            if (l.id === state.selectedLicenseId) {
              return {
                ...l,
                recommendedAction: result.action as ActionType,
                impactScore: result.impact as ImpactLevel,
                reasoning: result.reasoning,
                confidence: result.confidence,
                trendScore: result.trendScore,
                timeSensitivity: result.sensitivity,
                historicalAnalog: result.analog || l.historicalAnalog,
                groundingSources: result.groundingSources,
                signals: result.awarenessSignals || l.signals,
                chartData: chartData
              };
            }
            return l;
          })
        }));
      } else {
        throw new Error("Empty response from Sensing Engine");
      }
    } catch (err) {
      console.error("Demand sensing failed", err);
      setSensingError("Google Search sync failed. Verify API_KEY environment variable.");
      setState(prev => ({ ...prev, isSensing: false }));
    }
  };

  const selectedLicense = state.licenses.find(l => l.id === state.selectedLicenseId);

  const filteredLicenses = state.licenses.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl italic">P</div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none">BIOWORLD</h1>
              <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase opacity-80">Pulse Platform</span>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Action Center" active />
            <NavItem icon={<Compass className="w-5 h-5" />} label="Sense Engine" />
            <NavItem icon={<Boxes className="w-5 h-5" />} label="License Portfolio" />
            <NavItem icon={<FileText className="w-5 h-5" />} label="Reports" />
            <NavItem icon={<Settings className="w-5 h-5" />} label="Configuration" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600" />
            <div>
              <p className="text-xs font-bold">Sakshi Sonawane</p>
              <p className="text-[10px] text-gray-400 uppercase">Merchandising Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search licenses or categories..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {sensingError ? (
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                <AlertCircle className="w-3 h-3" />
                {sensingError}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-wider">
                <Globe className="w-3 h-3" />
                Live Grounding Active
              </div>
            )}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <RefreshCw className={`w-3 h-3 ${state.isSensing ? 'animate-spin text-blue-500' : ''}`} />
              Sync: {state.lastUpdated}
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Dashboard Left: List */}
          <section className="w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                Active Trends <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{filteredLicenses.length}</span>
              </h2>
              <button 
                onClick={handleSensing}
                disabled={state.isSensing}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-sm"
              >
                <RefreshCw className={`w-3 h-3 ${state.isSensing ? 'animate-spin' : ''}`} />
                {state.isSensing ? 'Syncing...' : 'Sync Search Data'}
              </button>
            </div>

            <div className="space-y-4">
              {filteredLicenses.map(license => (
                <LicenseCard 
                  key={license.id} 
                  license={license} 
                  isSelected={state.selectedLicenseId === license.id}
                  onClick={() => setState(s => ({ ...s, selectedLicenseId: license.id }))}
                />
              ))}
            </div>
          </section>

          {/* Dashboard Right: Detail */}
          <section className="flex-1 overflow-hidden">
            {selectedLicense ? (
              <TrendDetails license={selectedLicense} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white border border-gray-200 rounded-2xl">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Compass className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No License Selected</h3>
                <p className="text-gray-500 max-w-sm">Select a trending license from the list to view early demand signals and recommended actions.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
    active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }`}>
    {icon}
    {label}
  </button>
);

export default App;
