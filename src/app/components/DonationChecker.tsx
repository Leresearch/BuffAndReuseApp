import { useState } from 'react';
import { CheckCircle, XCircle, MapPin, Package, AlertTriangle } from 'lucide-react';

interface DonationCheckerProps {
  selectedLocation: string;
}

type Step = 'category' | 'quantity' | 'condition' | 'location' | 'result';

const categories = ['Clothing/Accessories', 'Furniture', 'Electronics', 'Household Items', 'Sports/Recreation'];

const conditionQuestions: Record<string, string> = {
  'Clothing/Accessories': 'Is the item clean and free of stains?',
  'Furniture': 'Is it clean and not covered in pet hair?',
  'Electronics': 'Is it in working condition with all cords?',
  'Household Items': 'Is it clean and complete?',
  'Sports/Recreation': 'Is it in working condition?',
};

const quantityLimits: Record<string, number> = {
  'Clothing/Accessories': 25,
  'Furniture': 5,
  'Electronics': 5,
  'Household Items': 15,
  'Sports/Recreation': 10,
};

export function DonationChecker({ selectedLocation }: DonationCheckerProps) {
  const [step, setStep] = useState<Step>('category');
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<boolean | null>(null);
  const [canAccept, setCanAccept] = useState(true);
  const [capacityFull, setCapacityFull] = useState(false);
  const [quantityExceeded, setQuantityExceeded] = useState(false);

  const handleCategorySubmit = () => {
    const itemLower = item.toLowerCase();
    let matchedCategory = '';

    if (itemLower.includes('shirt') || itemLower.includes('pants') || itemLower.includes('shoe') || itemLower.includes('jacket') || itemLower.includes('dress')) {
      matchedCategory = 'Clothing/Accessories';
    } else if (itemLower.includes('couch') || itemLower.includes('chair') || itemLower.includes('table') || itemLower.includes('desk')) {
      matchedCategory = 'Furniture';
    } else if (itemLower.includes('tv') || itemLower.includes('computer') || itemLower.includes('phone') || itemLower.includes('tablet')) {
      matchedCategory = 'Electronics';
    } else if (itemLower.includes('dish') || itemLower.includes('pot') || itemLower.includes('book') || itemLower.includes('toy')) {
      matchedCategory = 'Household Items';
    } else if (itemLower.includes('bike') || itemLower.includes('ball') || itemLower.includes('equipment')) {
      matchedCategory = 'Sports/Recreation';
    }

    if (matchedCategory) {
      setCategory(matchedCategory);
      setStep('quantity');
    } else {
      setCategory('');
      setCanAccept(false);
      setStep('result');
    }
  };

  const handleQuantitySubmit = () => {
    const maxQuantity = quantityLimits[category];
    if (quantity > maxQuantity) {
      setQuantityExceeded(true);
      setCanAccept(false);
      setStep('result');
    } else {
      setQuantityExceeded(false);
      setStep('condition');
    }
  };

  const handleConditionSubmit = (isGood: boolean) => {
    setCondition(isGood);
    if (isGood) {
      // Simulate 10% chance of capacity full
      const isFull = Math.random() < 0.1;
      setCapacityFull(isFull);
      setCanAccept(!isFull);
    } else {
      setCanAccept(false);
    }
    setStep('result');
  };

  const handleReset = () => {
    setStep('category');
    setItem('');
    setCategory('');
    setQuantity(1);
    setCondition(null);
    setCanAccept(true);
    setCapacityFull(false);
    setQuantityExceeded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[#0053A0] rounded-full flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-base text-[#002244] font-bold">Donation Checker</h3>
        </div>
      </div>

      {step === 'category' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-2">What do you want to donate?</label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="e.g., jacket, couch, TV"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] text-sm"
            />
          </div>
          <button
            onClick={handleCategorySubmit}
            disabled={!item.trim()}
            className="w-full px-4 py-2 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] disabled:bg-gray-400 text-sm"
          >
            Next
          </button>
        </div>
      )}

      {step === 'quantity' && (
        <div className="space-y-3">
          <p className="text-sm text-[#002244]">Category: <strong>{category}</strong></p>
          <div>
            <label className="block text-sm text-gray-700 mb-2">How many items? (max {quantityLimits[category]})</label>
            <input
              type="number"
              min="1"
              max={quantityLimits[category]}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0] text-sm"
            />
          </div>
          <button
            onClick={handleQuantitySubmit}
            className="w-full px-4 py-2 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] text-sm"
          >
            Next
          </button>
        </div>
      )}

      {step === 'condition' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 mb-3">{conditionQuestions[category]}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleConditionSubmit(true)}
              className="px-4 py-3 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] text-sm"
            >
              Yes
            </button>
            <button
              onClick={() => handleConditionSubmit(false)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              No
            </button>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-3">
          {!category && (
            <div className="bg-gray-100 border border-gray-400 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-black mb-1">Item Not Accepted</h4>
                  <p className="text-xs text-gray-900 mb-2">We cannot accept this item at Goodwill locations.</p>
                  <p className="text-xs text-gray-900"><strong>Try:</strong> Contact local recycling center or disposal facility</p>
                </div>
              </div>
            </div>
          )}

          {quantityExceeded && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-orange-900 mb-1">Quantity Too Large</h4>
                  <p className="text-xs text-orange-700 mb-2">We can only accept up to {quantityLimits[category]} {category.toLowerCase()} items per donation.</p>
                  <p className="text-xs text-orange-700"><strong>Options:</strong></p>
                  <div className="space-y-1 text-xs text-orange-700">
                    <p>• Split into multiple donations over several days</p>
                    <p>• Contact store to arrange bulk donation pickup</p>
                    <p>• Try donation centers that accept large quantities</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {category && !condition && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-orange-900 mb-1">Item Condition Issue</h4>
                  <p className="text-xs text-orange-700 mb-2">We can only accept items in good condition.</p>
                  <p className="text-xs text-orange-700"><strong>Try:</strong> Clean/repair the item first, or consider disposal</p>
                </div>
              </div>
            </div>
          )}

          {category && condition && capacityFull && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-orange-900 mb-1">Capacity Reached</h4>
                  <p className="text-xs text-orange-700 mb-2">We have reached capacity. We cannot take more donations today.</p>
                  <p className="text-xs text-orange-700 mb-2"><strong>Options:</strong></p>
                  <div className="space-y-1 text-xs text-orange-700">
                    <p>• Check back tomorrow</p>
                    <p>• Try nearby locations (within 10 miles)</p>
                    <p>• See alternative donation centers below</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {category && condition && canAccept && (
            <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#0053A0] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-[#002244] mb-1">✓ {selectedLocation} Can Accept</h4>
                  <p className="text-xs text-[#004080] mb-2">Great! We can accept your {quantity} {item}(s).</p>
                  <p className="text-xs text-[#004080]"><strong>Bring it in during store hours:</strong> Mon-Sat 9am-7pm, Sun 10am-6pm</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] text-sm"
          >
            Check Another Item
          </button>
        </div>
      )}

      <div className="mt-4 bg-[#e6f0f9] border border-[#99c2e6] rounded p-2">
        <p className="text-xs text-[#002244]">
          <strong>Why use the donation checker?</strong> Save a trip, check Goodwill capacity before driving over!
        </p>
      </div>
    </div>
  );
}
