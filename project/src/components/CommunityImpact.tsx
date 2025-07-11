import React from 'react';
import { Users, Heart, Coins, TreePine, Home, Award } from 'lucide-react';

const CommunityImpact = () => {
  const impactStats = [
    {
      icon: Users,
      value: '2,500+',
      label: 'Local Guides Empowered',
      description: 'Community members earning fair income'
    },
    {
      icon: Coins,
      value: '₹45L+',
      label: 'Direct Income Generated',
      description: 'Money flowing directly to villages'
    },
    {
      icon: Home,
      value: '150+',
      label: 'Villages Connected',
      description: 'Rural communities on the platform'
    },
    {
      icon: TreePine,
      value: '85%',
      label: 'Sustainable Activities',
      description: 'Eco-friendly cultural experiences'
    }
  ];

  const beneficiaries = [
    {
      title: 'Local Guides',
      percentage: 70,
      description: 'Direct payment for guiding services',
      color: 'bg-green-500'
    },
    {
      title: 'Village Council',
      percentage: 15,
      description: 'Community development fund',
      color: 'bg-blue-500'
    },
    {
      title: 'Activity Hosts',
      percentage: 10,
      description: 'Farmers, artisans, storytellers',
      color: 'bg-orange-500'
    },
    {
      title: 'Platform Fee',
      percentage: 5,
      description: 'Minimal operational costs',
      color: 'bg-gray-400'
    }
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Empowering Rural Communities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every booking directly supports local families and village development. 
            See how your travel creates lasting positive impact.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Income Distribution */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Transparent Income Distribution
          </h3>
          <p className="text-gray-600 text-center mb-8">
            95% of your payment goes directly to the local community
          </p>
          
          <div className="space-y-6">
            {beneficiaries.map((beneficiary, index) => (
              <div key={index} className="flex items-center">
                <div className="w-1/4">
                  <div className="font-semibold text-gray-900">{beneficiary.title}</div>
                  <div className="text-sm text-gray-600">{beneficiary.description}</div>
                </div>
                <div className="w-1/2 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full ${beneficiary.color} transition-all duration-1000`}
                      style={{ width: `${beneficiary.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-1/4 text-right">
                  <span className="text-xl font-bold text-gray-900">{beneficiary.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Community Success Stories
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <img
                src="https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Kamala Devi"
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
              <h4 className="font-semibold text-gray-900 text-center mb-2">Kamala Devi</h4>
              <p className="text-sm text-gray-600 text-center mb-4">Traditional Cooking Guide, Tamil Nadu</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                "Through VillageStay, I've been able to share my grandmother's recipes with travelers 
                from around the world. The income has helped me send my daughter to college."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <img
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Ravi Kumar"
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
              <h4 className="font-semibold text-gray-900 text-center mb-2">Ravi Kumar</h4>
              <p className="text-sm text-gray-600 text-center mb-4">Organic Farming Guide, Karnataka</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                "I love teaching visitors about sustainable farming. The platform has helped our 
                village council fund a new water harvesting system with the community development share."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <img
                src="https://images.pexels.com/photos/1181694/pexels-photo-1181694.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Meera Sharma"
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
              <h4 className="font-semibold text-gray-900 text-center mb-2">Meera Sharma</h4>
              <p className="text-sm text-gray-600 text-center mb-4">Handicrafts Guide, Rajasthan</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                "Teaching leaf weaving has preserved our traditional art form. Young people in our 
                village are now interested in learning these skills again."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityImpact;