import React, { useState } from 'react';
import { Clock, Users, MapPin, Star, Calendar, Leaf, Wheat, Palette, Utensils } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const LocalActivities = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activities = [
    {
      id: 1,
      title: 'Traditional Toddy Tapping Experience',
      category: 'traditional',
      host: 'Arjun Nair',
      location: 'Wayanad, Kerala',
      duration: '3-4 hours',
      maxGuests: 4,
      price: 350,
      rating: 4.8,
      reviews: 23,
      image: 'https://www.keralatourism.org/responsible-tourism/packages/uploads/a-day-with-farmers.jpg',
      description: 'Learn the ancient art of palm tree climbing and toddy collection. Experience traditional fermentation methods.',
      includes: ['Palm climbing demonstration', 'Toddy tasting', 'Traditional breakfast', 'Cultural stories'],
      difficulty: 'Moderate',
      languages: ['Malayalam', 'English'],
      nextAvailable: 'Tomorrow 6:00 AM'
    },
    {
      id: 2,
      title: 'Sustainable Organic Farming',
      category: 'farming',
      host: 'Ravi Kumar',
      location: 'Mysore, Karnataka',
      duration: '4-5 hours',
      maxGuests: 6,
      price: 380,
      rating: 4.9,
      reviews: 41,
      image: 'https://ik.imagekit.io/8vvkoi3dt/Urban%20Garden%20in%20Golden%20Sunlight.png?updatedAt=1752261619781',
      description: 'Work alongside local farmers using traditional organic methods. Learn composting and natural pest control.',
      includes: ['Hands-on farming', 'Composting workshop', 'Organic lunch', 'Seeds to take home'],
      difficulty: 'Easy',
      languages: ['Kannada', 'English', 'Hindi'],
      nextAvailable: 'Today 7:00 AM'
    },
    {
      id: 3,
      title: 'Leaf Weaving & Natural Crafts',
      category: 'crafts',
      host: 'Meera Sharma',
      location: 'Pushkar, Rajasthan',
      duration: '2-3 hours',
      maxGuests: 8,
      price: 420,
      rating: 4.7,
      reviews: 67,
      image: 'https://bloomandgrow.in/wp-content/uploads/2017/07/Image7.jpg',
      description: 'Master traditional leaf weaving techniques. Create beautiful baskets and decorative items using natural materials.',
      includes: ['Leaf preparation', 'Weaving techniques', 'Take home crafts', 'Tea & snacks'],
      difficulty: 'Easy',
      languages: ['Hindi', 'English', 'Rajasthani'],
      nextAvailable: 'Today 2:00 PM'
    },
    {
      id: 4,
      title: 'Village Cooking with Wood Fire',
      category: 'cooking',
      host: 'Kamala Devi',
      location: 'Kumbakonam, Tamil Nadu',
      duration: '3-4 hours',
      maxGuests: 5,
      price: 450,
      rating: 4.9,
      reviews: 89,
      image: 'https://as1.ftcdn.net/jpg/03/90/38/70/1000_F_390387017_sXJm4kOswX8rN96GKMjcVP7LuF0dwzhf.jpg',
      description: 'Cook authentic Tamil cuisine using traditional wood-fired stoves. Learn family recipes passed down generations.',
      includes: ['Market visit', 'Traditional cooking', 'Full meal', 'Recipe cards'],
      difficulty: 'Easy',
      languages: ['Tamil', 'English', 'Hindi'],
      nextAvailable: 'Tomorrow 9:00 AM'
    },
    {
      id: 5,
      title: 'Village Storytelling & Folk Music',
      category: 'cultural',
      host: 'Gopal Das',
      location: 'Orchha, Madhya Pradesh',
      duration: '2 hours',
      maxGuests: 12,
      price: 320,
      rating: 4.8,
      reviews: 34,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/India_village_musicians.jpg/500px-India_village_musicians.jpg',
      description: 'Listen to ancient tales and folklore while enjoying traditional music. Learn about local history and legends.',
      includes: ['Folk stories', 'Traditional music', 'Local snacks', 'Cultural insights'],
      difficulty: 'Easy',
      languages: ['Hindi', 'English', 'Bundelkhandi'],
      nextAvailable: 'Today 6:00 PM'
    },
    {
      id: 6,
      title: 'Pottery & Clay Crafts Workshop',
      category: 'crafts',
      host: 'Lakshmi Bai',
      location: 'Khurja, Uttar Pradesh',
      duration: '3 hours',
      maxGuests: 6,
      price: 390,
      rating: 4.6,
      reviews: 28,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQru200SXnsHU42S_bUz3PMLTZmbZiiFumGaGnYCgL9lVPjOHD12k7PIVFY6hpYL0_K5Pg&usqp=CAU',
      description: 'Learn traditional pottery techniques on the potter\'s wheel. Create your own clay items to take home.',
      includes: ['Pottery wheel session', 'Clay preparation', 'Finished pottery', 'Refreshments'],
      difficulty: 'Moderate',
      languages: ['Hindi', 'English'],
      nextAvailable: 'Tomorrow 10:00 AM'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Activities', icon: MapPin },
    { id: 'farming', label: 'Farming', icon: Wheat },
    { id: 'traditional', label: 'Traditional', icon: Leaf },
    { id: 'crafts', label: 'Crafts', icon: Palette },
    { id: 'cooking', label: 'Cooking', icon: Utensils },
    { id: 'cultural', label: 'Cultural', icon: Users }
  ];

  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Real Village Activities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participate in authentic daily activities hosted by local community members. 
            No tours, no packages - just genuine cultural exchange.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
              }`}
            >
              <category.icon className="h-5 w-5 mr-2" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                  {activity.nextAvailable}
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {activity.difficulty}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {activity.title}
                  </h3>
                  <div className="flex items-center ml-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-semibold text-gray-900">
                      {activity.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {activity.location}
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {activity.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {activity.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Max {activity.maxGuests} guests
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">What's included:</p>
                  <div className="flex flex-wrap gap-1">
                    {activity.includes.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                      >
                        {item}
                      </span>
                    ))}
                    {activity.includes.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{activity.includes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{activity.price}
                      <span className="text-sm font-normal text-gray-600">/person</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.reviews} reviews
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/find-guides')}
                    className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors"
                  >
                    Join Activity
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*<div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
          <button
            className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            onClick={() => navigate('/find-guides')}
          >
            Browse All Local Guides
          </button>
        </div>*/}
      </div>
    </section>
  );
};

export default LocalActivities;