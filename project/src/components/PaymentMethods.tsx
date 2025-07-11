import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building, Wallet, Plus, Check, X, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, PaymentMethod } from '../lib/supabase';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'upi' | 'netbanking' | 'wallet',
    provider: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const methodData: any = {
        user_id: user.id,
        type: formData.type,
        is_default: paymentMethods.length === 0, // First method is default
      };

      if (formData.type === 'card') {
        methodData.provider = formData.provider;
        methodData.last_four = formData.cardNumber.slice(-4);
        methodData.metadata = {
          expiry_month: formData.expiryMonth,
          expiry_year: formData.expiryYear,
        };
      } else if (formData.type === 'upi') {
        methodData.upi_id = formData.upiId;
      } else if (formData.type === 'netbanking') {
        methodData.provider = formData.bankName;
        methodData.metadata = {
          account_number: formData.accountNumber.slice(-4),
        };
      }

      const { error } = await supabase
        .from('payment_methods')
        .insert([methodData]);

      if (error) throw error;

      await fetchPaymentMethods();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      // Remove default from all methods
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Set new default
      await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'card',
      provider: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      upiId: '',
      bankName: '',
      accountNumber: '',
    });
  };

  const getPaymentIcon = (type: string, provider?: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-6 w-6" />;
      case 'upi':
        return <Smartphone className="h-6 w-6" />;
      case 'netbanking':
        return <Building className="h-6 w-6" />;
      case 'wallet':
        return <Wallet className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.provider?.toUpperCase()} •••• ${method.last_four}`;
      case 'upi':
        return method.upi_id;
      case 'netbanking':
        return `${method.provider} Bank`;
      case 'wallet':
        return `${method.provider} Wallet`;
      default:
        return 'Payment Method';
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to manage payment methods.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Payment Method
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading payment methods...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border-2 rounded-xl p-6 transition-colors ${
                  method.is_default
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      method.is_default ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getPaymentIcon(method.type, method.provider)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getPaymentLabel(method)}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {method.is_default && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                            Default
                          </span>
                        )}
                        {method.is_verified ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                            Pending Verification
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.is_default && (
                      <button
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="text-orange-600 hover:text-orange-700 px-3 py-1 text-sm font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => deletePaymentMethod(method.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {paymentMethods.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Methods</h3>
                <p className="text-gray-600 mb-6">Add a payment method to start booking experiences.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
                >
                  Add Your First Payment Method
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={addPaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>

                {formData.type === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Provider
                      </label>
                      <select
                        value={formData.provider}
                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Provider</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="rupay">RuPay</option>
                        <option value="amex">American Express</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Month
                        </label>
                        <select
                          value={formData.expiryMonth}
                          onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year
                        </label>
                        <select
                          value={formData.expiryYear}
                          onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        >
                          <option value="">YY</option>
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                              {String(new Date().getFullYear() + i).slice(-2)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.type === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="yourname@paytm"
                      required
                    />
                  </div>
                )}

                {formData.type === 'netbanking' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Bank</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="Axis">Axis Bank</option>
                        <option value="Kotak">Kotak Mahindra Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Account number"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;