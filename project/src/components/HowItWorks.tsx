import React from 'react';
import { Search, UserCheck, Calendar, Heart } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      title: 'Search & Filter',
      description: 'Find the perfect guide based on your interests, preferred language, and location',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: UserCheck,
      title: 'Choose Your Guide',
      description: 'Browse verified profiles, read reviews, and select a guide that matches your needs',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Calendar,
      title: 'Book Experience',
      description: 'Schedule your village experience and pay securely through our platform',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Heart,
      title: 'Enjoy & Connect',
      description: 'Immerse yourself in authentic village life and build lasting connections',
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How VillageStay Works
          </h2>
          <p className="text-xl text-gray-600">
            Your journey to authentic village experiences in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-200">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Village Adventure?
            </h3>
            <p className="text-gray-600 mb-8">
              Join thousands of travelers who have discovered authentic village life through VillageStay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/find-guides')}
                className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors"
              >
                Find Your Guide
              </button>
              <button 
                onClick={() => navigate('/become-guide')}
                className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-full hover:bg-orange-600 hover:text-white transition-colors"
              >
                Become a Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;