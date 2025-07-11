import React from 'react';
import { Search, MapPin, Calendar, Filter } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

interface GuideSearchProps {
  filters: {
    location: string;
    specialty: string;
    language: string;
    gender: string;
    availability: string;
  };
  setFilters: (filters: any) => void;
}

const GuideSearch: React.FC<GuideSearchProps> = ({ filters, setFilters }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to find-guides page with filters as URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/find-guides?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-white" id="guides">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Local Guide
          </h2>
          <p className="text-xl text-gray-600">
            Filter by specialty, language, and availability to find the ideal guide for your village experience
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter village or region"
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
                <option value="farming">Sustainable Farming</option>
                <option value="toddy-tapping">Toddy Tapping</option>
                <option value="weaving">Leaf Weaving</option>
                <option value="cooking">Traditional Cooking</option>
                <option value="storytelling">Local Storytelling</option>
                <option value="nature-walks">Nature Walks</option>
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
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="kannada">Kannada</option>
                <option value="malayalam">Malayalam</option>
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
                Availability
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideSearch;