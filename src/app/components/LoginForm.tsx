import { useState } from 'react';
import { Lock, Mail, ArrowLeft, Users, Building2, AlertCircle } from 'lucide-react';
import { FontSize, ColorScheme, getFontSizeClass, getColorSchemeClasses } from './AccessibilitySettings';

interface LoginFormProps {
  role: 'employee' | 'corporate';
  onLogin: (success: boolean) => void;
  onBack: () => void;
  fontSize?: FontSize;
  colorScheme?: ColorScheme;
}

export function LoginForm({ role, onLogin, onBack, fontSize = 'medium', colorScheme = 'default' }: LoginFormProps) {
  const fontClass = getFontSizeClass(fontSize);
  const colorClasses = getColorSchemeClasses(colorScheme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials for testing
    const validCredentials = {
      employee: { email: 'employee@goodwill.org', password: 'employee123' },
      corporate: { email: 'corporate@goodwill.org', password: 'corporate123' },
    };

    if (
      email === validCredentials[role].email &&
      password === validCredentials[role].password
    ) {
      onLogin(true);
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const roleConfig = {
    employee: {
      icon: Users,
      title: 'Employee Portal',
      gradient: 'from-[#0053A0] to-[#0053A0]',
      buttonColor: 'bg-[#0053A0] hover:bg-[#003d7a]',
      demoEmail: 'employee@goodwill.org',
      demoPassword: 'employee123',
    },
    corporate: {
      icon: Building2,
      title: 'Corporate Portal',
      gradient: 'from-[#0053A0] to-[#0053A0]',
      buttonColor: 'bg-[#0053A0] hover:bg-[#003d7a]',
      demoEmail: 'corporate@goodwill.org',
      demoPassword: 'corporate123',
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className={`w-full h-full max-w-[480px] mx-auto flex items-center justify-center ${colorClasses.bg} ${fontClass}`}>
      <div className="w-full h-full overflow-y-auto scroll-container px-6 py-8 safe-top safe-bottom flex flex-col justify-center">
        <div className="flex-shrink-0">
          {/* Back Button */}
          <button
            onClick={onBack}
            className={`mb-4 flex items-center gap-2 px-4 py-2 ${colorClasses.cardBg} rounded-lg shadow-md ${colorClasses.text} active:shadow-lg transition-all`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">← Back to Home</span>
          </button>

          {/* Login Card */}
          <div className={`${colorClasses.cardBg} rounded-2xl shadow-xl p-6`}>
            {/* Header */}
            <div className="text-center mb-6">
              <div className={`w-14 h-14 ${colorClasses.primary} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-7 h-7 ${colorClasses.primaryText}`} />
              </div>
              <h3 className={`mb-1 text-lg font-semibold ${colorClasses.text}`}>{config.title}</h3>
              <p className={`${colorClasses.text} opacity-70 text-sm`}>Sign in to continue</p>
            </div>

            {/* Demo Credentials Info */}
            <div className={`${colorClasses.secondary} ${colorClasses.border} border rounded-lg p-3 mb-4`}>
            <p className={`text-sm ${colorClasses.text} mb-2`}><strong>Demo Credentials:</strong></p>
            <p className={`text-sm ${colorClasses.text}`}>Email: <code className={`${colorClasses.secondary} px-2 py-1 rounded`}>{config.demoEmail}</code></p>
            <p className={`text-sm ${colorClasses.text}`}>Password: <code className={`${colorClasses.secondary} px-2 py-1 rounded`}>{config.demoPassword}</code></p>
          </div>

            {/* Error Message */}
            {error && (
              <div className={`${colorClasses.secondary} ${colorClasses.border} border rounded-lg p-3 mb-4 flex items-start gap-3`}>
                <AlertCircle className={`w-5 h-5 ${colorClasses.text} flex-shrink-0 mt-0.5`} />
                <p className={`text-sm ${colorClasses.text}`}>{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm ${colorClasses.text} mb-2`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colorClasses.text} opacity-50`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@goodwill.org"
                    className={`w-full pl-12 pr-4 py-3 border ${colorClasses.border} ${colorClasses.bg} ${colorClasses.text} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0]`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className={`block text-sm ${colorClasses.text} mb-2`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colorClasses.text} opacity-50`} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-4 py-3 border ${colorClasses.border} ${colorClasses.bg} ${colorClasses.text} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0]`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 ${colorClasses.primary} ${colorClasses.primaryText} rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 text-center space-y-2">
              <p className={`text-xs ${colorClasses.text} opacity-70`}>
                Secure access for authorized personnel only
              </p>
              <button
                onClick={onBack}
                className={`text-sm ${colorClasses.text} active:underline transition-colors`}
              >
                Return to main page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
