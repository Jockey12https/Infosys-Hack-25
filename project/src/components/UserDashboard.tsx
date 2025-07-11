import React, { useState, useEffect } from 'react';
import { User, CreditCard, History, Settings, MapPin, Star, Calendar, Heart, MessageCircle, Award, Shield, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Booking, PaymentMethod, Transaction } from '../lib/supabase';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });

  const { user, profile, updateProfile } = useAuth();

  // Helper function to check if user is a guide by checking the guides table
  const checkIfUserIsGuide = () => {
    // This will be checked in the useEffect
    return false;
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      checkGuideStatus();
    }
  }, [user]);

  const checkGuideStatus = async () => {
    if (!user) return;
    
    try {
      const { data: guideData } = await supabase
        .from('guides')
        .select('id, is_active')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
        
      // If guide profile exists, update the local state
      if (guideData) {
        console.log('Guide profile found:', guideData);
      }
    } catch (error) {
      console.log('No guide profile found or error:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch bookings
      const { data: bookingData } = await supabase
        .from('bookings')
        .select(`
          *,
          guides (
            *,
            profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('traveler_id', user?.id)
        .order('created_at', { ascending: false });

      setBookings(bookingData || []);

      // Fetch payment methods
      const { data: paymentData } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      setPaymentMethods(paymentData || []);

      // Fetch transactions
      const { data: transactionData } = await supabase
        .from('transactions')
        .select(`
          *,
          bookings (
            booking_date,
            guides (
              profiles (
                full_name
              )
            )
          )
        `)
        .eq('payer_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(transactionData || []);

      // Calculate stats
      const totalBookings = bookingData?.length || 0;
      const upcomingBookings = bookingData?.filter(b => 
        new Date(b.booking_date) > new Date() && b.status !== 'cancelled'
      ).length || 0;
      const completedBookings = bookingData?.filter(b => b.status === 'completed').length || 0;
      const totalSpent = transactionData?.reduce((sum, t) => 
        t.status === 'completed' ? sum + t.amount : sum, 0) || 0;

      setStats({
        totalBookings,
        upcomingBookings,
        completedBookings,
        totalSpent: totalSpent / 100, // Convert from paise
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'transactions', label: 'Transaction History', icon: History },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your bookings, payments, and profile</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-orange-600 text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Guide Dashboard Access */}
              {/*(profile?.user_type === 'guide' || checkIfUserIsGuide()) && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">🎯 Guide Dashboard Available!</h3>
                      <p className="text-orange-100">
                        Manage your bookings, view earnings, and connect with travelers.
                      </p>
                    </div>
                    <a
                      href="/guide-dashboard"
                      className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Open Guide Dashboard
                    </a>
                  </div>
                </div>
              )*/}
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome back, {profile?.full_name}!</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Booking with {booking.guides?.profiles?.full_name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(booking.booking_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                    <div className="space-y-3">
                      <a
                        href="/find-guides"
                        className="block w-full bg-orange-600 text-white text-center py-2 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Find New Guides
                      </a>
                      <a
                        href="/community"
                        className="block w-full border-2 border-orange-600 text-orange-600 text-center py-2 rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
                      >
                        Join Community
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={booking.guides?.profiles?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={booking.guides?.profiles?.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {booking.guides?.profiles?.full_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {booking.guides?.village}, {booking.guides?.district}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <span className="ml-2 font-medium">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <span className="ml-2 font-medium">{booking.booking_time}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <span className="ml-2 font-medium">₹{booking.total_amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bookings yet. Start exploring!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <a
                  href="/payment-methods"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Manage Payment Methods
                </a>
              </div>
              {paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.slice(0, 3).map((method) => (
                    <div key={method.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-6 w-6 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {method.type === 'card' ? `•••• ${method.last_four}` : method.upi_id}
                            </p>
                            <p className="text-sm text-gray-600">{method.provider}</p>
                          </div>
                        </div>
                        {method.is_default && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No payment methods added yet.</p>
                  <a
                    href="/payment-methods"
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    Add Payment Method
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <a
                  href="/transactions"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  View All
                </a>
              </div>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Payment to {transaction.bookings?.guides?.profiles?.full_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">-₹{transaction.amount / 100}</p>
                          <p className="text-xs text-gray-500">{transaction.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile?.full_name || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile?.phone || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Add your phone number"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={profile?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={profile?.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Change Photo
                      </button>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Account Security</h4>
                        <p className="text-sm text-blue-800 mt-1">
                          Your account is secured with email authentication. 
                          Consider enabling two-factor authentication for extra security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;