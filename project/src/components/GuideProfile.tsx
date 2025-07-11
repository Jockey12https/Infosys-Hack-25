import React, { useState } from 'react';
import { Star, MapPin, Clock, Check, Languages, Calendar, Heart, Share2, MessageCircle, Shield, Award, Camera } from 'lucide-react';

interface GuideProfileProps {
  guide: {
    id: number;
    name: string;
    location: string;
    specialty: string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    languages: string[];
    gender: string;
    image: string;
    verified: boolean;
    availability: string;
    description: string;
    experiences: string[];
    bio: string;
    yearsOfExperience: number;
    totalGuests: number;
    responseTime: string;
    gallery: string[];
    certifications: string[];
    reviews_data: Array<{
      name: string;
      rating: number;
      comment: string;
      date: string;
      avatar: string;
    }>;
  };
}

const GuideProfile: React.FC<GuideProfileProps> = ({ guide }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64">
              <img
                src={guide.image}
                alt={guide.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{guide.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {guide.location}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {guide.rating} ({guide.reviews} reviews)
                  </div>
                </div>
              </div>
              {guide.verified && (
                <div className="absolute top-6 right-6 bg-green-500 text-white p-2 rounded-full">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {guide.specialty}
                  </div>
                  <div className="text-sm text-gray-600">
                    {guide.yearsOfExperience} years experience
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{guide.totalGuests}</div>
                  <div className="text-sm text-gray-600">Guests Hosted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{guide.responseTime}</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{guide.languages.length}</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Languages className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-semibold text-gray-900">Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {guide.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {guide.name}</h3>
                <p className="text-gray-600 leading-relaxed">{guide.bio}</p>
              </div>

              {/* Certifications */}
              {guide.certifications.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <Award className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900">Certifications</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guide.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b">
              <nav className="flex">
                {['overview', 'experiences', 'gallery', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? 'border-b-2 border-orange-600 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Experience</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{guide.description}</p>
                  
                  <h4 className="font-semibold text-gray-900 mb-3">Activities Included</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {guide.experiences.map((exp, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experiences' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Experiences</h3>
                  <div className="space-y-4">
                    {guide.experiences.map((exp, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{exp}</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Hands-on experience with traditional techniques and local knowledge.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Duration: 2-3 hours</span>
                          <span className="font-semibold text-gray-900">₹{guide.hourlyRate}/hour</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Gallery</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {guide.gallery.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden">
                        <img
                          src={photo}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Reviews</h3>
                  <div className="space-y-6">
                    {guide.reviews_data.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{review.name}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900">
                ₹{guide.hourlyRate}
                <span className="text-lg font-normal text-gray-600">/hour</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{guide.availability}</div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Choose time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{guide.hourlyRate} × 3 hours</span>
                  <span>₹{guide.hourlyRate * 3}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Service fee</span>
                  <span>₹{Math.round(guide.hourlyRate * 3 * 0.1)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{guide.hourlyRate * 3 + Math.round(guide.hourlyRate * 3 * 0.1)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
              >
                Book Experience
              </button>

              <button
                type="button"
                className="w-full border-2 border-orange-600 text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Message Guide
              </button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                Your payment is protected by VillageStay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;