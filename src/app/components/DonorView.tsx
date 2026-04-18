import { useState } from 'react';
import { Package, Users, Heart, MapPin, CheckCircle, XCircle, Navigation, AlertCircle } from 'lucide-react';
import { DonationChecker } from './DonationChecker';
import { LocationMap } from './LocationMap';
import { LineReader } from './TextToSpeech';

interface LocationNeed {
  location: string;
  address: string;
  city: string;
  state: string;
  distance: number; // in miles
  urgentNeeds: string[];
  regularNeeds: string[];
  notNeeded: string[];
}

const locationData: LocationNeed[] = [
  {
    location: 'Goodwill of Greater Washington',
    address: '1403 New York Ave. NE',
    city: 'Washington',
    state: 'DC',
    distance: 0.8,
    urgentNeeds: ['Winter coats', 'Professional wear', 'Kitchen items'],
    regularNeeds: ['Furniture under 50lbs', 'Books', 'Household goods'],
    notNeeded: ['CRT TVs', 'Mattresses', 'Large appliances'],
  },
  {
    location: 'Arlington, Glebe Road',
    address: '10 South Glebe Rd.',
    city: 'Arlington',
    state: 'VA',
    distance: 1.2,
    urgentNeeds: ['Kids clothing', 'Toys', 'School supplies'],
    regularNeeds: ['Electronics', 'Shoes', 'Home decor'],
    notNeeded: ['Broken items', 'Stained clothing', 'VHS tapes'],
  },
  {
    location: 'West Falls Church',
    address: '2936 Annandale Rd.',
    city: 'Falls Church',
    state: 'VA',
    distance: 2.1,
    urgentNeeds: ['Small furniture', 'Kitchen items', 'Bedding'],
    regularNeeds: ['Clothing', 'Books', 'Small appliances'],
    notNeeded: ['Old computers', 'Baby furniture', 'CRT TVs'],
  },
  {
    location: 'Alexandria, Richmond Highway',
    address: '6220 Richmond Hwy.',
    city: 'Alexandria',
    state: 'VA',
    distance: 3.5,
    urgentNeeds: ['Furniture', 'Appliances', 'Bedding'],
    regularNeeds: ['Clothing', 'Shoes', 'Books'],
    notNeeded: ['Mattresses', 'CRT TVs', 'Baby cribs'],
  },
  {
    location: 'Annandale, Columbia Pike',
    address: '7031 Columbia Pike',
    city: 'Annandale',
    state: 'VA',
    distance: 4.7,
    urgentNeeds: ['Professional wear', 'Electronics', 'Kitchen items'],
    regularNeeds: ['Household goods', 'Toys', 'Sports equipment'],
    notNeeded: ['Large appliances', 'Broken items', 'Stained clothing'],
  },
];

