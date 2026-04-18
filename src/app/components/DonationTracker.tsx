import { Package, Clock, CheckCircle, Scale, XCircle } from 'lucide-react';

interface Donation {
  id: string;
  itemName: string;
  category: string;
  condition: string;
  donor: string;
  timestamp: Date;
  status: 'pending' | 'processed' | 'priced';
  weight: number;
  accepted: boolean;
}

interface DonationTrackerProps {
  donations: Donation[];
  currentWeight: number;
  maxCapacity: number;
}

export function DonationTracker({ donations, currentWeight, maxCapacity }: DonationTrackerProps) {
  const getStatusBadge = (status: Donation['status']) => {
    const styles = {
      pending: 'bg-[#f5f0ed] text-[#6b4423]',
      processed: 'bg-[#e6f0f9] text-[#003366]',
      priced: 'bg-[#e6f0f9] text-[#0053A0]',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const capacityPercentage = (currentWeight / maxCapacity) * 100;
  const acceptedDonations = donations.filter(d => d.accepted);
  const rejectedDonations = donations.filter(d => !d.accepted);

  return (
    <div className="p-4 pb-6">
      <div className="bg-white rounded-xl shadow-md border border-[#e6f0f9] p-5">
        <div className="mb-4">
          <h3 className="mb-1 text-lg">Recent Donations</h3>
          <p className="text-gray-600 text-sm">Track incoming items</p>
        </div>

        {/* Capacity Card */}
        <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#0053A0]" />
            <div className="flex-1">
              <p className="text-sm text-[#004080]">Current Capacity</p>
              <p className="text-[#002244] text-xl font-bold">
                {currentWeight.toFixed(0)} / {maxCapacity} lbs ({capacityPercentage.toFixed(1)}%)
              </p>
              {capacityPercentage >= 90 && (
                <p className="text-sm text-gray-900 mt-1 font-semibold">⚠️ Near capacity - limited space available</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-[#0053A0]" />
              <div>
                <p className="text-sm text-[#004080]">Accepted</p>
                <p className="text-[#002244] text-xl font-bold">
                  {acceptedDonations.length} items
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-400 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-gray-900" />
              <div>
                <p className="text-sm text-gray-900">Rejected</p>
                <p className="text-black text-xl font-bold">
                  {rejectedDonations.length} items
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f0ed] border border-[#D4A574] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-[#8B4513]" />
              <div>
                <p className="text-sm text-[#6b4423]">Pending</p>
                <p className="text-[#4a2f1a] text-xl font-bold">
                  {donations.filter(d => d.status === 'pending').length} items
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#0053A0]" />
              <div>
                <p className="text-sm text-[#004080]">Processed</p>
                <p className="text-[#002244] text-xl font-bold">
                  {donations.filter(d => d.status === 'processed').length} items
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Donations Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Item</th>
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Category</th>
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Condition</th>
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Weight</th>
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Time</th>
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Accepted</th>
                <th className="text-left py-3 px-4 text-gray-700 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!donation.accepted ? 'bg-gray-100' : ''}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {donation.accepted ? (
                        <Package className="w-5 h-5 text-gray-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-700" />
                      )}
                      <span className={!donation.accepted ? 'text-gray-500 line-through' : ''}>{donation.itemName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{donation.category}</td>
                  <td className="py-4 px-4 text-gray-600">{donation.condition}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Scale className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-700">{donation.weight} lbs</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{getTimeAgo(donation.timestamp)}</td>
                  <td className="py-4 px-4">
                    {donation.accepted ? (
                      <span className="px-3 py-1 bg-[#e6f0f9] text-[#0053A0] rounded-full text-sm font-semibold">
                        ✓ Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm font-semibold">
                        ✗ No
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(donation.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {donations.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-semibold text-lg">No donations logged yet</p>
            <p className="text-gray-400 text-sm">Scanned and manually entered items will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
