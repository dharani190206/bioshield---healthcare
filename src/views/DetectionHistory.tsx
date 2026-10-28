import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SimulatedBanner } from '../components/common/SimulatedBanner';
import { RiskBadge } from '../components/common/RiskBadge';
import { DiversionStatusBadge, MovementBadge } from '../components/common/StatusBadge';
import { exportToCsv, exportToJson } from '../services/storage';
import { WildlifeCategory, RiskLevel, DiversionStatus } from '../types';
import {
  History,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileCode,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const DetectionHistoryView: React.FC<{ onOpenSimulator: () => void }> = ({ onOpenSimulator }) => {
  const { detections, resetData } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<WildlifeCategory | 'All'>('All');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');
  const [diversionFilter, setDiversionFilter] = useState<DiversionStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'risk-high' | 'distance-near'>('date-desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Filter & Sort logic
  const filteredRecords = useMemo(() => {
    return detections.filter((item) => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch =
        item.id.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search) ||
        (item.subcategory && item.subcategory.toLowerCase().includes(search)) ||
        item.riskReason.toLowerCase().includes(search);

      if (!matchSearch) return false;

      // Category filter
      if (categoryFilter !== 'All' && item.wildlifeCategory !== categoryFilter) return false;

      // Risk filter
      if (riskFilter !== 'All' && item.riskLevel !== riskFilter) return false;

      // Diversion filter
      if (diversionFilter !== 'All' && item.diversionStatus !== diversionFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (sortBy === 'risk-high') {
        return b.riskScore - a.riskScore;
      }
      if (sortBy === 'distance-near') {
        return a.distanceMeters - b.distanceMeters;
      }
      return 0;
    });
  }, [detections, searchTerm, categoryFilter, riskFilter, diversionFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const isPresetRecord = (id: string) => {
    return id === 'DET-DEMO-001' || id === 'DET-DEMO-002' || id === 'DET-DEMO-003';
  };

  const getPresetLabel = (id: string) => {
    if (id === 'DET-DEMO-001') return 'Prompt Sample Record 1';
    if (id === 'DET-DEMO-002') return 'Prompt Sample Record 2';
    if (id === 'DET-DEMO-003') return 'Prompt Sample Record 3';
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      <SimulatedBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Section E • Detection History
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Historical Wildlife Activity Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Searchable historical records of all detected wildlife, risk assessments, and safe diversion events.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportToCsv(detections)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Download CSV report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportToJson(detections)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Download JSON dataset"
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={resetData}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reload default demonstration records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload Sample Records</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, species, location, notes..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as WildlifeCategory | 'All');
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Bird">🦅 Birds Only</option>
              <option value="Bee">🐝 Bees Only</option>
              <option value="Other">🐾 Other Wildlife</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value as RiskLevel | 'All');
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none font-medium"
            >
              <option value="All">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="risk-high">Highest Risk First</option>
              <option value="distance-near">Closest Proximity</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges & Count */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredRecords.length}</strong> matching records
            {searchTerm && ` for "${searchTerm}"`}
          </div>

          {(searchTerm || categoryFilter !== 'All' || riskFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setRiskFilter('All');
                setDiversionFilter('All');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* History Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Event ID / Type</th>
                <th className="py-3 px-4">Wildlife Category</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Movement & Proximity</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Diversion Status</th>
                <th className="py-3 px-4">Detection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No detection records match the specified filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => {
                  const presetLabel = getPresetLabel(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        presetLabel ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      {/* ID and Sample Record Badge */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                        <div>{item.id}</div>
                        {presetLabel && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            {presetLabel}
                          </span>
                        )}
                      </td>

                      {/* Wildlife Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {item.wildlifeCategory === 'Bird' ? '🦅' : item.wildlifeCategory === 'Bee' ? '🐝' : '🐾'}
                          </span>
                          <div>
                            <div className="font-bold text-slate-800">{item.wildlifeCategory}</div>
                            <div className="text-[11px] text-slate-400">{item.subcategory}</div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {item.location}
                      </td>

                      {/* Movement & Distance */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MovementBadge status={item.movementStatus} />
                          <span className="font-mono font-semibold text-slate-700">
                            {item.distanceMeters.toFixed(1)}m
                          </span>
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <RiskBadge level={item.riskLevel} size="sm" />
                      </td>

                      {/* Diversion Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <DiversionStatusBadge status={item.diversionStatus} />
                      </td>

                      {/* Detection Status */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600">
                        {item.detectionStatus}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