export function DonorView() {
  const [selectedLocation, setSelectedLocation] = useState<LocationNeed>(locationData[0]);
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Prepare text content for line reader
  const pageContent = [
    'Welcome to Goodwill Donor Portal.',
    `Daily Goal: 1,247 donations today out of 1,500.`,
    `Selected Location: ${selectedLocation.location}, ${selectedLocation.distance} miles away.`,
    `Urgently Needed Items: ${selectedLocation.urgentNeeds.join(', ')}.`,
    `Currently Accepting: ${selectedLocation.regularNeeds.join(', ')}.`,
    `Not Accepting: ${selectedLocation.notNeeded.join(', ')}.`,
    'Use the donation checker below to verify if your items can be accepted.',
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 pb-6 space-y-4">
      {/* Accessibility: Text-to-Speech Line Reader */}
      <div className="bg-white rounded-lg shadow-md border-2 border-[#0053A0] p-4">
        <h3 className="text-base font-bold text-[#002244] mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#0053A0]" />
          Accessibility: Page Reader
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Click "Start Line Reader" to have the page content read aloud to you, line by line.
        </p>
        <LineReader lines={pageContent} />
      </div>

      {/* 1. Daily Goal */}
      <div className="bg-[#0053A0] text-white rounded-lg shadow-md p-4">
        <h3 className="text-white mb-1 text-base font-bold">Daily Goal</h3>
        <p className="text-xs text-white mb-3">1,247 donations today!</p>
        <div className="bg-white/20 rounded-full h-3 mb-1">
          <div className="bg-white rounded-full h-3 transition-all duration-500" style={{ width: '83%' }}></div>
        </div>
        <p className="text-xs text-white">1,247 / 1,500 donations (83%)</p>
      </div>

      {/* 2. Select Store Location */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4" style={{ borderColor: '#0053A0' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold">Select Store Location</h3>
          <button
            className="px-3 py-1 text-white rounded text-xs flex items-center gap-1"
            style={{ backgroundColor: '#0053A0' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#003d7a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0053A0'}
          >
            <Navigation className="w-3 h-3" />
            Use My Location
          </button>
        </div>
        <select
          value={selectedLocation.location}
          onChange={(e) => {
            const loc = locationData.find(l => l.location === e.target.value);
            if (loc) setSelectedLocation(loc);
          }}
          className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none text-sm"
          style={{ borderColor: '#0053A0' }}
        >
          {locationData.map((loc) => (
            <option key={loc.location} value={loc.location}>
              {loc.location} - {loc.distance} mi - {loc.address}, {loc.city}, {loc.state}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-600 mt-2">
          <MapPin className="w-3 h-3 inline mr-1" />
          Selected: {selectedLocation.location} ({selectedLocation.distance} miles away)
        </p>
      </div>

      {/* 3. Map */}
      <LocationMap />

      {/* 4. Donation Checker */}
      <DonationChecker selectedLocation={selectedLocation.location} />

      {/* 5. Items at the Goodwill */}
      <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-4">
        <h3 className="mb-3 text-base font-bold">Items at {selectedLocation.location}</h3>
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm text-orange-900 font-bold">⚡ Urgently Needed</h4>
            </div>
            <p className="text-xs text-orange-800">{selectedLocation.urgentNeeds.join(' • ')}</p>
          </div>

          <div className="bg-[#e6f0f9] border border-[#66a3d9] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#0053A0]" />
              <h4 className="text-sm text-[#002244] font-bold">Accepting</h4>
            </div>
            <p className="text-xs text-[#003366]">{selectedLocation.regularNeeds.join(' • ')}</p>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm text-gray-900 font-bold">Not Accepting</h4>
            </div>
            <p className="text-xs text-gray-600">{selectedLocation.notNeeded.join(' • ')}</p>
          </div>
        </div>
      </div>

      {/* 6. Donation Guidelines (Expanded) */}
      <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-4">
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-base font-bold">Full Donation Guidelines</h3>
          <span className="text-sm text-[#0053A0]">{showGuidelines ? 'Hide' : 'Show'}</span>
        </button>

        {showGuidelines && (
          <div className="mt-4 space-y-4">
            {/* What We Accept */}
            <div>
              <h4 className="text-sm font-bold text-[#002244] mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Items We Accept
              </h4>
              <div className="space-y-3">
                {/* Clothing */}
                <div className="bg-[#e6f0f9] border border-[#66a3d9] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👕</span>
                    <h5 className="text-sm font-bold text-[#002244]">Clothing & Accessories</h5>
                  </div>
                  <ul className="text-xs text-[#003366] space-y-1 ml-8">
                    <li>• Clean, gently used clothing for all ages and genders</li>
                    <li>• Shoes, belts, purses, and accessories</li>
                    <li>• Must be free of stains, tears, and odors</li>
                  </ul>
                </div>

                {/* Furniture */}
                <div className="bg-[#e6f0f9] border border-[#66a3d9] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🪑</span>
                    <h5 className="text-sm font-bold text-[#002244]">Furniture (Under 50 lbs)</h5>
                  </div>
                  <ul className="text-xs text-[#003366] space-y-1 ml-8">
                    <li>• Tables, chairs, dressers, bookshelves</li>
                    <li>• Small sofas and loveseats</li>
                    <li>• Must be clean, assembled, with no broken parts</li>
                    <li>• Free of animal hair, stains, or mildew</li>
                  </ul>
                </div>

                {/* Electronics */}
                <div className="bg-[#e6f0f9] border border-[#66a3d9] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💻</span>
                    <h5 className="text-sm font-bold text-[#002244]">Electronics</h5>
                  </div>
                  <ul className="text-xs text-[#003366] space-y-1 ml-8">
                    <li>• Flat-screen TVs with remotes</li>
                    <li>• Computers, tablets, laptops</li>
                    <li>• Small appliances (toasters, blenders, coffee makers)</li>
                    <li>• Must be in working order with all cords</li>
                  </ul>
                </div>

                {/* Household */}
                <div className="bg-[#e6f0f9] border border-[#66a3d9] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏠</span>
                    <h5 className="text-sm font-bold text-[#002244]">Household Items</h5>
                  </div>
                  <ul className="text-xs text-[#003366] space-y-1 ml-8">
                    <li>• Dishes, glassware, cookware</li>
                    <li>• Linens, towels, curtains</li>
                    <li>• Books, CDs, DVDs, records</li>
                    <li>• Toys, games, puzzles (complete sets)</li>
                  </ul>
                </div>

                {/* Sports */}
                <div className="bg-[#e6f0f9] border border-[#66a3d9] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚽</span>
                    <h5 className="text-sm font-bold text-[#002244]">Sports & Recreation</h5>
                  </div>
                  <ul className="text-xs text-[#003366] space-y-1 ml-8">
                    <li>• Sports equipment and gear</li>
                    <li>• Exercise equipment under 50 lbs</li>
                    <li>• Must be working, clean, and safe to use</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What We Cannot Accept */}
            <div>
              <h4 className="text-sm font-bold text-orange-900 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Items We Cannot Accept
              </h4>
              <div className="space-y-3">
                {/* Furniture Restrictions */}
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🛋️</span>
                    <h5 className="text-sm font-bold text-orange-900">Furniture Restrictions</h5>
                  </div>
                  <ul className="text-xs text-orange-800 space-y-1 ml-8">
                    <li>• Damaged, broken, or stained furniture</li>
                    <li>• Items over 50 lbs</li>
                    <li>• Mattresses, box springs, bed rails</li>
                    <li>• Sleeper sofas, air mattresses, bed pillows</li>
                    <li>• Bean bag chairs</li>
                  </ul>
                </div>

                {/* Electronics */}
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📺</span>
                    <h5 className="text-sm font-bold text-orange-900">Electronics & Appliances</h5>
                  </div>
                  <ul className="text-xs text-orange-800 space-y-1 ml-8">
                    <li>• Non-flat screen TVs or monitors</li>
                    <li>• Large appliances (stoves, refrigerators, washers, dryers)</li>
                    <li>• Gas-powered tools and appliances</li>
                  </ul>
                </div>

                {/* Building Materials */}
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏗️</span>
                    <h5 className="text-sm font-bold text-orange-900">Building Materials</h5>
                  </div>
                  <ul className="text-xs text-orange-800 space-y-1 ml-8">
                    <li>• Windows, doors, garage doors, shutters</li>
                    <li>• Sinks, tubs, toilets, fixtures</li>
                    <li>• Lighting and plumbing fixtures</li>
                    <li>• Lumber, concrete, bricks, stone</li>
                  </ul>
                </div>

                {/* Baby Items */}
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👶</span>
                    <h5 className="text-sm font-bold text-orange-900">Baby Safety Items</h5>
                  </div>
                  <ul className="text-xs text-orange-800 space-y-1 ml-8">
                    <li>• Baby furniture, cribs, strollers, car seats</li>
                    <li>• Highchairs, playpens, changing tables</li>
                    <li>• Items not meeting Consumer Product Safety Standards</li>
                  </ul>
                </div>

                {/* Hazardous */}
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h5 className="text-sm font-bold text-orange-900">Hazardous Materials</h5>
                  </div>
                  <ul className="text-xs text-orange-800 space-y-1 ml-8">
                    <li>• Hazardous materials and paints</li>
                    <li>• Wet, mildewed, or moldy items</li>
                    <li>• Medical supplies and equipment</li>
                    <li>• Cosmetics and personal care products</li>
                    <li>• Food and beverages</li>
                    <li>• Firearms and fireworks</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* General Requirements */}
            <div className="bg-[#e6f0f9] border border-[#66a3d9] rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-[#0053A0] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-[#002244] mb-2">General Requirements</h5>
                  <p className="text-xs text-[#003366] mb-2">All items must be:</p>
                  <ul className="text-xs text-[#003366] space-y-1 ml-4">
                    <li>• Clean and free of stains</li>
                    <li>• In working condition</li>
                    <li>• Free of damaged or missing parts</li>
                    <li>• Safe to use</li>
                    <li>• Complete with all necessary accessories</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-3 text-center">
          <Package className="w-6 h-6 mx-auto mb-1 text-[#0053A0]" />
          <p className="text-lg text-[#0053A0] font-bold">15.2K</p>
          <p className="text-xs text-gray-600">Donations</p>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-3 text-center">
          <Users className="w-6 h-6 mx-auto mb-1 text-[#0053A0]" />
          <p className="text-lg text-[#0053A0] font-bold">8.9K</p>
          <p className="text-xs text-gray-600">Donors</p>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-3 text-center">
          <Heart className="w-6 h-6 mx-auto mb-1 text-[#0053A0]" />
          <p className="text-lg text-[#0053A0] font-bold">$127K</p>
          <p className="text-xs text-gray-600">Impact</p>
        </div>
      </div>
    </div>
  );
}
