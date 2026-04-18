import { useState } from 'react';
import { Settings, X, Type, Palette } from 'lucide-react';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type ColorScheme = 'default' | 'high-contrast' | 'dark' | 'light';

interface AccessibilitySettingsProps {
  fontSize: FontSize;
  colorScheme: ColorScheme;
  onFontSizeChange: (size: FontSize) => void;
  onColorSchemeChange: (scheme: ColorScheme) => void;
}

export function AccessibilitySettings({
  fontSize,
  colorScheme,
  onFontSizeChange,
  onColorSchemeChange,
}: AccessibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const fontSizes: { value: FontSize; label: string; example: string }[] = [
    { value: 'small', label: 'Small', example: '14px' },
    { value: 'medium', label: 'Medium (Default)', example: '16px' },
    { value: 'large', label: 'Large', example: '18px' },
    { value: 'extra-large', label: 'Extra Large', example: '22px' },
  ];

  const colorSchemes: { value: ColorScheme; label: string; description: string }[] = [
    { value: 'default', label: 'Default', description: 'Blue & brown color palette' },
    { value: 'high-contrast', label: 'High Contrast', description: 'Black & white for maximum readability' },
    { value: 'dark', label: 'Dark Mode', description: 'Dark background, light text' },
    { value: 'light', label: 'Light Mode', description: 'Extra light background, dark text' },
  ];

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 w-12 h-12 bg-[#0053A0] text-white rounded-full shadow-lg hover:bg-[#003d7a] active:bg-[#003d7a] transition-all flex items-center justify-center"
        style={{
          top: 'max(1rem, env(safe-area-inset-top))',
          right: 'max(1rem, env(safe-area-inset-right))'
        }}
        aria-label="Accessibility Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-end p-4" style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))'
        }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto scroll-container">
            {/* Header */}
            <div className="sticky top-0 bg-[#0053A0] text-white p-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6" />
                <h2 className="text-lg font-bold">Accessibility Settings</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-[#003d7a] rounded p-1"
                aria-label="Close settings"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Font Size Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-5 h-5 text-[#0053A0]" />
                  <h3 className="text-lg font-bold text-gray-900">Font Size</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Adjust text size for better readability
                </p>
                <div className="space-y-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => onFontSizeChange(size.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        fontSize === size.value
                          ? 'border-[#0053A0] bg-[#e6f0f9]'
                          : 'border-gray-300 hover:border-[#99c2e6]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{size.label}</span>
                        <span className="text-sm text-gray-600">{size.example}</span>
                      </div>
                      {fontSize === size.value && (
                        <div className="mt-1 text-sm text-[#0053A0] font-medium">✓ Currently selected</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Scheme Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-[#0053A0]" />
                  <h3 className="text-lg font-bold text-gray-900">Color Scheme</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a color scheme that works best for you
                </p>
                <div className="space-y-2">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.value}
                      onClick={() => onColorSchemeChange(scheme.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        colorScheme === scheme.value
                          ? 'border-[#0053A0] bg-[#e6f0f9]'
                          : 'border-gray-300 hover:border-[#99c2e6]'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{scheme.label}</div>
                      <div className="text-sm text-gray-600">{scheme.description}</div>
                      {colorScheme === scheme.value && (
                        <div className="mt-1 text-sm text-[#0053A0] font-medium">✓ Currently selected</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-[#e6f0f9] border border-[#99c2e6] rounded-lg p-4">
                <p className="text-sm text-[#004080]">
                  <strong>Note:</strong> Your preferences will be saved and applied across all pages of the application.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] font-semibold transition-all"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper function to get font size class
export function getFontSizeClass(size: FontSize): string {
  const sizeMap = {
    'small': 'text-sm',
    'medium': 'text-base',
    'large': 'text-lg',
    'extra-large': 'text-xl',
  };
  return sizeMap[size];
}

// Helper function to get color scheme classes
export function getColorSchemeClasses(scheme: ColorScheme) {
  const schemes = {
    default: {
      bg: 'bg-[#e6f0f9]',
      text: 'text-gray-900',
      primary: 'bg-[#0053A0]',
      primaryText: 'text-white',
      secondary: 'bg-[#f5f0ed]',
      border: 'border-[#99c2e6]',
      cardBg: 'bg-white',
    },
    'high-contrast': {
      bg: 'bg-white',
      text: 'text-black',
      primary: 'bg-black',
      primaryText: 'text-white',
      secondary: 'bg-gray-200',
      border: 'border-black',
      cardBg: 'bg-white',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      primary: 'bg-gray-800',
      primaryText: 'text-white',
      secondary: 'bg-gray-700',
      border: 'border-gray-600',
      cardBg: 'bg-gray-800',
    },
    light: {
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      primary: 'bg-gray-300',
      primaryText: 'text-gray-900',
      secondary: 'bg-gray-100',
      border: 'border-gray-300',
      cardBg: 'bg-white',
    },
  };
  return schemes[scheme];
}
