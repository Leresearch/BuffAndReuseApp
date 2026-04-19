import { useState, useEffect } from 'react';
import { Camera, MessageSquare, Package, BarChart3, Menu, X, Users, Heart, ArrowLeftRight, Building2, LogOut, Calendar } from 'lucide-react';
import { ImageScanner } from './components/ImageScanner';
import { ChatBot } from './components/ChatBot';
import { DonationTracker } from './components/DonationTracker';
import { Analytics } from './components/Analytics';
import { WorkSchedule } from './components/WorkSchedule';
import { DonorView } from './components/DonorView';
import { CorporateView } from './components/CorporateView';
import { LoginForm } from './components/LoginForm';
import { AccessibilitySettings, FontSize, ColorScheme, getFontSizeClass, getColorSchemeClasses } from './components/AccessibilitySettings';

type UserRole = 'donor' | 'employee' | 'corporate';

export interface Donation {
  id: string;
  itemName: string;
  category: string;
  condition: string;
  donor: string;
  timestamp: Date;
  status: 'pending' | 'processed' | 'priced';
  weight: number; // in lbs
  accepted: boolean;
}

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<'scanner' | 'chat' | 'tracker' | 'analytics' | 'schedule'>('scanner');
  const [menuOpen, setMenuOpen] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [currentWeight, setCurrentWeight] = useState(0); // Current total weight in lbs
  const maxCapacity = 5000; // Maximum capacity in lbs

  // Accessibility settings
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('fontSize');
    return (saved as FontSize) || 'medium';
  });
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem('colorScheme');
    return (saved as ColorScheme) || 'default';
  });

  // Persist accessibility settings
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
  };

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  const handleRoleSelection = (role: UserRole) => {
    if (role === 'donor') {
      setUserRole(role);
      setIsAuthenticated(true);
    } else {
      setUserRole(role);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    setActiveView('scanner');
    setDonations([]);
    setCurrentWeight(0);
  };

  const addDonation = (itemName: string, category: string, condition: string, weight: number, accepted: boolean) => {
    const newDonation: Donation = {
      id: Date.now().toString(),
      itemName,
      category,
      condition,
      donor: 'Anonymous',
      timestamp: new Date(),
      status: 'pending',
      weight,
      accepted,
    };
    setDonations(prev => [newDonation, ...prev]);
    if (accepted) {
      setCurrentWeight(prev => prev + weight);
    }
  };

  const updateDonation = (id: string, updates: Partial<Donation>) => {
    setDonations(prev => prev.map(donation => {
      if (donation.id === id) {
        const oldWeight = donation.accepted ? donation.weight : 0;
        const updatedDonation = { ...donation, ...updates };
        const newWeight = updatedDonation.accepted ? updatedDonation.weight : 0;

        // Update current weight based on changes
        const weightDiff = newWeight - oldWeight;
        if (weightDiff !== 0) {
          setCurrentWeight(curr => curr + weightDiff);
        }

        return updatedDonation;
      }
      return donation;
    }));
  };

  const deleteDonation = (id: string) => {
    const donation = donations.find(d => d.id === id);
    if (donation && donation.accepted) {
      setCurrentWeight(prev => prev - donation.weight);
    }
    setDonations(prev => prev.filter(d => d.id !== id));
  };

  const employeeNavItems = [
    { id: 'scanner' as const, label: 'Scan', icon: Camera },
    { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
    { id: 'tracker' as const, label: 'Tracker', icon: Package },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  const colorClasses = getColorSchemeClasses(colorScheme);
  const fontClass = getFontSizeClass(fontSize);

  // Role Selection Screen
  if (!userRole) {
    return (
      <>
        <AccessibilitySettings
          fontSize={fontSize}
          colorScheme={colorScheme}
          onFontSizeChange={handleFontSizeChange}
          onColorSchemeChange={handleColorSchemeChange}
        />
        <div className={`w-full h-full max-w-[480px] mx-auto flex items-center justify-center ${colorClasses.primary} ${fontClass}`}>
          <div className="w-full h-full overflow-y-auto scroll-container px-6 py-8 safe-top safe-bottom">
            <div className="flex-shrink-0">
              <div className="text-center mb-6">
                <Package className={`w-14 h-14 mx-auto mb-3 ${colorClasses.primaryText}`} />
                <h1 className={`${colorClasses.primaryText} mb-2 text-xl font-bold`}>Goodwill Tracker</h1>
                <p className={`${colorClasses.primaryText} text-sm`}>Select your role</p>
              </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {/* Donor Card */}
            <button
              onClick={() => handleRoleSelection('donor')}
              className={`${colorClasses.cardBg} rounded-lg p-6 shadow-lg active:shadow-xl transition-all text-left w-full`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 ${colorClasses.primary} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Heart className={`w-6 h-6 ${colorClasses.primaryText}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`${colorClasses.text} text-base font-bold`}>Donor</h3>
                  <p className={`text-xs ${colorClasses.text} opacity-70`}>No login required</p>
                </div>
              </div>
              <p className={`${colorClasses.text} opacity-80 text-sm`}>
                Check what items we need
              </p>
            </button>

            {/* Employee Card */}
            <button
              onClick={() => handleRoleSelection('employee')}
              className={`${colorClasses.cardBg} rounded-lg p-6 shadow-lg active:shadow-xl transition-all text-left w-full`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 ${colorClasses.primary} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Users className={`w-6 h-6 ${colorClasses.primaryText}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`${colorClasses.text} text-base font-bold`}>Employee</h3>
                  <p className={`text-xs ${colorClasses.text} opacity-70`}>🔒 Login required</p>
                </div>
              </div>
              <p className={`${colorClasses.text} opacity-80 text-sm`}>
                Scan donations and track inventory
              </p>
            </button>

            {/* Corporate Card */}
            <button
              onClick={() => handleRoleSelection('corporate')}
              className={`${colorClasses.cardBg} rounded-lg p-6 shadow-lg active:shadow-xl transition-all text-left w-full`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 ${colorClasses.primary} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Building2 className={`w-6 h-6 ${colorClasses.primaryText}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`${colorClasses.text} text-base font-bold`}>Corporate</h3>
                  <p className={`text-xs ${colorClasses.text} opacity-70`}>🔒 Login required</p>
                </div>
              </div>
              <p className={`${colorClasses.text} opacity-80 text-sm`}>
                View analytics and metrics
              </p>
            </button>
          </div>

            <p className={`text-center ${colorClasses.primaryText} mt-6 text-xs`}>
              Employee and Corporate require login
            </p>
          </div>
        </div>
        </div>
      </>
    );
  }

  // Donor View
  if (userRole === 'donor') {
    return (
      <>
        <AccessibilitySettings
          fontSize={fontSize}
          colorScheme={colorScheme}
          onFontSizeChange={handleFontSizeChange}
          onColorSchemeChange={handleColorSchemeChange}
        />
        <div className={`w-full h-full max-w-[480px] mx-auto flex flex-col ${colorClasses.bg} ${fontClass}`}>
          <header className={`${colorClasses.primary} ${colorClasses.primaryText} shadow-md`}>
            <div className="px-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-7 h-7" />
                <div>
                  <h1 className="font-bold text-base">Donor Portal</h1>
                  <p className={`${colorClasses.primaryText} text-xs`}>Make an impact</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-white/20 active:bg-white/30 rounded-lg flex items-center gap-1 transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span className="text-xs">Home</span>
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto scroll-container safe-bottom">
            <DonorView />
          </main>
        </div>
      </>
    );
  }

  // Employee View (Login required)
  if (userRole === 'employee') {
    if (!isAuthenticated) {
      return (
        <>
          <AccessibilitySettings
            fontSize={fontSize}
            colorScheme={colorScheme}
            onFontSizeChange={handleFontSizeChange}
            onColorSchemeChange={handleColorSchemeChange}
          />
          <div className={fontClass}>
            <LoginForm role="employee" onLogin={handleLogin} onBack={handleLogout} fontSize={fontSize} colorScheme={colorScheme} />
          </div>
        </>
      );
    }

    return (
      <>
        <AccessibilitySettings
          fontSize={fontSize}
          colorScheme={colorScheme}
          onFontSizeChange={handleFontSizeChange}
          onColorSchemeChange={handleColorSchemeChange}
        />
        <div className={`w-full h-full max-w-[480px] mx-auto flex flex-col ${colorClasses.bg} ${fontClass}`}>
        <header className={`${colorClasses.primary} ${colorClasses.primaryText} shadow-md`}>
          <div className="px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-7 h-7" />
              <div>
                <h1 className="font-bold text-base">Employee Portal</h1>
                <p className={`${colorClasses.primaryText} text-xs`}>Authenticated</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`px-3 py-2 ${colorClasses.primaryText} bg-white/20 active:bg-white/30 rounded-lg flex items-center gap-1 transition-colors`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Home</span>
            </button>
          </div>

          <nav className={`border-t ${colorClasses.border} opacity-30`}>
            <div className="overflow-x-auto">
              <div className="flex min-w-max">
                {employeeNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors min-w-[80px] ${
                        activeView === item.id
                          ? 'bg-white text-[#0053A0] border-b-2 border-[#0053A0]'
                          : 'text-white hover:bg-white/10 active:bg-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto scroll-container safe-bottom">
          {activeView === 'scanner' && (
            <ImageScanner
              onDonationLogged={addDonation}
              currentWeight={currentWeight}
              maxCapacity={maxCapacity}
            />
          )}
          {activeView === 'schedule' && <WorkSchedule />}
          {activeView === 'tracker' && <DonationTracker donations={donations} currentWeight={currentWeight} maxCapacity={maxCapacity} onUpdate={updateDonation} onDelete={deleteDonation} />}
          {activeView === 'analytics' && <Analytics />}
        </main>
      </div>
      </>
    );
  }

  // Corporate View (Login required) - Desktop
  if (userRole === 'corporate') {
    if (!isAuthenticated) {
      return (
        <>
          <AccessibilitySettings
            fontSize={fontSize}
            colorScheme={colorScheme}
            onFontSizeChange={handleFontSizeChange}
            onColorSchemeChange={handleColorSchemeChange}
          />
          <div className={fontClass}>
            <LoginForm role="corporate" onLogin={handleLogin} onBack={handleLogout} fontSize={fontSize} colorScheme={colorScheme} />
          </div>
        </>
      );
    }
    return (
      <>
        <AccessibilitySettings
          fontSize={fontSize}
          colorScheme={colorScheme}
          onFontSizeChange={handleFontSizeChange}
          onColorSchemeChange={handleColorSchemeChange}
        />
        <div className={`w-full h-full flex flex-col ${colorClasses.bg} ${fontClass}`}>
        <header className={`${colorClasses.primary} ${colorClasses.primaryText} shadow-md`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg">Corporate Portal</h1>
                <p className={`${colorClasses.primaryText} text-sm`}>Analytics Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Home</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scroll-container safe-bottom">
          <CorporateView />
        </main>
      </div>
      </>
    );
  }

  return null;
}
