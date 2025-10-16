import React, { useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Calendar,
  Target,
} from "lucide-react";

const generateWatchlistData = () => {
  const sectors = [
    "Technology",
    "Financials",
    "Healthcare",
    "Industrials",
    "Consumer",
    "Services",
  ];
  const companies = [
    "Apex Digital Corp",
    "Meridian Industries",
    "Quantum Systems",
    "Horizon Tech",
    "Stellar Pharma",
    "Atlas Manufacturing",
    "Velocity Networks",
    "Zenith Finance",
    "Prism Healthcare",
    "Nexus Consulting",
    "Omega Retail",
    "Cascade Logistics",
    "Summit Biotech",
    "Frontier Mining",
    "Eclipse Software",
    "Titan Construction",
    "Vortex Communications",
    "Phoenix Capital",
    "Aurora Therapeutics",
    "Infinity Tech",
    "Delta Airlines Ltd",
    "Sierra Resources",
    "Nova Semiconductors",
    "Cosmos Pharma",
    "Vertex Media",
    "Pinnacle Automotive",
    "Horizon Chemicals",
    "Spectrum Banking",
    "Catalyst Biotech",
    "Fusion Hospitality",
    "Momentum Retail",
    "Keystone Materials",
    "Clarity Software",
    "Genesis Pharma",
    "Vector Aerospace",
    "Radiant Telecom",
    "Quantum Finance",
    "Nexus Materials",
    "Pulse Diagnostics",
    "Orbit Telecom",
    "Summit Industrial",
    "Nova Healthcare",
    "Zenith Manufacturing",
    "Atlas Logistics",
    "Meridian Tech",
    "Apex Pharma",
    "Horizon Finance",
    "Stellar Systems",
    "Quantum Retail",
    "Velocity Industries",
  ];

  return companies
    .slice(0, 50)
    .map((name, i) => {
      const baseline = 0.55 + Math.random() * 0.4;
      const gbm = 0.5 + Math.random() * 0.45;
      const logistic = 0.52 + Math.random() * 0.43;
      const composite = (baseline + gbm + logistic) / 3;

      return {
        id: i + 1,
        ticker:
          name
            .split(" ")
            .map((w) => w[0])
            .join("") +
          (100 + i),
        name,
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        baseline: baseline,
        gbm: gbm,
        logistic: logistic,
        composite: composite,
        change: (Math.random() - 0.5) * 0.2,
      };
    })
    .sort((a, b) => b.composite - a.composite);
};

const getSignalData = () => {
  const signalNames = [
    "Leverage Signal",
    "Liquidity Signal",
    "Profitability Signal",
    "Market Signal",
    "Governance Signal",
    "Volatility Signal",
    "Momentum Signal",
    "Value Signal",
    "Growth Signal",
    "Quality Signal",
  ];

  return signalNames
    .map((name) => ({
      name,
      contribution: Math.random() * 100,
    }))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 6);
};

