import React from 'react';
import { ArrowRight, Check, Sparkles, Infinity, Star } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import { useAuthStore } from '../store/authStore';
import SignInSection from './SignInSection';

interface LandingPageProps {
  onToolSelect: (tab: string) => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

export default function LandingPage({ onToolSelect, onSignInClick, onSignUpClick }: LandingPageProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSubscribe = async (planId: string, priceId: string) => {
    if (!user) {
      onSignUpClick();
      return;
    }

    try {
      setLoading(planId);
      await createCheckoutSession(priceId, user.id);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const features = [
    {
      title: 'Keyword Analysis',
      description: 'Analyze keyword density, prominence, and distribution across your content.',
      action: () => onToolSelect('keywords')
    },
    {
      title: 'Page Analysis',
      description: 'Get detailed insights into your page structure, meta tags, and SEO elements.',
      action: () => onToolSelect('pages')
    },
    {
      title: 'Topical Authority',
      description: 'Generate comprehensive topic maps to build content authority.',
      action: () => onToolSelect('topical')
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '10',
      priceId: 'plink_1QIkiFLfNrFgU5QrF0IBI3nP',
      description: 'Perfect for bloggers and small websites',
      features: [
        'Basic keyword analysis',
        'Limited page analysis',
        'Basic topical mapping',
        '100 pages per month',
        'Email support'
      ]
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '15',
      priceId: 'plink_1QIkiBLfNrFgU5Qr0KN99LFd',
      description: 'Ideal for growing businesses',
      features: [
        'Advanced keyword analysis',
        'Full page analysis',
        'Basic topical mapping',
        '500 pages per month',
        'Email support'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '20',
      priceId: 'plink_1QIki6LfNrFgU5QrnG5wRiYe',
      description: 'For large websites and agencies',
      features: [
        'Enterprise-grade analysis',
        'Unlimited page analysis',
        'Basic topical mapping',
        'Unlimited pages',
        'Email support'
      ]
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Optimize Your Content
          <span className="text-indigo-600"> Like a Pro</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Comprehensive SEO analysis tools to help you create better content, rank higher, and build topical authority.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            {user ? (
              <button
                onClick={() => onToolSelect('keywords')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={onSignUpClick}
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button
                  onClick={onSignInClick}
                  className="flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Powerful SEO Tools
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <button
                  onClick={user ? feature.action : onSignUpClick}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {user ? 'Try Now' : 'Start Free Trial'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign In Section (shown when not logged in) */}
      {!user && <SignInSection onSignInClick={onSignUpClick} />}

      {/* Rest of the component remains the same */}
    </div>
  );
}