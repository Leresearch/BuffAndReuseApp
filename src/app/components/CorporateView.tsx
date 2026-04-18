import { useState } from 'react';
import { TrendingUp, TrendingDown, MapPin, Package, DollarSign, Users, BarChart3, Lightbulb, ArrowRight, CheckCircle2, Recycle, HandshakeIcon, Building, Link, MessageCircle } from 'lucide-react';
import { CorporateChatBot } from './CorporateChatBot';

interface LocationMetrics {
  location: string;
  donations: number;
  donationsChange: number;
  uniqueDonors: number;
  donorsChange: number;
  processedItems: number;
  itemsChange: number;
  revenue: number;
  revenueChange: number;
  topCategories: Array<{ name: string; count: number; percentage: number }>;
}

const locationMetrics: LocationMetrics[] = [
  {
    location: 'Downtown Goodwill',
    donations: 127,
    donationsChange: 12,
    uniqueDonors: 89,
    donorsChange: 8,
    processedItems: 104,
    itemsChange: 15,
    revenue: 8420,
    revenueChange: 18,
    topCategories: [
      { name: 'Clothing', count: 45, percentage: 35 },
      { name: 'Furniture', count: 28, percentage: 22 },
      { name: 'Electronics', count: 22, percentage: 17 },
    ],
  },
  {
    location: 'Westside Goodwill',
    donations: 156,
    donationsChange: 22,
    uniqueDonors: 112,
    donorsChange: 15,
    processedItems: 138,
    itemsChange: 25,
    revenue: 9850,
    revenueChange: 28,
    topCategories: [
      { name: 'Children\'s Items', count: 62, percentage: 40 },
      { name: 'Toys', count: 31, percentage: 20 },
      { name: 'Clothing', count: 28, percentage: 18 },
    ],
  },
  {
    location: 'Eastside Goodwill',
    donations: 98,
    donationsChange: -5,
    uniqueDonors: 71,
    donorsChange: -2,
    processedItems: 82,
    itemsChange: -3,
    revenue: 6730,
    revenueChange: -8,
    topCategories: [
      { name: 'Furniture', count: 38, percentage: 39 },
      { name: 'Kitchen Items', count: 25, percentage: 26 },
      { name: 'Books', count: 19, percentage: 19 },
    ],
  },
];

const dailyTrends = [
  { day: 'Mon', downtown: 62, westside: 74, eastside: 48 },
  { day: 'Tue', downtown: 58, westside: 68, eastside: 52 },
  { day: 'Wed', downtown: 71, westside: 82, eastside: 45 },
  { day: 'Thu', downtown: 69, westside: 88, eastside: 56 },
  { day: 'Fri', downtown: 84, westside: 95, eastside: 61 },
  { day: 'Sat', downtown: 127, westside: 156, eastside: 98 },
  { day: 'Sun', downtown: 96, westside: 121, eastside: 72 },
];

