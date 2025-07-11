import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Users, CreditCard, Building, Smartphone, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, MerchantAccount, Payout, Transaction } from '../lib/supabase';

const MerchantDashboard = () => {
  const [merchantAccount, setMerchantAccount] = useState<MerchantAccount | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    completedBookings: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountForm, setAccountForm] = useState({
    account_type: 'bank_account' as 'bank_account' | 'upi',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    upi_id: '',
  });

  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile?.user_type === 'guide') {
      fetchMerchantData();
    }
  }, [user, profile]);

  const fetchMerchantData = async () => {
    try {
      // Get guide ID
      const { data: guideData } = await supabase
        .from('guides')
        .select('id')
        .eq('user_id', user?.id)
        .limit(1)
        .maybeSingle();

      if (!guideData) return;

      // Fetch merchant account
      const { data: merchantData } = await supabase
        .from('merchant_accounts')
        .select('*')
        .eq('guide_id', guideData.id)
        .maybeSingle();

      setMerchantAccount(merchantData);

      // Fetch payouts
      const { data: payoutData } = await supabase
        .from('payouts')
        .select('*')
        .eq('guide_id', guideData.id)
        .order('created_at', { ascending: false });

      setPayouts(payoutData || []);

      // Fetch transactions
      const { data: transactionData } = await supabase
        .from('transactions')
        .select(`
          *,
          bookings (
            booking_date,
            number_of_guests
          )
        `)
        .eq('payee_id', user?.id)
        .order('created_at', { ascending: false });

      setTransactions(transactionData || []);

      // Calculate stats
      const totalEarnings = transactionData?.reduce((sum, t) => 
        t.status === 'completed' ? sum + (t.net_amount || 0) : sum, 0) || 0;
      
      const pendingPayouts = payoutData?.reduce((sum, p) => 
        p.status === 'pending' ? sum + p.amount : sum, 0) || 0;

      const completedBookings = transactionData?.filter(t => 
        t.status === 'completed' && t.type === 'booking_payment').length || 0;

      setStats({
        totalEarnings: totalEarnings / 100, // Convert from paise
        pendingPayouts: pendingPayouts / 100,
        completedBookings,
        averageRating: 4.8, // This would come from bookings/reviews
      });

    } catch (error) {
      console.error('Error fetching merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMerchantAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data: guideData } = await supabase
        .from('guides')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!guideData) throw new Error('Guide profile not found');

      const { error } = await supabase
        .from('merchant_accounts')
        .insert([{
          guide_id: guideData.id,
          ...accountForm,
        }]);

      if (error) throw error;

      await fetchMerchantData();
      setShowAccountForm(false);
    } catch (error) {
      console.error('Error creating merchant account:', error);
    }
  };

  if (!user || profile?.user_type !== 'guide') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">This dashboard is only available for guides.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading merchant dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your earnings and payment settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.pendingPayouts.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Merchant Account */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Account</h2>
          
          {merchantAccount ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    {merchantAccount.account_type === 'bank_account' ? (
                      <Building className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {merchantAccount.account_type === 'bank_account' 
                        ? `${merchantAccount.bank_name} Bank`
                        : 'UPI Account'
                      }
                    </h3>
                    <p className="text-sm text-gray-600">
                      {merchantAccount.account_type === 'bank_account'
                        ? `•••• ${merchantAccount.account_number?.slice(-4)}`
                        : merchantAccount.upi_id
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {merchantAccount.is_verified ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {merchantAccount.verification_status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Account</h3>
              <p className="text-gray-600 mb-6">Add a payment account to receive your earnings.</p>
              <button
                onClick={() => setShowAccountForm(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
              >
                Add Payment Account
              </button>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Earnings</h2>
          
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Booking Payment</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +₹{(transaction.net_amount || 0) / 100}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAccountForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Payment Account</h2>
            
            <form onSubmit={createMerchantAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={accountForm.account_type}
                  onChange={(e) => setAccountForm({ ...accountForm, account_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="bank_account">Bank Account</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              {accountForm.account_type === 'bank_account' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={accountForm.bank_name}
                      onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountForm.account_number}
                      onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={accountForm.ifsc_code}
                      onChange={(e) => setAccountForm({ ...accountForm, ifsc_code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={accountForm.account_holder_name}
                      onChange={(e) => setAccountForm({ ...accountForm, account_holder_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={accountForm.upi_id}
                    onChange={(e) => setAccountForm({ ...accountForm, upi_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="yourname@paytm"
                    required
                  />
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAccountForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;