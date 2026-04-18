import { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, Loader2, XCircle, AlertTriangle, Edit3, Scale, X } from 'lucide-react';

interface ScannedItem {
  id: string;
  name: string;
  category: string;
  condition: string;
  accepted: boolean;
  confidence: number;
}

interface ImageScannerProps {
  onDonationLogged: (itemName: string, category: string, condition: string, weight: number, accepted: boolean) => void;
  currentWeight: number;
  maxCapacity: number;
}

const categories = [
  'Clothing',
  'Furniture',
  'Electronics',
  'Kitchen Appliances',
  'Household Items',
  'Toys',
  'Books',
  'Sports/Recreation',
  'Accessories',
];

const conditions = ['Excellent', 'Good', 'Fair'];

// Items that are not accepted
const rejectedItems = [
  'mattress',
  'crib',
  'car seat',
  'baby gate',
  'hazardous',
  'chemicals',
  'paint',
  'weapons',
  'ammunition',
  'recalled',
  'broken glass',
  'soiled',
  'stained',
  'torn',
  'broken',
];

const checkIfAccepted = (itemName: string, condition: string): boolean => {
  const lowerName = itemName.toLowerCase();

  // Check if item is in rejected list
  if (rejectedItems.some(rejected => lowerName.includes(rejected))) {
    return false;
  }

  // Reject items in poor condition
  if (!['Excellent', 'Good', 'Fair'].includes(condition)) {
    return false;
  }

  return true;
};

export function ImageScanner({ onDonationLogged, currentWeight, maxCapacity }: ImageScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Editable fields
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState(categories[0]);
  const [editCondition, setEditCondition] = useState(conditions[0]);
  const [editWeight, setEditWeight] = useState('');
  const [editValidation, setEditValidation] = useState<{accepted: boolean; reason?: string} | null>(null);

  const capacityPercentage = (currentWeight / maxCapacity) * 100;
  const hasCapacity = (weight: number) => currentWeight + weight <= maxCapacity;

  const handleImageCapture = async (file: File) => {
    setScanning(true);
    setPreviewImage(URL.createObjectURL(file));

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI response (no weight - must be entered manually)
    const mockItems: ScannedItem[] = [
      { id: '1', name: 'Men\'s Jacket', category: 'Clothing', condition: 'Good', accepted: true, confidence: 0.92 },
      { id: '2', name: 'Blender', category: 'Kitchen Appliances', condition: 'Excellent', accepted: true, confidence: 0.88 },
      { id: '3', name: 'Dining Chair', category: 'Furniture', condition: 'Fair', accepted: true, confidence: 0.85 },
      { id: '4', name: 'Children\'s Toys', category: 'Toys', condition: 'Good', accepted: true, confidence: 0.90 },
    ];

    const selectedItem = mockItems[Math.floor(Math.random() * mockItems.length)];

    setScannedItem(selectedItem);

    // Populate edit fields with scanned data (weight is empty and must be entered)
    setEditName(selectedItem.name);
    setEditCategory(selectedItem.category);
    setEditCondition(selectedItem.condition);
    setEditWeight(''); // Weight must be entered manually
    setIsEditing(false);
    setEditValidation(null);

    setScanning(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageCapture(file);
    }
  };

  const handleReset = () => {
    setScannedItem(null);
    setPreviewImage(null);
    setEditValidation(null);
    setEditName('');
    setEditCategory(categories[0]);
    setEditCondition(conditions[0]);
    setEditWeight('');
    setIsEditing(false);
    setShowManualEntry(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValidation(null);
  };

  const handleCancelEdit = () => {
    if (scannedItem) {
      setEditName(scannedItem.name);
      setEditCategory(scannedItem.category);
      setEditCondition(scannedItem.condition);
      // Keep weight as-is since it's always manually entered
    }
    setIsEditing(false);
    setEditValidation(null);
  };

  const handleValidateEdit = () => {
    const weight = parseFloat(editWeight);

    if (!editName.trim()) {
      setEditValidation({ accepted: false, reason: 'Item name is required' });
      return;
    }

    if (isNaN(weight) || weight <= 0) {
      setEditValidation({ accepted: false, reason: 'Please enter the weight of the item' });
      return;
    }

    // Check if item is accepted
    const isAccepted = checkIfAccepted(editName, editCondition);

    if (!isAccepted) {
      setEditValidation({
        accepted: false,
        reason: 'Item does not meet acceptance criteria. May be damaged, recalled, or not suitable for resale.'
      });
      return;
    }

    // Check capacity
    if (!hasCapacity(weight)) {
      setEditValidation({
        accepted: false,
        reason: `Location at capacity. Cannot accept ${weight} lbs (${(currentWeight + weight).toFixed(0)}/${maxCapacity} lbs total)`
      });
      return;
    }

    setEditValidation({ accepted: true });
  };

  const handleSaveEdit = () => {
    if (editValidation?.accepted) {
      const weight = parseFloat(editWeight);
      onDonationLogged(editName, editCategory, editCondition, weight, true);
      handleReset();
    }
  };

  const handleValidateAndLog = () => {
    const weight = parseFloat(editWeight);

    if (!editName.trim()) {
      setEditValidation({ accepted: false, reason: 'Item name is required' });
      return;
    }

    if (isNaN(weight) || weight <= 0) {
      setEditValidation({ accepted: false, reason: 'Please enter the weight of the item' });
      return;
    }

    // Check if item is accepted
    const isAccepted = checkIfAccepted(editName, editCondition);

    if (!isAccepted) {
      setEditValidation({
        accepted: false,
        reason: 'Item does not meet acceptance criteria. May be damaged, recalled, or not suitable for resale.'
      });
      return;
    }

    // Check capacity
    if (!hasCapacity(weight)) {
      setEditValidation({
        accepted: false,
        reason: `Location at capacity. Cannot accept ${weight} lbs (${(currentWeight + weight).toFixed(0)}/${maxCapacity} lbs total)`
      });
      return;
    }

    // All validations passed - log the donation
    onDonationLogged(editName, editCategory, editCondition, weight, true);
    handleReset();
  };

  const handleManualValidate = () => {
    handleValidateEdit();
  };

  const handleManualLog = () => {
    if (editValidation?.accepted) {
      const weight = parseFloat(editWeight);
      onDonationLogged(editName, editCategory, editCondition, weight, true);
      handleReset();
    }
  };

  return (
    <div className="p-4 pb-6 space-y-4">
      {/* Capacity Indicator */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-[#e6f0f9]">
        <div className="flex items-center gap-3 mb-3">
          <Scale className="w-6 h-6 text-[#0053A0]" />
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900">Location Capacity</h3>
            <p className="text-sm text-gray-600">{currentWeight.toFixed(0)} / {maxCapacity} lbs ({capacityPercentage.toFixed(1)}%)</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              capacityPercentage >= 90 ? 'bg-gray-1000' : capacityPercentage >= 75 ? 'bg-orange-500' : 'bg-[#0053A0]'
            }`}
            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
          ></div>
        </div>
        {capacityPercentage >= 90 && (
          <p className="text-sm text-gray-900 mt-2 font-semibold">⚠️ Near capacity - limited space available</p>
        )}
      </div>

      {/* Main Scanner Interface */}
      {!showManualEntry ? (
        <div className="bg-white rounded-xl shadow-md p-5 border border-[#e6f0f9]">
          <h3 className="mb-3 text-lg">Scan Donation Items</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Take a photo or upload an image to identify donated items.
          </p>

          {/* Camera/Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6">
            {!previewImage ? (
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Capture or upload an image of the donation item</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="text-center">
                <img
                  src={previewImage}
                  alt="Scanned item"
                  className="max-w-full max-h-96 mx-auto rounded-lg mb-4"
                />
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-[#0053A0] hover:bg-[#e6f0f9] rounded-lg"
                >
                  Scan Another Item
                </button>
              </div>
            )}
          </div>

          {/* Processing State */}
          {scanning && (
            <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-6 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-3 text-[#0053A0] animate-spin" />
              <p className="text-[#002244]">Analyzing image...</p>
              <p className="text-[#0053A0] text-sm">AI is identifying the item and checking donation guidelines</p>
            </div>
          )}

          {/* Scanned Results */}
          {scannedItem && !scanning && !isEditing && (
            <div className="bg-blue-50 border-2 border-[#0053A0] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-12 h-12 text-[#0053A0] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-[#002244] mb-3 font-bold text-lg">Item Identified by AI</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-[#004080]">Item Name</p>
                      <p className="font-semibold text-[#002244]">{editName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#004080]">Category</p>
                      <p className="font-semibold text-[#002244]">{editCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#004080]">Condition</p>
                      <p className="font-semibold text-[#002244]">{editCondition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#004080]">AI Confidence</p>
                      <p className="font-semibold text-[#002244]">{(scannedItem.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Weight Input - Required */}
                  <div className="bg-white border-2 border-[#0053A0] rounded-lg p-4 mb-4">
                    <label className="block text-sm font-bold text-[#002244] mb-2 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[#0053A0]" />
                      Enter Weight (lbs) - Required
                    </label>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      placeholder="Enter weight in pounds"
                      min="0.1"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0] text-lg"
                      autoFocus
                    />
                  </div>

                  {editValidation && !editValidation.accepted && (
                    <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-black font-semibold">{editValidation.reason}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleValidateAndLog}
                      className="px-6 py-3 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] font-semibold"
                    >
                      Validate & Log Donation
                    </button>
                    <button
                      onClick={handleStartEdit}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-semibold"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit AI Details
                    </button>
                  </div>

                  <p className="text-xs text-[#004080] mt-3">
                    Review AI-identified details above. Click "Edit AI Details" if any information is incorrect.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {scannedItem && !scanning && isEditing && (
            <div className="bg-blue-50 border-2 border-[#0053A0] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#002244]">Edit Scanned Item</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                    <select
                      value={editCondition}
                      onChange={(e) => setEditCondition(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
                    >
                      {conditions.map((cond) => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
                  />
                </div>

                <button
                  onClick={handleValidateEdit}
                  className="w-full px-6 py-3 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] font-semibold"
                >
                  Validate Changes
                </button>

                {/* Validation Result */}
                {editValidation && (
                  <div className={`${editValidation.accepted ? 'bg-[#e6f0f9] border-[#99c2e6]' : 'bg-gray-100 border-gray-400'} border-2 rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      {editValidation.accepted ? (
                        <CheckCircle className="w-8 h-8 text-[#0053A0] flex-shrink-0" />
                      ) : (
                        <XCircle className="w-8 h-8 text-gray-900 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className={`font-bold mb-2 ${editValidation.accepted ? 'text-[#002244]' : 'text-black'}`}>
                          {editValidation.accepted ? '✓ Changes Accepted' : '✗ Changes Rejected'}
                        </h4>
                        {editValidation.reason && (
                          <p className={`text-sm ${editValidation.accepted ? 'text-[#004080]' : 'text-black'}`}>
                            {editValidation.reason}
                          </p>
                        )}
                        {editValidation.accepted && (
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={handleSaveEdit}
                              className="px-6 py-2 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] font-semibold"
                            >
                              Save & Log Donation
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manual Entry Link */}
          {!scannedItem && !scanning && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowManualEntry(true)}
                className="text-sm text-[#0053A0] hover:underline"
              >
                AI not working? Enter donation details manually
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Manual Entry Fallback */
        <div className="bg-white rounded-xl shadow-md p-5 border border-[#e6f0f9]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Manual Entry</h3>
              <p className="text-gray-600 text-sm">Enter donation item details manually</p>
            </div>
            <button
              onClick={() => setShowManualEntry(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., Men's Winter Jacket"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                <select
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
              <input
                type="number"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                placeholder="e.g., 5"
                min="0.1"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] focus:border-[#0053A0]"
              />
            </div>

            <button
              onClick={handleManualValidate}
              className="w-full px-6 py-3 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] font-semibold"
            >
              Validate Item
            </button>

            {/* Validation Result */}
            {editValidation && (
              <div className={`${editValidation.accepted ? 'bg-[#e6f0f9] border-[#99c2e6]' : 'bg-gray-100 border-gray-400'} border-2 rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  {editValidation.accepted ? (
                    <CheckCircle className="w-8 h-8 text-[#0053A0] flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-gray-900 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${editValidation.accepted ? 'text-[#002244]' : 'text-black'}`}>
                      {editValidation.accepted ? '✓ Item Accepted' : '✗ Item Rejected'}
                    </h4>
                    {editValidation.reason && (
                      <p className={`text-sm ${editValidation.accepted ? 'text-[#004080]' : 'text-black'}`}>
                        {editValidation.reason}
                      </p>
                    )}
                    {editValidation.accepted && (
                      <div className="mt-4">
                        <button
                          onClick={handleManualLog}
                          className="px-6 py-2 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] font-semibold"
                        >
                          Log Donation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acceptance Guidelines */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Acceptance Guidelines</h4>
            <div className="text-xs text-gray-700 space-y-1">
              <p>✓ Items must be clean and in Good or Excellent condition</p>
              <p>✗ No mattresses, cribs, car seats, or recalled items</p>
              <p>✗ No hazardous materials, weapons, or broken items</p>
              <p>⚠️ Check capacity before accepting large/heavy items</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