const Dashboard = () => {
  const [view, setView] = useState("watchlist");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [sortField, setSortField] = useState("composite");
  const [sortDirection, setSortDirection] = useState("desc");

  const watchlistData = generateWatchlistData();
  const sectors = ["All", ...new Set(watchlistData.map((c) => c.sector))];

  const filteredData = watchlistData
    .filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector =
        sectorFilter === "All" || company.sector === sectorFilter;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;
      return (a[sortField] - b[sortField]) * multiplier;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getScoreColor = (score) => {
    if (score > 0.74) {
      return "text-red-500";
    }
    if (score > 0.59) {
      return "text-amber-500";
    }
    return "text-green-500";
  };

  const getScoreBg = (score) => {
    if (score > 0.74) {
      return "bg-red-50 border-red-200";
    }
    if (score > 0.59) {
      return "bg-amber-50 border-amber-200";
    }
    return "bg-green-50 border-green-200";
  };

  const getScoreBarColor = (score) => {
    if (score > 0.74) {
      return "bg-red-500";
    }
    if (score > 0.59) {
      return "bg-amber-500";
    }
    return "bg-green-500";
  };

  const ScoreBar = ({ score, label }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className={`font-semibold ${getScoreColor(score)}`}>
          {(score * 100).toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getScoreBarColor(
            score
          )}`}
          style={{ width: `${score * 100}%` }}
        />
      </div>
    </div>
  );

  const SignalContribution = ({ signals, modelName }) => (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <h3 className="font-semibold mb-3 text-gray-800">
        {modelName} - Top Contributing Signals
      </h3>
      <div className="space-y-2">
        {signals.map((signal, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-32 text-sm text-gray-600 truncate">
              {signal.name}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${signal.contribution}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm font-medium text-gray-700">
              {signal.contribution.toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === "detail" && selectedCompany) {
    const baselineSignals = getSignalData();
    const gbmSignals = getSignalData();
    const logisticSignals = getSignalData();

    let entryWindow = "Not recommended";
    let confidence = "Low (<60%)";
    let entryText = "Current signals do not meet threshold criteria";
    let confidenceText = "Insufficient model consensus";

    if (selectedCompany.composite > 0.74) {
      entryWindow = "Now - 3 months";
      confidence = "High (85-95%)";
      entryText = "Based on current model signals and historical patterns";
      confidenceText = "All three models show strong agreement";
    } else if (selectedCompany.composite > 0.59) {
      entryWindow = "1-6 months";
      confidence = "Medium (60-85%)";
      entryText = "Based on current model signals and historical patterns";
      confidenceText = "Models show moderate consensus";
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setView("watchlist")}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            ← Back to Watchlist
          </button>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedCompany.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedCompany.ticker} • {selectedCompany.sector}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-lg border-2 ${getScoreBg(
                  selectedCompany.composite
                )}`}
              >
                <div className="text-sm text-gray-600 mb-1">
                  Composite Score
                </div>
                <div
                  className={`text-3xl font-bold ${getScoreColor(
                    selectedCompany.composite
                  )}`}
                >
                  {(selectedCompany.composite * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Model Scores
              </h3>
              <ScoreBar
                score={selectedCompany.baseline}
                label="Baseline Model"
              />
              <ScoreBar score={selectedCompany.gbm} label="LightGBM" />
              <ScoreBar
                score={selectedCompany.logistic}
                label="Logistic Regression"
              />
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recommended Entry Window
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {entryWindow}
              </div>
              <p className="text-sm text-gray-600">{entryText}</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Confidence Level
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {confidence}
              </div>
              <p className="text-sm text-gray-600">{confidenceText}</p>
            </div>
          </div>

          <div className="space-y-4">
            <SignalContribution
              signals={baselineSignals}
              modelName="Baseline Model"
            />
            <SignalContribution signals={gbmSignals} modelName="LightGBM" />
            <SignalContribution
              signals={logisticSignals}
              modelName="Logistic Regression"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Corporate Performance Watchlist
          </h1>
          <p className="text-gray-600">
            Top 50 companies ranked by composite performance probability
          </p>
        </div>

        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company name or ticker..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sector
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("composite")}
                  >
                    Composite{" "}
                    {sortField === "composite" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("baseline")}
                  >
                    Baseline{" "}
                    {sortField === "baseline" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("gbm")}
                  >
                    GBM{" "}
                    {sortField === "gbm" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("logistic")}
                  >
                    Logistic{" "}
                    {sortField === "logistic" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("change")}
                  >
                    Change{" "}
                    {sortField === "change" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((company, index) => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCompany(company);
                      setView("detail");
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {company.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {company.ticker}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {company.sector}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-semibold ${getScoreColor(
                          company.composite
                        )}`}
                      >
                        {(company.composite * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                      {(company.baseline * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                      {(company.gbm * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                      {(company.logistic * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1 text-sm ${
                          company.change > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {company.change > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(company.change * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {filteredData.length} of {watchlistData.length} companies
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Score (75%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Medium Score (60-75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low Score (&lt;60%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