// Quarterly data for multi-year tracking (percentages of total donations by category)
const quarterlyTrendsByLocation = {
  'Downtown Goodwill': [
    { quarter: 'Q1 2023', clothing: 1650, furniture: 890, electronics: 680, household: 1020, other: 620 },
    { quarter: 'Q2 2023', clothing: 1780, furniture: 950, electronics: 740, household: 1100, other: 710 },
    { quarter: 'Q3 2023', clothing: 1820, furniture: 970, electronics: 760, household: 1140, other: 730 },
    { quarter: 'Q4 2023', clothing: 1950, furniture: 1040, electronics: 820, household: 1220, other: 790 },
    { quarter: 'Q1 2024', clothing: 2020, furniture: 1080, electronics: 850, household: 1260, other: 820 },
    { quarter: 'Q2 2024', clothing: 2180, furniture: 1150, electronics: 920, household: 1350, other: 880 },
    { quarter: 'Q3 2024', clothing: 2240, furniture: 1180, electronics: 940, household: 1400, other: 910 },
    { quarter: 'Q4 2024', clothing: 2420, furniture: 1270, electronics: 1010, household: 1500, other: 980 },
    { quarter: 'Q1 2025', clothing: 2480, furniture: 1300, electronics: 1040, household: 1540, other: 1010 },
    { quarter: 'Q2 2025', clothing: 2620, furniture: 1360, electronics: 1090, household: 1620, other: 1060 },
    { quarter: 'Q3 2025', clothing: 2680, furniture: 1390, electronics: 1110, household: 1660, other: 1080 },
    { quarter: 'Q4 2025', clothing: 2850, furniture: 1470, electronics: 1180, household: 1750, other: 1140 },
  ],
  'Westside Goodwill': [
    { quarter: 'Q1 2023', clothing: 2020, furniture: 980, electronics: 790, household: 1180, other: 740 },
    { quarter: 'Q2 2023', clothing: 2180, furniture: 1050, electronics: 850, household: 1270, other: 800 },
    { quarter: 'Q3 2023', clothing: 2240, furniture: 1080, electronics: 870, household: 1310, other: 820 },
    { quarter: 'Q4 2023', clothing: 2420, furniture: 1160, electronics: 940, household: 1410, other: 880 },
    { quarter: 'Q1 2024', clothing: 2500, furniture: 1200, electronics: 970, household: 1460, other: 910 },
    { quarter: 'Q2 2024', clothing: 2680, furniture: 1280, electronics: 1040, household: 1560, other: 970 },
    { quarter: 'Q3 2024', clothing: 2760, furniture: 1310, electronics: 1070, household: 1610, other: 1000 },
    { quarter: 'Q4 2024', clothing: 2980, furniture: 1410, electronics: 1150, household: 1730, other: 1080 },
    { quarter: 'Q1 2025', clothing: 3060, furniture: 1450, electronics: 1180, household: 1780, other: 1110 },
    { quarter: 'Q2 2025', clothing: 3240, furniture: 1530, electronics: 1250, household: 1880, other: 1170 },
    { quarter: 'Q3 2025', clothing: 3320, furniture: 1570, electronics: 1280, household: 1930, other: 1200 },
    { quarter: 'Q4 2025', clothing: 3540, furniture: 1670, electronics: 1360, household: 2050, other: 1280 },
  ],
  'Eastside Goodwill': [
    { quarter: 'Q1 2023', clothing: 1320, furniture: 800, electronics: 560, household: 860, other: 520 },
    { quarter: 'Q2 2023', clothing: 1420, furniture: 860, electronics: 600, household: 920, other: 560 },
    { quarter: 'Q3 2023', clothing: 1460, furniture: 880, electronics: 620, household: 950, other: 580 },
    { quarter: 'Q4 2023', clothing: 1580, furniture: 950, electronics: 670, household: 1020, other: 620 },
    { quarter: 'Q1 2024', clothing: 1620, furniture: 980, electronics: 690, household: 1050, other: 640 },
    { quarter: 'Q2 2024', clothing: 1740, furniture: 1050, electronics: 740, household: 1130, other: 690 },
    { quarter: 'Q3 2024', clothing: 1780, furniture: 1080, electronics: 760, household: 1160, other: 710 },
    { quarter: 'Q4 2024', clothing: 1920, furniture: 1160, electronics: 820, household: 1250, other: 770 },
    { quarter: 'Q1 2025', clothing: 1970, furniture: 1190, electronics: 840, household: 1280, other: 790 },
    { quarter: 'Q2 2025', clothing: 2080, furniture: 1260, electronics: 890, household: 1360, other: 840 },
    { quarter: 'Q3 2025', clothing: 2130, furniture: 1290, electronics: 910, household: 1390, other: 860 },
    { quarter: 'Q4 2025', clothing: 2270, furniture: 1370, electronics: 970, household: 1480, other: 920 },
  ],
};

