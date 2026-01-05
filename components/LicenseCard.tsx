
import React from 'react';
import { LicenseTrend, ActionType } from '../types';
import { ACTION_STYLES, IMPACT_STYLES, KPI_DEFINITIONS } from '../constants';
import { TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { KpiInfo } from './KpiInfo';

interface LicenseCardProps {
  license: LicenseTrend;
  isSelected: boolean;
  onClick: () => void;
}

export const LicenseCard: React.FC<LicenseCardProps> = ({ license, isSelected, onClick }) => {
  const isUp = license.chartData[license.chartData.length - 1].value > license.chartData[0].value;

  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-xl border transition-all cursor-pointer ${
        isSelected 
        ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500' 
        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{license.name}</h3>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{license.category}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${ACTION_STYLES[license.recommendedAction]}`}>
            {license.recommendedAction}
          </div>
          <KpiInfo definition={KPI_DEFINITIONS.ACTION} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-gray-500 uppercase">Trend Score</p>
              <KpiInfo definition={KPI_DEFINITIONS.TREND_SCORE} />
            </div>
            <p className="text-sm font-bold text-gray-900">{license.trendScore}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-gray-500 uppercase">Window</p>
              <KpiInfo definition={KPI_DEFINITIONS.WINDOW} />
            </div>
            <p className="text-sm font-bold text-gray-900">{license.timeSensitivity}w</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full font-medium ${IMPACT_STYLES[license.impactScore]}`}>
            {license.impactScore} Impact
          </span>
          <KpiInfo definition={KPI_DEFINITIONS.IMPACT} />
        </div>
        <div className={`flex items-center gap-1 font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(license.chartData[license.chartData.length - 1].value - license.chartData[0].value)}%
        </div>
      </div>
    </div>
  );
};
