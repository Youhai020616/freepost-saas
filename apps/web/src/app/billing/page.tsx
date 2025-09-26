'use client';
import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Check, 
  Star, 
  Users, 
  BarChart3, 
  Shield, 
  Plus
} from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'month',
    description: 'Perfect for individuals getting started',
    features: [
      '3 social media accounts',
      '10 scheduled posts per month',
      'Basic analytics',
      'Email support'
    ],
    current: false,
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29,
    period: 'month',
    description: 'Ideal for growing businesses',
    features: [
      '10 social media accounts',
      'Unlimited scheduled posts',
      'Advanced analytics',
      'Team collaboration (5 members)',
      'Priority support',
      'Custom branding'
    ],
    current: true,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For large teams and agencies',
    features: [
      'Unlimited social media accounts',
      'Unlimited scheduled posts',
      'Advanced analytics & reporting',
      'Unlimited team members',
      '24/7 phone support',
      'Custom integrations',
      'Dedicated account manager'
    ],
    current: false,
    popular: false
  }
];

const billingHistory = [
  {
    id: '1',
    date: '2025-01-01',
    description: 'Professional Plan - Monthly',
    amount: 29.00,
    status: 'paid',
    invoice: 'INV-2025-001'
  },
  {
    id: '2',
    date: '2024-12-01',
    description: 'Professional Plan - Monthly',
    amount: 29.00,
    status: 'paid',
    invoice: 'INV-2024-012'
  },
  {
    id: '3',
    date: '2024-11-01',
    description: 'Professional Plan - Monthly',
    amount: 29.00,
    status: 'paid',
    invoice: 'INV-2024-011'
  },
  {
    id: '4',
    date: '2024-10-01',
    description: 'Professional Plan - Monthly',
    amount: 29.00,
    status: 'paid',
    invoice: 'INV-2024-010'
  }
];

export default function BillingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const currentPlan = plans.find(plan => plan.current);

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'yearly' ? Math.round(price * 12 * 0.8) : price;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Billing & Plans</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your subscription and billing information</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Current Plan */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Current Plan</h2>
              <p className="text-slate-600 dark:text-slate-400">You&apos;re currently on the {currentPlan?.name} plan</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${currentPlan?.price}<span className="text-sm font-normal text-slate-500">/month</span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Next billing: Feb 1, 2025</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Team Members</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">3 of 5 used</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Posts This Month</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">47 scheduled</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Accounts Connected</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">6 of 10 used</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                billingPeriod === 'yearly'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                20% off
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border-2 p-6 relative ${
                plan.current
                  ? 'border-blue-500'
                  : plan.popular
                  ? 'border-purple-500'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  ${billingPeriod === 'yearly' ? getDiscountedPrice(plan.price) : plan.price}
                  <span className="text-sm font-normal text-slate-500">
                    /{billingPeriod === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                {billingPeriod === 'yearly' && plan.price > 0 && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Save ${plan.price * 12 - getDiscountedPrice(plan.price)} per year
                  </div>
                )}
                <p className="text-slate-600 dark:text-slate-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.current
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Payment Method</h2>
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Add Payment Method
            </button>
          </div>
          
          <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900 dark:text-slate-100">•••• •••• •••• 4242</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Expires 12/2027</div>
            </div>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Edit
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Billing History</h2>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Description</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Amount</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-500 dark:text-slate-400">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-4 text-slate-900 dark:text-slate-100">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-slate-700 dark:text-slate-300">{item.description}</td>
                    <td className="py-4 text-slate-900 dark:text-slate-100 font-medium">${item.amount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                        <Check className="w-3 h-3" />
                        Paid
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                        <Download className="w-3 h-3" />
                        {item.invoice}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