interface PartnershipData {
  category: string;
  rejectionRate: number;
  monthlyVolume: number;
  currentPartner?: string;
  partnerType: 'reuse' | 'recycling' | 'none';
}

const partnershipData: PartnershipData[] = [
  { category: 'Mattresses & Bedding', rejectionRate: 18, monthlyVolume: 145, currentPartner: 'Sleep Recyclers Inc.', partnerType: 'recycling' },
  { category: 'Large Appliances', rejectionRate: 12, monthlyVolume: 89, currentPartner: 'Metro Appliance Recycling', partnerType: 'recycling' },
  { category: 'Electronics (Non-working)', rejectionRate: 8, monthlyVolume: 67, currentPartner: 'E-Waste Solutions', partnerType: 'recycling' },
  { category: 'Baby Safety Items', rejectionRate: 15, monthlyVolume: 124, partnerType: 'none' },
  { category: 'Building Materials', rejectionRate: 10, monthlyVolume: 78, currentPartner: 'Habitat for Humanity', partnerType: 'reuse' },
  { category: 'Damaged Furniture', rejectionRate: 14, monthlyVolume: 156, partnerType: 'none' },
  { category: 'Textiles (Unsaleable)', rejectionRate: 9, monthlyVolume: 203, currentPartner: 'SecondHand Textiles Co.', partnerType: 'recycling' },
  { category: 'Auto Parts', rejectionRate: 5, monthlyVolume: 34, partnerType: 'none' },
];

