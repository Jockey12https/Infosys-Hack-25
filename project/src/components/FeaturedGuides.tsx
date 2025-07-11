import React from 'react';
import { Star, MapPin, Clock, Check, Languages } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

interface FeaturedGuidesProps {
  filters: {
    location: string;
    specialty: string;
    language: string;
    gender: string;
    availability: string;
  };
}

const FeaturedGuides: React.FC<FeaturedGuidesProps> = ({ filters }) => {
  const navigate = useNavigate();

  const guides = [
    {
      id: 1,
      name: 'Kamala Devi',
      location: 'Kumbakonam, Tamil Nadu',
      specialty: 'Traditional Cooking',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 450,
      languages: ['Tamil', 'English', 'Hindi'],
      gender: 'Female',
      image: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      availability: 'Available Today',
      description: 'Learn to cook authentic Tamil cuisine using traditional methods and local ingredients.',
      experiences: ['Sambar Making', 'Idli & Dosa', 'Chutneys', 'Traditional Sweets']
    },
    {
      id: 2,
      name: 'Ravi Kumar',
      location: 'Mysore, Karnataka',
      specialty: 'Sustainable Farming',
      rating: 4.8,
      reviews: 89,
      hourlyRate: 380,
      languages: ['Kannada', 'English'],
      gender: 'Male',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      availability: 'Available Tomorrow',
      description: 'Discover organic farming techniques and sustainable agriculture practices.',
      experiences: ['Organic Farming', 'Composting', 'Seed Saving', 'Crop Rotation']
    },
    {
      id: 3,
      name: 'Meera Sharma',
      location: 'Pushkar, Rajasthan',
      specialty: 'Leaf Weaving',
      rating: 4.9,
      reviews: 156,
      hourlyRate: 420,
      languages: ['Hindi', 'English', 'Rajasthani'],
      gender: 'Female',
      image: 'https://images.pexels.com/photos/1181694/pexels-photo-1181694.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      availability: 'Available Now',
      description: 'Master the traditional art of leaf weaving and create beautiful handicrafts.',
      experiences: ['Basket Weaving', 'Decorative Items', 'Traditional Patterns', 'Natural Dyes']
    },
    {
      id: 4,
      name: 'Arjun Nair',
      location: 'Wayanad, Kerala',
      specialty: 'Toddy Tapping',
      rating: 4.7,
      reviews: 73,
      hourlyRate: 350,
      languages: ['Malayalam', 'English'],
      gender: 'Male',
      image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      availability: 'Available This Week',
      description: 'Experience the ancient art of palm tree tapping and learn about traditional beverages.',
      experiences: ['Palm Climbing', 'Toddy Collection', 'Traditional Drinks', 'Tree Care']
    },
    {
      id: 5,
      name: 'Priya Patel',
      location: 'Sasan Gir, Gujarat',
      specialty: 'Nature Walks',
      rating: 4.8,
      reviews: 94,
      hourlyRate: 400,
      languages: ['Gujarati', 'Hindi', 'English'],
      gender: 'Female',
      image: 'https://images.pexels.com/photos/1181421/pexels-photo-1181421.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      availability: 'Available Today',
      description: 'Explore local wildlife and learn about native plants and ecosystem conservation.',
      experiences: ['Wildlife Spotting', 'Plant Identification', 'Bird Watching', 'Conservation']
    },
    {
      id: 6,
      name: 'Gopal Das',
      location: 'Orchha, Madhya Pradesh',
      specialty: 'Local Storytelling',
      rating: 4.9,
      reviews: 112,
      hourlyRate: 320,
      languages: ['Hindi', 'English', 'Bundelkhandi'],
      gender: 'Male',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
      verified: true,
      availability: 'Available This Evening',
      description: 'Listen to ancient tales and folklore passed down through generations.',
      experiences: ['Historical Tales', 'Local Legends', 'Cultural Stories', 'Traditional Music']
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Local Guides
          </h2>
          <p className="text-xl text-gray-600">
            Meet our verified community guides ready to share their expertise
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
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                  {guide.availability}
                </div>
                {guide.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {guide.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {guide.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-semibold text-gray-900">
                        {guide.rating}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {guide.reviews} reviews
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    {guide.specialty}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {guide.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Languages className="h-4 w-4 mr-2" />
                    {guide.languages.join(', ')}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {guide.experiences.slice(0, 3).map((exp, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {exp}
                      </span>
                    ))}
                    {guide.experiences.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{guide.experiences.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{guide.hourlyRate}
                    <span className="text-sm font-normal text-gray-600">/hour</span>
                  </div>
                  <button 
                    onClick={() => navigate('/find-guides')}
                    className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/find-guides')}
            className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors"
          >
            View All Guides
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuides;