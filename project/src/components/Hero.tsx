import React from 'react';
import { ArrowRight, Users, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Discover Authentic
              <span className="text-orange-600"> Village Life</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              Connect with local guides for genuine cultural experiences. From toddy tapping to sustainable farming, 
              immerse yourself in real village life without the tourist crowds.
            </p>
            
           <div className="mt-8 flex flex-col sm:flex-row gap-4">
  <Link 
    to="/find-guides"
    className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
  >
    Find Your Guide
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>
  <Link 
    to="/become-guide"
    className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
  >
    Become a Guide
  </Link>
</div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Local Guides</div>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Verified Profiles</div>
              </div>
              <div className="text-center">
                <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Villages</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Village life"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Guide"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">Ravi Kumar</div>
                  <div className="text-sm text-gray-600">Farming Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;