import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, MessageCircle, Star, MapPin, Phone, Mail, AlertCircle, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Booking, Guide } from '../lib/supabase';

const GuideDashboard = () => {
  // All hooks must be at the top level - never inside conditions
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guideProfile, setGuideProfile] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hasGuideProfile, setHasGuideProfile] = useState(false);
  const [checkingGuideStatus, setCheckingGuideStatus] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
  });

  const { user, profile } = useAuth();

  // Check if user has guide profile
  const checkIfUserIsGuide = async () => {
    if (!user) return false;
    
    try {
      const { data } = await supabase
        .from('guides')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
        
      return !!data;
    } catch (error) {
      console.error('Error checking guide status:', error);
      return false;
    }
  };

  const fetchGuideData = async () => {
    if (!user) return;
    
    try {
      // Get guide profile
      const { data: guideData, error: guideError } = await supabase
        .from('guides')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (guideError) throw guideError;
      setGuideProfile(guideData);

      if (!guideData) {
        setLoading(false);
        return;
      }

      // Fetch bookings for this guide
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:traveler_id (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('guide_id', guideData.id)
        .order('created_at', { ascending: false });

      if (bookingError) throw bookingError;
      setBookings(bookingData || []);

      // Calculate stats
      const totalBookings = bookingData?.length || 0;
      const pendingBookings = bookingData?.filter(b => b.status === 'pending').length || 0;
      const confirmedBookings = bookingData?.filter(b => b.status === 'confirmed').length || 0;
      const completedBookings = bookingData?.filter(b => b.status === 'completed').length || 0;
      const totalEarnings = bookingData?.reduce((sum, b) => 
        b.status === 'completed' ? sum + b.total_amount : sum, 0) || 0;

      setStats({
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalEarnings,
      });

    } catch (error) {
      console.error('Error fetching guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check guide status on component mount
  useEffect(() => {
    const checkGuideStatus = async () => {
      if (user) {
        const isGuide = await checkIfUserIsGuide();
        setHasGuideProfile(isGuide);
      }
      setCheckingGuideStatus(false);
    };
    
    checkGuideStatus();
  }, [user]);

  // Fetch guide data when user and guide status are confirmed
  useEffect(() => {
    if (user && (profile?.user_type === 'guide' || hasGuideProfile) && !checkingGuideStatus) {
      fetchGuideData();
    } else if (!checkingGuideStatus) {
      setLoading(false);
    }
  }, [user, profile, hasGuideProfile, checkingGuideStatus]);

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh bookings
      await fetchGuideData();
      
      alert(`Booking ${status} successfully!`);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking. Please try again.');
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <Star className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Show loading while checking guide status
  if (checkingGuideStatus || loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading guide dashboard...</p>
      </div>
    );
  }

  // Show sign-in prompt if no user
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to access the guide dashboard.</p>
      </div>
    );
  }

  // Show access denied if not a guide
  if (profile?.user_type !== 'guide' && !hasGuideProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">This dashboard is only available for guides.</p>
      </div>
    );
  }

  // Show registration prompt if no guide profile
  if (!guideProfile) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Guide Profile Not Found</h3>
        <p className="text-gray-600 mb-6">Complete your guide registration to access this dashboard.</p>
        <a
          href="/become-guide"
          className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
        >
          Complete Registration
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Guide Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your bookings and connect with travelers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completedBookings}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Booking Requests</h2>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={booking.profiles?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={booking.profiles?.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {booking.profiles?.full_name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {booking.profiles?.email}
                      </div>
                      {booking.profiles?.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {booking.profiles.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Date & Time:</span>
                  <p className="font-medium">
                    {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Duration:</span>
                  <p className="font-medium">{booking.duration_hours} hours</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Guests:</span>
                  <p className="font-medium">{booking.number_of_guests}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Amount:</span>
                  <p className="font-medium text-green-600">₹{booking.total_amount}</p>
                </div>
              </div>

              {booking.experience_type && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Experience Type:</span>
                  <p className="font-medium">{booking.experience_type}</p>
                </div>
              )}

              {booking.special_requests && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Special Requests:</span>
                  <p className="text-gray-700">{booking.special_requests}</p>
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    className="border-2 border-red-600 text-red-600 px-6 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </button>
                  <button className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-colors flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </button>
                </div>
              )}

              {booking.status === 'confirmed' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Traveler
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    className="border-2 border-red-600 text-red-600 px-6 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No Bookings Yet' : `No ${filter} Bookings`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Your booking requests will appear here once travelers start booking your services.'
                  : `No bookings with ${filter} status found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;