export function CorporateView() {
  const [showChat, setShowChat] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('All Locations');
  const [recommendationBranch, setRecommendationBranch] = useState<string>('Downtown Goodwill');

  const totalDonations = locationMetrics.reduce((sum, loc) => sum + loc.donations, 0);
  const totalDonors = locationMetrics.reduce((sum, loc) => sum + loc.uniqueDonors, 0);
  const totalRevenue = locationMetrics.reduce((sum, loc) => sum + loc.revenue, 0);
  const avgDonationsChange = Math.round(
    locationMetrics.reduce((sum, loc) => sum + loc.donationsChange, 0) / locationMetrics.length
  );

  const selectedLocation = selectedBranch === 'All Locations'
    ? null
    : locationMetrics.find(loc => loc.location === selectedBranch);

  // Generate location-specific recommendations
  const generateRecommendations = () => {
    const sortedByVolume = [...locationMetrics].sort((a, b) => b.donations - a.donations);
    const sortedByGrowth = [...locationMetrics].sort((a, b) => b.donationsChange - a.donationsChange);
    const sortedByDecline = [...locationMetrics].sort((a, b) => a.donationsChange - b.donationsChange);

    const highestVolume = sortedByVolume[0];
    const fastestGrowing = sortedByGrowth[0];
    const declining = sortedByDecline.filter(loc => loc.donationsChange < 0);

    return {
      sorting: {
        locations: locationMetrics.map(loc => {
          const topCategory = loc.topCategories[0];
          const isSpecialized = topCategory.percentage > 35;

          return {
            location: loc.location,
            recommendation: isSpecialized
              ? `Create dedicated ${topCategory.name.toLowerCase()} sorting station (${topCategory.percentage}% of inventory)`
              : `Balanced inventory - maintain general sorting workflow`,
            priority: isSpecialized ? 'High' : 'Low',
            specialization: topCategory.name,
            percentage: topCategory.percentage,
          };
        }),
        aiDeployment: sortedByVolume.slice(0, 2).map((loc, idx) => ({
          location: loc.location,
          priority: idx === 0 ? 'Phase 1' : 'Phase 2',
          volume: loc.donations,
          expectedSavings: Math.round(loc.donations * 0.35 * 5), // $5 per donation saved
        })),
      },
      staffing: {
        locations: locationMetrics.map(loc => {
          const utilizationRate = (loc.processedItems / loc.donations) * 100;
          const isOvercapacity = utilizationRate > 85;
          const isUndercapacity = utilizationRate < 75;

          return {
            location: loc.location,
            utilization: Math.round(utilizationRate),
            recommendation: isOvercapacity
              ? `Add 2-3 staff during peak hours (currently at ${Math.round(utilizationRate)}% capacity)`
              : isUndercapacity
              ? `Reduce staff by 1-2 or reassign to higher-volume location (${Math.round(utilizationRate)}% capacity)`
              : `Staffing levels optimal (${Math.round(utilizationRate)}% capacity)`,
            action: isOvercapacity ? 'hire' : isUndercapacity ? 'reassign' : 'maintain',
            staffChange: isOvercapacity ? '+2-3' : isUndercapacity ? '-1-2' : '0',
          };
        }),
        crossLocation: sortedByVolume[0].donations > sortedByVolume[2].donations * 1.3 ? {
          from: sortedByVolume[2].location,
          to: sortedByVolume[0].location,
          staff: 2,
          days: 'Mon-Wed',
        } : null,
      },
      distribution: {
        transfers: locationMetrics.flatMap(source => {
          return source.topCategories
            .filter(cat => cat.percentage > 30)
            .map(cat => {
              const needsThisCategory = locationMetrics
                .filter(loc => loc.location !== source.location)
                .find(loc => {
                  const hasCat = loc.topCategories.find(c => c.name === cat.name);
                  return !hasCat || hasCat.percentage < 20;
                });

              if (needsThisCategory) {
                return {
                  from: source.location,
                  to: needsThisCategory.location,
                  category: cat.name,
                  percentage: cat.percentage,
                  suggestion: `Transfer 20-30% of ${cat.name.toLowerCase()} from ${source.location} to ${needsThisCategory.location}`,
                };
              }
              return null;
            })
            .filter(Boolean);
        }),
        routing: locationMetrics.map(loc => {
          const topCat = loc.topCategories[0];
          return {
            location: loc.location,
            specialty: topCat.name,
            message: `Route ${topCat.name.toLowerCase()} donors to ${loc.location} (${topCat.percentage}% specialization)`,
          };
        }),
      },
      growth: {
        declining: declining.map(loc => ({
          location: loc.location,
          decline: loc.donationsChange,
          recommendation: `Increase marketing spend by $500-1000/month; Partner with 2-3 local organizations; Review donation hours`,
          urgency: loc.donationsChange < -10 ? 'Critical' : 'Moderate',
        })),
        growing: fastestGrowing.donationsChange > 15 ? {
          location: fastestGrowing.location,
          growth: fastestGrowing.donationsChange,
          recommendation: `Study ${fastestGrowing.location} success factors and replicate at other locations`,
          actions: [
            'Document outreach strategies',
            'Analyze donor demographics',
            'Review staff training methods',
          ],
        } : null,
      },
    };
  };

  const recommendations = generateRecommendations();

  const renderChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-[#0053A0]">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">+{change}%</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-gray-900">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm">{change}%</span>
        </div>
      );
    }
    return <span className="text-sm text-gray-500">0%</span>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pb-6 space-y-6">
      {/* Branch Selector */}
      <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-6">
        <label className="block text-sm text-gray-700 mb-3 font-semibold">Select Branch</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full px-4 py-3 border-2 border-[#0053A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] text-base font-medium"
        >
          <option value="All Locations">All Locations - Overview</option>
          {locationMetrics.map((loc) => (
            <option key={loc.location} value={loc.location}>
              {loc.location}
            </option>
          ))}
        </select>
      </div>

      {/* Branch-Specific View */}
      {selectedLocation ? (
        <div className="space-y-6">
          {/* Branch Header */}
          <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-[#0053A0]" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedLocation.location}</h2>
                <p className="text-base text-gray-600">Branch Performance & Recommendations</p>
              </div>
            </div>

            {/* Branch Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-[#e6f0f9] rounded-lg p-4">
                <Package className="w-6 h-6 mb-2 text-[#0053A0]" />
                <p className="text-2xl font-bold text-gray-900">{selectedLocation.donations}</p>
                <p className="text-sm text-gray-600">Donations Today</p>
                {renderChangeIndicator(selectedLocation.donationsChange)}
              </div>
              <div className="bg-[#e6f0f9] rounded-lg p-4">
                <Users className="w-6 h-6 mb-2 text-[#0053A0]" />
                <p className="text-2xl font-bold text-gray-900">{selectedLocation.uniqueDonors}</p>
                <p className="text-sm text-gray-600">Unique Donors</p>
                {renderChangeIndicator(selectedLocation.donorsChange)}
              </div>
              <div className="bg-[#f5f0ed] rounded-lg p-4">
                <CheckCircle2 className="w-6 h-6 mb-2 text-[#0053A0]" />
                <p className="text-2xl font-bold text-gray-900">{selectedLocation.processedItems}</p>
                <p className="text-sm text-gray-600">Items Processed</p>
                {renderChangeIndicator(selectedLocation.itemsChange)}
              </div>
              <div className="bg-[#f5f0ed] rounded-lg p-4">
                <DollarSign className="w-6 h-6 mb-2 text-[#8B4513]" />
                <p className="text-2xl font-bold text-gray-900">${(selectedLocation.revenue / 1000).toFixed(1)}K</p>
                <p className="text-sm text-gray-600">Revenue</p>
                {renderChangeIndicator(selectedLocation.revenueChange)}
              </div>
            </div>
          </div>

          {/* Branch-Specific Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Staff Recommendations */}
            <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#e6f0f9] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0053A0]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Staff Optimization</h3>
                  <p className="text-sm text-gray-600">Staffing recommendations</p>
                </div>
              </div>
              <div className="space-y-4">
                {recommendations.staffing.locations
                  .filter(rec => rec.location === selectedLocation.location)
                  .map((rec) => (
                    <div key={rec.location}>
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Capacity Utilization</span>
                          <span className={`text-lg font-bold ${
                            rec.utilization > 85 ? 'text-gray-900' : rec.utilization < 75 ? 'text-[#8B4513]' : 'text-[#0053A0]'
                          }`}>{rec.utilization}%</span>
                        </div>
                      </div>
                      <div className="bg-[#e6f0f9] border-l-4 border-[#0053A0] rounded-lg p-4">
                        <p className="text-sm font-semibold text-[#002244] mb-2">Recommendation:</p>
                        <p className="text-sm text-[#004080]">{rec.recommendation}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            rec.action === 'hire' ? 'bg-[#0053A0] text-white' :
                            rec.action === 'reassign' ? 'bg-[#8B4513] text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {rec.action === 'hire' ? 'Add Staff' : rec.action === 'reassign' ? 'Reassign' : 'No Change'}
                          </span>
                          <span className="text-sm font-bold text-[#002244]">{rec.staffChange} staff</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sorting Recommendations */}
            <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#0053A0]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sorting Process</h3>
                  <p className="text-sm text-gray-600">Optimize workflow</p>
                </div>
              </div>
              <div className="space-y-4">
                {recommendations.sorting.locations
                  .filter(rec => rec.location === selectedLocation.location)
                  .map((rec) => (
                    <div key={rec.location}>
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-gray-700">Category Specialization</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-gray-900">{rec.specialization}</span>
                          <span className="text-2xl font-bold text-[#0053A0]">{rec.percentage}%</span>
                        </div>
                      </div>
                      <div className={`${
                        rec.priority === 'High' ? 'bg-blue-50 border-l-4 border-[#0053A0]' : 'bg-gray-50 border-l-4 border-gray-400'
                      } rounded-lg p-4`}>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Recommendation:</p>
                        <p className="text-sm text-gray-800 mb-3">{rec.recommendation}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rec.priority === 'High' ? 'bg-[#0053A0] text-white' : 'bg-gray-400 text-white'
                        }`}>
                          {rec.priority} Priority
                        </span>
                      </div>
                      {recommendations.sorting.aiDeployment.find(d => d.location === selectedLocation.location) && (
                        <div className="mt-3 bg-[#f5f0ed] border border-[#D4A574] rounded-lg p-4">
                          <p className="text-sm font-semibold text-[#4a2f1a] mb-1">AI Scanner Deployment</p>
                          <p className="text-xs text-[#6b4423] mb-2">
                            Priority: {recommendations.sorting.aiDeployment.find(d => d.location === selectedLocation.location)?.priority}
                          </p>
                          <p className="text-sm text-[#6b4423]">
                            Expected savings: <span className="font-bold">${recommendations.sorting.aiDeployment.find(d => d.location === selectedLocation.location)?.expectedSavings}/month</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Distribution Recommendations */}
          <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f5f0ed] rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#8B4513]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Distribution Strategy</h3>
                <p className="text-sm text-gray-600">Inventory transfers & routing</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Outbound Transfers */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Suggested Transfers FROM This Branch</h4>
                <div className="space-y-2">
                  {recommendations.distribution.transfers
                    .filter(t => t?.from === selectedLocation.location)
                    .map((transfer, idx) => (
                      <div key={idx} className="bg-[#f5f0ed] border border-[#D4A574] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight className="w-4 h-4 text-[#8B4513]" />
                          <span className="text-sm font-semibold text-[#4a2f1a]">{transfer?.category}</span>
                        </div>
                        <p className="text-xs text-[#6b4423] mb-2">To: {transfer?.to}</p>
                        <p className="text-xs text-[#6b4423]">{transfer?.suggestion}</p>
                      </div>
                    ))}
                  {recommendations.distribution.transfers.filter(t => t?.from === selectedLocation.location).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No outbound transfers recommended</p>
                  )}
                </div>
              </div>

              {/* Inbound Transfers */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Suggested Transfers TO This Branch</h4>
                <div className="space-y-2">
                  {recommendations.distribution.transfers
                    .filter(t => t?.to === selectedLocation.location)
                    .map((transfer, idx) => (
                      <div key={idx} className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight className="w-4 h-4 text-[#0053A0]" />
                          <span className="text-sm font-semibold text-[#002244]">{transfer?.category}</span>
                        </div>
                        <p className="text-xs text-[#004080] mb-2">From: {transfer?.from}</p>
                        <p className="text-xs text-[#004080]">{transfer?.suggestion}</p>
                      </div>
                    ))}
                  {recommendations.distribution.transfers.filter(t => t?.to === selectedLocation.location).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No inbound transfers recommended</p>
                  )}
                </div>
              </div>
            </div>

            {/* Donor Routing */}
            <div className="mt-4 bg-[#f5f0ed] border border-[#D4A574] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-[#4a2f1a] mb-2">Donor Routing Strategy</h4>
              {recommendations.distribution.routing
                .filter(r => r.location === selectedLocation.location)
                .map((route) => (
                  <p key={route.location} className="text-sm text-[#6b4423]">{route.message}</p>
                ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              {selectedLocation.topCategories.map((cat, idx) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{idx + 1}. {cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{cat.count} items</span>
                      <span className="text-base font-bold text-[#0053A0]">{cat.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0053A0] text-white rounded-lg p-5">
              <Package className="w-7 h-7 mb-2" />
              <p className="text-3xl font-bold mb-1">{totalDonations}</p>
              <p className="text-sm text-white">Donations Today</p>
              {renderChangeIndicator(avgDonationsChange)}
            </div>

            <div className="bg-[#0053A0] text-white rounded-lg p-5">
              <Users className="w-7 h-7 mb-2" />
              <p className="text-3xl font-bold mb-1">{totalDonors}</p>
              <p className="text-sm text-white">Donors Today</p>
              {renderChangeIndicator(7)}
            </div>

            <div className="bg-[#0053A0] text-white rounded-lg p-5">
              <DollarSign className="w-7 h-7 mb-2" />
              <p className="text-3xl font-bold mb-1">${(totalRevenue / 1000).toFixed(1)}K</p>
              <p className="text-sm text-white">Revenue Today</p>
              {renderChangeIndicator(13)}
            </div>

            <div className="bg-[#66a3d9] text-white rounded-lg p-5">
              <MapPin className="w-7 h-7 mb-2" />
              <p className="text-3xl font-bold mb-1">{locationMetrics.length}</p>
              <p className="text-sm text-white">Locations</p>
            </div>
          </div>

          {/* Branch Recommendations */}
          <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#0053A0]" />
                <h3 className="text-lg font-bold text-gray-900">Branch Recommendations</h3>
              </div>
            </div>

            {/* Branch Selector */}
            <div className="mb-4">
              <select
                value={recommendationBranch}
                onChange={(e) => setRecommendationBranch(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#0053A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] text-sm font-medium"
              >
                {locationMetrics.map((location) => (
                  <option key={location.location} value={location.location}>{location.location}</option>
                ))}
              </select>
            </div>

            {(() => {
              const recommendations = generateRecommendations();
              const branch = locationMetrics.find(loc => loc.location === recommendationBranch);
              if (!branch) return null;

              const sortingRec = recommendations.sorting.locations.find(r => r.location === recommendationBranch);
              const staffingRec = recommendations.staffing.locations.find(r => r.location === recommendationBranch);
              const aiDeployment = recommendations.sorting.aiDeployment.find(d => d.location === recommendationBranch);

              // Get distribution recommendations for this branch
              const outboundTransfers = recommendations.distribution.transfers.filter(t => t?.from === recommendationBranch);
              const inboundTransfers = recommendations.distribution.transfers.filter(t => t?.to === recommendationBranch);
              const routingRec = recommendations.distribution.routing.find(r => r.location === recommendationBranch);

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Box 1: Sorting Process */}
                  <div className="bg-white border-2 border-[#0053A0] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#0053A0]">
                      <Package className="w-5 h-5 text-[#0053A0]" />
                      <h4 className="text-sm font-bold text-[#002244]">Sorting Process</h4>
                    </div>

                    {sortingRec && (
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Specialization</p>
                          <p className="text-sm font-bold text-gray-900">{sortingRec.specialization}</p>
                          <p className="text-xs text-[#0053A0] font-bold">{sortingRec.percentage}% of donations</p>
                        </div>

                        {aiDeployment && (
                          <div className="bg-[#f5f0ed] rounded p-2">
                            <p className="text-xs font-bold text-[#4a2f1a]">AI Scanner</p>
                            <p className="text-xs text-[#6b4423]">{aiDeployment.priority} Priority</p>
                            <p className="text-xs text-[#6b4423]">${aiDeployment.expectedSavings.toLocaleString()}/mo</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Box 2: Staffing Allocation */}
                  <div className="bg-white border-2 border-[#0053A0] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#0053A0]">
                      <Users className="w-5 h-5 text-[#0053A0]" />
                      <h4 className="text-sm font-bold text-[#002244]">Staffing</h4>
                    </div>

                    {staffingRec && (
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Capacity Utilization</p>
                          <p className={`text-2xl font-bold ${
                            staffingRec.utilization > 85 ? 'text-gray-900' : staffingRec.utilization < 75 ? 'text-[#8B4513]' : 'text-[#0053A0]'
                          }`}>{staffingRec.utilization}%</p>
                          <p className={`text-xs font-bold ${
                            staffingRec.utilization > 85 ? 'text-gray-900' : staffingRec.utilization < 75 ? 'text-[#8B4513]' : 'text-[#0053A0]'
                          }`}>
                            {staffingRec.utilization > 85 ? 'Overcapacity' : staffingRec.utilization < 75 ? 'Undercapacity' : 'Optimal'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600 mb-1">Action Required</p>
                          <div className={`px-2 py-1 rounded text-xs font-bold text-center ${
                            staffingRec.action === 'hire' ? 'bg-[#0053A0] text-white' :
                            staffingRec.action === 'reassign' ? 'bg-[#8B4513] text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {staffingRec.action === 'hire' ? 'Hire' : staffingRec.action === 'reassign' ? 'Reassign' : 'Maintain'}
                          </div>
                          <p className="text-xs text-gray-900 mt-1 text-center font-bold">{staffingRec.staffChange} employees</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Box 3: Distribution Process */}
                  <div className="bg-white border-2 border-[#0053A0] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#0053A0]">
                      <ArrowRight className="w-5 h-5 text-[#0053A0]" />
                      <h4 className="text-sm font-bold text-[#002244]">Distribution</h4>
                    </div>

                    <div className="space-y-2">
                      {/* Transfers Summary */}
                      {(outboundTransfers.length > 0 || inboundTransfers.length > 0) ? (
                        <>
                          {outboundTransfers.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Send</p>
                              {outboundTransfers.slice(0, 2).map((transfer, idx) => (
                                <p key={idx} className="text-xs font-bold text-[#8B4513]">→ {transfer?.category}</p>
                              ))}
                            </div>
                          )}

                          {inboundTransfers.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Receive</p>
                              {inboundTransfers.slice(0, 2).map((transfer, idx) => (
                                <p key={idx} className="text-xs font-bold text-[#0053A0]">← {transfer?.category}</p>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-[#e6f0f9] rounded p-2">
                          <p className="text-xs text-gray-600 text-center">Stock Balanced</p>
                        </div>
                      )}

                      {/* Donor Routing */}
                      {routingRec && (
                        <div className="bg-[#f5f0ed] rounded p-2">
                          <p className="text-xs font-bold text-[#4a2f1a] mb-1">Donor Routing</p>
                          <p className="text-xs text-[#6b4423]">{routingRec.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Summary Metrics */}
            {(() => {
              const branch = locationMetrics.find(loc => loc.location === recommendationBranch);
              if (!branch) return null;

              return (
                <div className="bg-white border-2 border-[#0053A0] rounded-lg p-3 mt-3">
                  <p className="text-xs font-bold text-[#002244] mb-2">Branch Summary</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Donations</p>
                      <p className="text-sm font-bold text-[#0053A0]">{branch.donations}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Donors</p>
                      <p className="text-sm font-bold text-[#0053A0]">{branch.uniqueDonors}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Revenue</p>
                      <p className="text-sm font-bold text-[#0053A0]">${(branch.revenue / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Top</p>
                      <p className="text-xs font-bold text-gray-900">{branch.topCategories[0].name}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Location Comparison */}
          <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-6">
            <div className="flex items-center gap-3 mb-5">
              <BarChart3 className="w-6 h-6 text-[#0053A0]" />
              <h3 className="text-xl font-bold text-gray-900">Location Performance</h3>
            </div>

            <div className="space-y-4">
              {locationMetrics.map((location) => (
                <div key={location.location} className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#0053A0] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#0053A0]" />
                      <h4 className="text-base font-bold text-gray-900">{location.location}</h4>
                    </div>
                    {renderChangeIndicator(location.donationsChange)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Donations</p>
                      <p className="text-xl font-bold text-gray-900">{location.donations}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Donors</p>
                      <p className="text-xl font-bold text-gray-900">{location.uniqueDonors}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Revenue</p>
                      <p className="text-xl font-bold text-gray-900">${(location.revenue / 1000).toFixed(1)}K</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Top Category:</span> {location.topCategories[0].name} ({location.topCategories[0].percentage}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Chat Assistant Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-[#0053A0] text-white rounded-full shadow-2xl hover:scale-110 hover:bg-[#003d7a] transition-all flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#66a3d9] rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Assistant */}
      {showChat && <CorporateChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
}
