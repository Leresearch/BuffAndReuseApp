import { useState } from 'react';
import { Package, Scale, Edit2, Trash2, Save, X } from 'lucide-react';

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
  onUpdate?: (id: string, updates: Partial<Donation>) => void;
  onDelete?: (id: string) => void;
}

export function DonationTracker({ donations, currentWeight, maxCapacity, onUpdate, onDelete }: DonationTrackerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Donation>>({});

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const capacityPercentage = (currentWeight / maxCapacity) * 100;

  const handleEdit = (donation: Donation) => {
    setEditingId(donation.id);
    setEditForm({
      itemName: donation.itemName,
      category: donation.category,
      condition: donation.condition,
      weight: donation.weight,
    });
  };

  const handleSave = () => {
    if (editingId && onUpdate) {
      onUpdate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (onDelete && confirm('Are you sure you want to delete this donation?')) {
      onDelete(id);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#0053A0]" />
              <div>
                <p className="text-sm text-[#004080]">Total Items</p>
                <p className="text-[#002244] text-xl font-bold">
                  {donations.length} items
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-[#0053A0]" />
              <div>
                <p className="text-sm text-[#004080]">Total Weight</p>
                <p className="text-[#002244] text-xl font-bold">
                  {donations.reduce((sum, d) => sum + d.weight, 0).toFixed(1)} lbs
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
                {(onUpdate || onDelete) && <th className="text-left py-3 px-4 text-gray-700 font-bold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => {
                const isEditing = editingId === donation.id;
                return (
                  <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.itemName || ''}
                          onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                          className="w-full px-2 py-1 border border-[#0053A0] rounded text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-gray-400" />
                          <span>{donation.itemName}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.category || ''}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-2 py-1 border border-[#0053A0] rounded text-sm"
                        />
                      ) : (
                        donation.category
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {isEditing ? (
                        <select
                          value={editForm.condition || ''}
                          onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                          className="w-full px-2 py-1 border border-[#0053A0] rounded text-sm"
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      ) : (
                        donation.condition
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.weight || ''}
                          onChange={(e) => setEditForm({ ...editForm, weight: parseFloat(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border border-[#0053A0] rounded text-sm"
                          step="0.1"
                          min="0"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Scale className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-700">{donation.weight} lbs</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">{getTimeAgo(donation.timestamp)}</td>
                    {(onUpdate || onDelete) && (
                      <td className="py-4 px-4">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleSave}
                              className="p-1 bg-[#0053A0] text-white rounded hover:bg-[#003d7a]"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            {onUpdate && (
                              <button
                                onClick={() => handleEdit(donation)}
                                className="p-1 bg-[#0053A0] text-white rounded hover:bg-[#003d7a]"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => handleDelete(donation.id)}
                                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
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
