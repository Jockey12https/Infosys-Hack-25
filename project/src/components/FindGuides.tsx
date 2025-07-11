import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Languages, Clock, Check, AlertCircle, Loader, Calendar, BookOpen } from 'lucide-react';
import { supabase, Guide } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const FindGuides = () => {
  const location = useLocation();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookingType, setBookingType] = useState<'now' | 'later'>('now');
  const [bookingForm, setBookingForm] = useState({
    booking_date: '',
    booking_time: '',
    duration_hours: 3,
    number_of_guests: 1,
    experience_type: '',
    special_requests: '',
  });
  const [filters, setFilters] = useState({
    location: '',
    specialty: '',
    language: '',
    gender: '',
    minRating: 0,
    maxRate: 1000,
  });

  const { user } = useAuth();

  useEffect(() => {
    // Parse URL parameters on component mount
    const urlParams = new URLSearchParams(location.search);
    const urlFilters = {
      location: urlParams.get('location') || '',
      specialty: urlParams.get('specialty') || '',
      language: urlParams.get('language') || '',
      gender: urlParams.get('gender') || '',
      minRating: Number(urlParams.get('minRating')) || 0,
      maxRate: Number(urlParams.get('maxRate')) || 1000,
    };
    
    // Check if any filters are applied from URL
    const hasFilters = Object.values(urlFilters).some(value => 
      typeof value === 'string' ? value.trim() !== '' : value !== 0 && value !== 1000
    );
    
    if (hasFilters) {
      setFilters(urlFilters);
      setHasSearched(true);
      setShowWelcome(false);
      fetchGuides(urlFilters);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const fetchGuides = async (searchFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting to fetch guides with filters:', searchFilters);
      
      let query = supabase
        .from('guides')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('is_active', true);

      // Apply filters only if they have values
      if (searchFilters.location && searchFilters.location.trim()) {
        const location = searchFilters.location.trim();
        query = query.or(`village.ilike.%${location}%,district.ilike.%${location}%,state.ilike.%${location}%`);
      }

      if (searchFilters.specialty) {
        query = query.contains('specialties', [searchFilters.specialty]);
      }

      if (searchFilters.language) {
        query = query.contains('languages', [searchFilters.language]);
      }

      if (searchFilters.gender) {
        query = query.eq('gender', searchFilters.gender);
      }

      if (searchFilters.minRating > 0) {
        query = query.gte('rating', searchFilters.minRating);
      }

      if (searchFilters.maxRate < 1000) {
        query = query.lte('hourly_rate', searchFilters.maxRate);
      }

      // Order by rating descending
      query = query.order('rating', { ascending: false });

      console.log('Executing query...');
      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Supabase query error:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        return;
      }

      console.log('Query successful. Data received:', data);
      console.log('Number of guides found:', data?.length || 0);

      if (data) {
        setGuides(data);
        console.log('Guides set in state:', data.length);
      } else {
        setGuides([]);
        console.log('No data returned from query');
      }

    } catch (error: any) {
      console.error('Error in fetchGuides:', error);
      setError(error.message || 'Failed to load guides. Please try again.');
    } finally {
      setLoading(false);
      console.log('Fetch guides completed');
    }
  };

  const handleBooking = async (guide: Guide, type: 'now' | 'later') => {
    if (!user) {
      alert('Please sign in to book a guide.');
      return;
    }

    setSelectedGuide(guide);
    setBookingType(type);
    
    if (type === 'now') {
      // For "Book Now", set today's date and current time + 2 hours
      const now = new Date();
      const bookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      
      setBookingForm({
        ...bookingForm,
        booking_date: now.toISOString().split('T')[0],
        booking_time: bookingTime.toTimeString().slice(0, 5),
      });
    } else {
      // For "Schedule Later", clear the form
      setBookingForm({
        ...bookingForm,
        booking_date: '',
        booking_time: '',
      });
    }
    
    setShowBookingModal(true);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedGuide) return;

    setBookingLoading(selectedGuide.id);
    
    try {
      const totalAmount = selectedGuide.hourly_rate * bookingForm.duration_hours;
      
      const { error } = await supabase
        .from('bookings')
        .insert([{
          traveler_id: user.id,
          guide_id: selectedGuide.id,
          booking_date: bookingForm.booking_date,
          booking_time: bookingForm.booking_time,
          duration_hours: bookingForm.duration_hours,
          number_of_guests: bookingForm.number_of_guests,
          experience_type: bookingForm.experience_type || null,
          special_requests: bookingForm.special_requests || null,
          total_amount: totalAmount,
          status: 'pending',
        }]);

      if (error) throw error;

      alert(`Booking ${bookingType === 'now' ? 'confirmed' : 'scheduled'} successfully! You'll receive a confirmation email shortly.`);
      setShowBookingModal(false);
      
      // Reset form
      setBookingForm({
        booking_date: '',
        booking_time: '',
        duration_hours: 3,
        number_of_guests: 1,
        experience_type: '',
        special_requests: '',
      });
      
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setBookingLoading(null);
    }
  };

  const handleSearch = () => {
    console.log('Search triggered with filters:', filters);
    setLoading(true);
    setHasSearched(true);
    setShowWelcome(false);
    fetchGuides(filters);
  };

  const clearFilters = () => {
    console.log('Clearing filters');
    setFilters({
      location: '',
      specialty: '',
      language: '',
      gender: '',
      minRating: 0,
      maxRate: 1000,
    });
    setHasSearched(false);
    setShowWelcome(true);
    setGuides([]);
    setError(null);
    setLoading(false);
  };

  const specialtyOptions = [
    'Sustainable Farming',
    'Traditional Cooking',
    'Toddy Tapping',
    'Leaf Weaving',
    'Nature Walks',
    'Local Storytelling',
    'Handicrafts',
    'Pottery',
    'Organic Gardening',
  ];

  const languageOptions = [
    'Hindi',
    'English',
    'Tamil',
    'Telugu',
    'Kannada',
    'Malayalam',
    'Marathi',
    'Gujarati',
    'Bengali',
    'Punjabi',
    'Rajasthani',
  ];

  console.log('Render - Loading:', loading, 'Error:', error, 'Guides count:', guides.length);

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Local Guide
          </h1>
          <p className="text-xl text-gray-600">
            Connect with verified community guides for authentic village experiences
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Village, district, or state"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
              >
                <option value="">All Specialties</option>
                {specialtyOptions.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              >
                <option value="">All Languages</option>
                {languageOptions.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              >
                <option value="">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Rate (₹/hour)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={filters.maxRate}
                onChange={(e) => setFilters({ ...filters, maxRate: Number(e.target.value) })}
                min="0"
                max="1000"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 text-center">
            <button
              onClick={clearFilters}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {/* <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm">
          <strong>Debug Info:</strong> Loading: {loading.toString()}, Error: {error || 'none'}, Guides: {guides.length}, HasSearched: {hasSearched.toString()}, ShowWelcome: {showWelcome.toString()}
        </div> */}

        {/* Welcome State */}
        {showWelcome && !loading && !hasSearched && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-orange-100 to-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Find Your Perfect Guide?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Use the search filters above to discover local guides who match your interests, 
                preferred language, and location. Each guide is verified and ready to share 
                their village's authentic culture with you.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Choose Location</h3>
                  <p className="text-sm text-gray-600">Search by village, district, or state</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Filter className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Filter by Interest</h3>
                  <p className="text-sm text-gray-600">Find guides with your preferred activities</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Languages className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Select Language</h3>
                  <p className="text-sm text-gray-600">Communicate in your preferred language</p>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    setHasSearched(true);
                    fetchGuides();
                  }}
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
                >
                  Browse All Guides
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Error Loading Guides</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchGuides}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && hasSearched && (
          <div className="text-center py-12">
            <Loader className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
            <p className="text-gray-600 mt-4">Finding guides for you...</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && !showWelcome && (
          <>
            {guides.length > 0 && (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    {hasSearched 
                      ? `Found ${guides.length} guide${guides.length !== 1 ? 's' : ''} matching your criteria`
                      : `Showing all ${guides.length} available guides`
                    }
                  </p>
                </div>
            
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className="relative">
                        <img
                          src={guide.profiles?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=300'}
                          alt={guide.profiles?.full_name || 'Guide'}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                          Available
                        </div>
                        {guide.is_verified && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {guide.profiles?.full_name || 'Local Guide'}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              {guide.village}, {guide.district}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm font-semibold text-gray-900">
                                {guide.rating.toFixed(1)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {guide.total_reviews} reviews
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {guide.specialties.slice(0, 2).map((specialty, index) => (
                              <span
                                key={index}
                                className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                            {guide.specialties.length > 2 && (
                              <span className="text-gray-500 text-sm">
                                +{guide.specialties.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                          {guide.description}
                        </p>

                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Languages className="h-4 w-4 mr-2" />
                            {guide.languages.join(', ')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {guide.years_experience} experience
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{guide.hourly_rate}
                            <span className="text-sm font-normal text-gray-600">/hour</span>
                          </div>
                        </div>

                        {/* Booking Buttons */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleBooking(guide, 'now')}
                            disabled={bookingLoading === guide.id}
                            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium disabled:opacity-50"
                          >
                            {bookingLoading === guide.id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <BookOpen className="h-4 w-4 mr-1" />
                                Book Now
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleBooking(guide, 'later')}
                            disabled={bookingLoading === guide.id}
                            className="flex-1 border-2 border-orange-600 text-orange-600 px-4 py-2 rounded-full hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center text-sm font-medium disabled:opacity-50"
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule Later
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && !error && guides.length === 0 && hasSearched && !showWelcome && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search in a different location.
            </p>
            <button
              onClick={clearFilters}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Clear Filters & Show All
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {bookingType === 'now' ? 'Book Now' : 'Schedule Later'}
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Guide Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedGuide.profiles?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={selectedGuide.profiles?.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedGuide.profiles?.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedGuide.village}, {selectedGuide.district}
                  </p>
                  <p className="text-sm font-medium text-orange-600">
                    ₹{selectedGuide.hourly_rate}/hour
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submitBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.booking_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, booking_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={bookingForm.booking_time}
                    onChange={(e) => setBookingForm({ ...bookingForm, booking_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <select
                    value={bookingForm.duration_hours}
                    onChange={(e) => setBookingForm({ ...bookingForm, duration_hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={5}>5 hours</option>
                    <option value={6}>6 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select
                    value={bookingForm.number_of_guests}
                    onChange={(e) => setBookingForm({ ...bookingForm, number_of_guests: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Type
                </label>
                <select
                  value={bookingForm.experience_type}
                  onChange={(e) => setBookingForm({ ...bookingForm, experience_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select experience</option>
                  {selectedGuide.specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={bookingForm.special_requests}
                  onChange={(e) => setBookingForm({ ...bookingForm, special_requests: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Any special requirements or requests..."
                />
              </div>

              {/* Total Cost */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Cost:</span>
                  <span className="text-xl font-bold text-orange-600">
                    ₹{selectedGuide.hourly_rate * bookingForm.duration_hours}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ₹{selectedGuide.hourly_rate}/hour × {bookingForm.duration_hours} hours
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading === selectedGuide.id}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {bookingLoading === selectedGuide.id ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    `Confirm ${bookingType === 'now' ? 'Booking' : 'Schedule'}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindGuides;