
import React from 'react';
import { LicenseTrend, ActionType } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Info, Search, Newspaper, Share2, 
  ArrowRight, ShieldCheck, Zap, TrendingUp, Clock, Activity, ExternalLink
} from 'lucide-react';
import { ACTION_STYLES, KPI_DEFINITIONS } from '../constants';
import { KpiInfo } from './KpiInfo';

interface TrendDetailsProps {
  license: LicenseTrend;
}

export const TrendDetails: React.FC<TrendDetailsProps> = ({ license }) => {
  const getActionDescription = (action: ActionType) => {
    switch (action) {
      case ActionType.SCALE: return "High confidence detected. Expedite replenishment and sourcing immediately.";
      case ActionType.TEST: return "Emerging signal detected. Launch small-batch online-first or drop-ship collection.";
      case ActionType.HOLD: return "Momentum is plateauing. Maintain current inventory, monitor next news beats.";
      case ActionType.KILL: return "Demand trajectory is negative. Cease all new sourcing and manage exit strategy.";
      case ActionType.AVOID: return "Risk profile too high. Do not commit capital to this trend.";
      default: return "";
    }
  };

  const SignalIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'search': return <Search className="w-4 h-4 text-blue-500" />;
      case 'news': return <Newspaper className="w-4 h-4 text-purple-500" />;
      case 'social': return <Share2 className="w-4 h-4 text-pink-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-full bg-white border border-gray-200 rounded-2xl overflow-y-auto custom-scrollbar">
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-blue-600 tracking-widest uppercase">{license.category}</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-lg">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> AI Confidence: {license.confidence}%
            <KpiInfo definition={KPI_DEFINITIONS.CONFIDENCE} className="ml-1" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-6">{license.name}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`p-4 rounded-xl border-2 ${ACTION_STYLES[license.recommendedAction]} flex flex-col gap-2 relative group`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Recommended Action</span>
                <KpiInfo definition={KPI_DEFINITIONS.ACTION} />
              </div>
              <Zap className="w-4 h-4 opacity-70" />
            </div>
            <p className="text-xl font-black tracking-tight">{license.recommendedAction}</p>
            <p className="text-xs leading-relaxed font-medium mt-1">
              {getActionDescription(license.recommendedAction)}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-2">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Sensitivity</span>
                <KpiInfo definition={KPI_DEFINITIONS.WINDOW} />
              </div>
              <Clock className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-xl font-black text-gray-900">{license.timeSensitivity} Weeks</p>
            <p className="text-xs text-gray-500 leading-relaxed">Remaining window before seasonal drop or media cycle ends.</p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-2">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Historical Analog</span>
                <KpiInfo definition={KPI_DEFINITIONS.ANALOG} />
              </div>
              <Activity className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-xl font-black text-gray-900">{license.historicalAnalog || 'N/A'}</p>
            <p className="text-xs text-gray-500 leading-relaxed">Performance benchmark based on similar IP launches.</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Trend Visualization */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Demand Velocity
              <KpiInfo definition={KPI_DEFINITIONS.TREND_SCORE} />
            </h3>
            <div className="flex gap-4 text-[10px] font-bold text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Current Trend</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Projection</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={license.chartData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Executive Reasoning */}
        <section className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" /> Executive Reasoning
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {license.reasoning}
          </p>
        </section>

        {/* Google Search Grounding Sources */}
        {license.groundingSources && license.groundingSources.length > 0 && (
          <section className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> Google Search Grounding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {license.groundingSources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-xs font-semibold text-blue-800 truncate pr-2">{source.title}</span>
                  <ExternalLink className="w-3 h-3 text-blue-400 group-hover:text-blue-600 flex-shrink-0" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* External Signals Feed */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Early Awareness Signals
            </h3>
            <KpiInfo definition={KPI_DEFINITIONS.TREND_SCORE} />
          </div>
          <div className="space-y-3">
            {license.signals.map((signal, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <SignalIcon type={signal.type} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{signal.source}</span>
                    <span className="text-[10px] font-medium text-gray-400">{signal.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">{signal.description}</p>
                  <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full" 
                      style={{ width: `${signal.intensity}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4">
          <button className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
            Review & Approve Action <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
