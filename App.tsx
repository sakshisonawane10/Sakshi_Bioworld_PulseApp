
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, LicenseTrend, ActionType, ImpactLevel } from './types';
import { MOCK_LICENSES } from './constants';
import { LicenseCard } from './components/LicenseCard';
import { TrendDetails } from './components/TrendDetails';
import { LandingPage } from './components/LandingPage';
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
  Globe,
  Menu,
  Plus
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  // isSidebarCollapsed is true by default, making it collapsed unless hovered
  const [isSidebarCollapsed] = useState(true);
  
  const [state, setState] = useState<AppState>({
    licenses: MOCK_LICENSES,
    isSensing: false,
    lastUpdated: new Date().toLocaleTimeString(),
    selectedLicenseId: MOCK_LICENSES[0].id
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sensingError, setSensingError] = useState<string | null>(null);

  // Expanded strictly on hover when collapsed by default
  const isExpanded = isSidebarHovered || !isSidebarCollapsed;

  const handleSensing = async (licenseId?: string) => {
    const targetId = licenseId || state.selectedLicenseId;
    const selected = state.licenses.find(l => l.id === targetId);
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
            if (l.id === targetId) {
              return {
                ...l,
                name: result.name || l.name,
                category: result.category || l.category,
                recommendedAction: (result.action as ActionType) || l.recommendedAction,
                impactScore: (result.impact as ImpactLevel) || l.impactScore,
                reasoning: result.reasoning || l.reasoning,
                confidence: result.confidence || 0,
                trendScore: result.trendScore || 0,
                timeSensitivity: result.sensitivity || 0,
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
        throw new Error("Sensing Engine returned no valid data.");
      }
    } catch (err) {
      console.error("Demand sensing failed", err);
      setSensingError("Search failed. Verify API Key and connection.");
      setState(prev => ({ ...prev, isSensing: false }));
    }
  };

  const discoverNewTrend = async () => {
    const query = searchQuery.trim();
    if (!query || query.length < 2) return;
    
    setState(prev => ({ ...prev, isSensing: true }));
    setSensingError(null);

    try {
      const result = await geminiService.analyzeTrends(query, "Discovery");
      if (result) {
        const newId = `new-${Date.now()}`;
        const dates = ['-21d', '-14d', '-7d', 'Today'];
        const chartData = (result.points || [10, 20, 30, 40]).map((val: number, i: number) => ({
          date: dates[i],
          value: val
        }));

        const newLicense: LicenseTrend = {
          id: newId,
          name: result.name || query,
          category: result.category || "Uncategorized",
          recommendedAction: (result.action as ActionType) || ActionType.TEST,
          impactScore: (result.impact as ImpactLevel) || ImpactLevel.LOW,
          reasoning: result.reasoning || "Initial automated discovery via Real-time Sensing.",
          confidence: result.confidence || 50,
          trendScore: result.trendScore || 50,
          timeSensitivity: result.sensitivity || 4,
          signals: result.awarenessSignals || [],
          chartData: chartData,
          historicalAnalog: result.analog,
          groundingSources: result.groundingSources
        };

        setState(prev => ({
          ...prev,
          isSensing: false,
          lastUpdated: new Date().toLocaleTimeString(),
          licenses: [newLicense, ...prev.licenses],
          selectedLicenseId: newId
        }));
        setSearchQuery(''); 
      } else {
        throw new Error("Engine returned no discovery results.");
      }
    } catch (err) {
      console.error("Discovery failed:", err);
      setSensingError("Global sensing failed. Check logs or query term.");
      setState(prev => ({ ...prev, isSensing: false }));
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const existsLocally = state.licenses.some(l => 
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!existsLocally && searchQuery.trim().length >= 2) {
        discoverNewTrend();
      }
    }
  };

  const selectedLicense = state.licenses.find(l => l.id === state.selectedLicenseId);

  const filteredLicenses = state.licenses.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('dashboard')} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar with Hover Expansion Only */}
      <aside 
        className={`${
          isExpanded ? 'w-64' : 'w-20'
        } bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out hidden md:flex relative z-20`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-8 overflow-hidden">
            <div className="flex items-center gap-3 min-w-max">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl italic flex-shrink-0 shadow-lg shadow-blue-500/20">P</div>
              {isExpanded && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <h1 className="text-lg font-black tracking-tighter leading-none">BIOWORLD</h1>
                  <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase opacity-80">Pulse Platform</span>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Action Center" 
              active 
              collapsed={!isExpanded} 
            />
            <NavItem 
              icon={<Compass className="w-5 h-5" />} 
              label="Sense Engine" 
              collapsed={!isExpanded} 
            />
            <NavItem 
              icon={<Boxes className="w-5 h-5" />} 
              label="License Portfolio" 
              collapsed={!isExpanded} 
            />
            <NavItem 
              icon={<FileText className="w-5 h-5" />} 
              label="Reports" 
              collapsed={!isExpanded} 
            />
            <div className="py-4 border-t border-gray-800 mt-4" />
            <NavItem 
              icon={<Settings className="w-5 h-5" />} 
              label="Configuration" 
              collapsed={!isExpanded} 
            />
          </nav>
        </div>
        
        <div className="mt-auto p-5 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex-shrink-0 border-2 border-white/10" />
            {isExpanded && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-xs font-bold truncate w-32">Sakshi Sonawane</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Merchandising Lead</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search local or sense new trends (Press Enter)..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
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
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-wider hidden sm:flex">
                <Globe className="w-3 h-3" />
                Live Grounding Active
              </div>
            )}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <RefreshCw className={`w-3 h-3 ${state.isSensing ? 'animate-spin text-blue-500' : ''}`} />
              <span className="hidden sm:inline">Sync: {state.lastUpdated}</span>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setView('landing')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors sm:ml-2"
              title="Exit to Landing"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden p-6 gap-6 flex-col lg:flex-row">
          <section className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            <div className="flex items-center justify-between sticky top-0 bg-gray-50 z-10 pb-2">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                {searchQuery ? 'Search Results' : 'Active Trends'} 
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{filteredLicenses.length}</span>
              </h2>
              <button 
                onClick={() => handleSensing()}
                disabled={state.isSensing}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-sm"
              >
                <RefreshCw className={`w-3 h-3 ${state.isSensing ? 'animate-spin' : ''}`} />
                {state.isSensing ? 'Syncing...' : 'Force Sync'}
              </button>
            </div>

            <div className="space-y-4 pb-4">
              {filteredLicenses.map(license => (
                <LicenseCard 
                  key={license.id} 
                  license={license} 
                  isSelected={state.selectedLicenseId === license.id}
                  onClick={() => setState(s => ({ ...s, selectedLicenseId: license.id }))}
                />
              ))}
              
              {searchQuery && filteredLicenses.length === 0 && (
                <button 
                  onClick={discoverNewTrend}
                  disabled={state.isSensing}
                  className="w-full p-6 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl flex flex-col items-center gap-3 text-center group hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50"
                >
                  <div className="p-3 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    {state.isSensing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">Sense Global: "{searchQuery}"</h4>
                    <p className="text-xs text-blue-600/70 font-medium">No local matches. Trigger AI discovery engine.</p>
                  </div>
                </button>
              )}
            </div>
          </section>

          <section className="flex-1 overflow-hidden min-h-0">
            {selectedLicense ? (
              <TrendDetails key={selectedLicense.id} license={selectedLicense} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white border border-gray-200 rounded-2xl">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Compass className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No License Selected</h3>
                <p className="text-gray-500 max-w-sm">Select a trending license from the list or search for a new property to trigger AI discovery.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  collapsed?: boolean 
}> = ({ icon, label, active, collapsed }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group ${
    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }`}>
    <div className={`flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}>{icon}</div>
    {!collapsed && (
      <span className="truncate animate-in fade-in slide-in-from-left-1 duration-200">{label}</span>
    )}
    {collapsed && (
      <div className="absolute left-20 px-2 py-1 bg-gray-900 text-white text-[10px] uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-gray-800">
        {label}
      </div>
    )}
  </button>
);

export default App;
