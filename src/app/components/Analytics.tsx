import { TrendingUp, Package, Users, MapPin } from 'lucide-react';

export function Analytics() {
  const stats = [
    { label: 'Total Donations Today', value: '127', change: '+12%', icon: Package, color: 'blue' },
    { label: 'Unique Donors', value: '89', change: '+8%', icon: Users, color: 'green' },
    { label: 'Items Processed', value: '104', change: '+15%', icon: TrendingUp, color: 'purple' },
    { label: 'Active Locations', value: '3', change: '0%', icon: MapPin, color: 'orange' },
  ];

  const topCategories = [
    { name: 'Clothing', count: 45, percentage: 35 },
    { name: 'Furniture', count: 28, percentage: 22 },
    { name: 'Electronics', count: 22, percentage: 17 },
    { name: 'Kitchen Items', count: 18, percentage: 14 },
    { name: 'Books', count: 14, percentage: 11 },
  ];

  const recentGoal = {
    current: 127,
    target: 150,
    message: "You are the 127th donation today! Thank you for being part of the change.",
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-[#e6f0f9]', text: 'text-[#0053A0]', border: 'border-[#99c2e6]' },
      green: { bg: 'bg-[#e6f0f9]', text: 'text-[#0053A0]', border: 'border-[#99c2e6]' },
      purple: { bg: 'bg-[#f5f0ed]', text: 'text-[#8B4513]', border: 'border-[#D4A574]' },
      orange: { bg: 'bg-[#f5f0ed]', text: 'text-[#8B4513]', border: 'border-[#D4A574]' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-3 pb-6 space-y-3">
      {/* Stats Grid - Compact */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div key={stat.label} className={`${colors.bg} border ${colors.border} rounded-lg p-3`}>
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-5 h-5 ${colors.text}`} />
                <span className={`text-xs px-1.5 py-0.5 rounded ${colors.text}`}>
                  {stat.change}
                </span>
              </div>
              <p className={`text-xl mb-0.5 ${colors.text}`}>{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Goal Progress - Compact */}
      <div className="bg-[#0053A0] text-white rounded-lg shadow-md p-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5" />
          <div>
            <h4 className="text-white text-sm">Daily Goal</h4>
            <p className="text-white text-xs">You're #127 today!</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-2.5 mb-1">
          <div
            className="bg-white rounded-full h-2.5 transition-all duration-500"
            style={{ width: `${(recentGoal.current / recentGoal.target) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs">
          <span>{recentGoal.current}</span>
          <span>Goal: {recentGoal.target}</span>
        </div>
      </div>

      {/* Top Categories - Compact */}
      <div className="bg-white rounded-lg shadow-md border border-[#e6f0f9] p-3">
        <h4 className="mb-3 text-sm">Top Categories</h4>
        <div className="space-y-2">
          {topCategories.slice(0, 3).map((category, index) => (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-700">{index + 1}. {category.name}</span>
                <span className="text-xs text-gray-500">{category.count} ({category.percentage}%)</span>
              </div>
              <div className="bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#0053A0] rounded-full h-1.5 transition-all duration-500"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Impact - Compact */}
      <div className="bg-white rounded-lg shadow-md border border-[#e6f0f9] p-3">
        <h4 className="mb-2 text-sm">Community Impact</h4>
        <div className="space-y-2">
          <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded p-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0053A0]" />
            <div className="flex-1">
              <p className="text-xs text-[#004080]">Downtown</p>
              <p className="text-sm text-[#002244]">42 today</p>
            </div>
          </div>
          <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded p-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0053A0]" />
            <div className="flex-1">
              <p className="text-xs text-[#004080]">Westside</p>
              <p className="text-sm text-[#002244]">51 today</p>
            </div>
          </div>
          <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded p-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0053A0]" />
            <div className="flex-1">
              <p className="text-xs text-[#004080]">Eastside</p>
              <p className="text-sm text-[#002244]">34 today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
