import React from 'react';
import { Shield, Phone, MapPin, Users, Clock, CheckCircle, AlertTriangle, Heart } from 'lucide-react';

const SafetyFeatures = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Verified Guide Profiles',
      description: 'All guides undergo background verification with ID proof, address verification, and community references.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Phone,
      title: '24/7 Emergency Support',
      description: 'Round-the-clock helpline with local emergency contacts and immediate assistance coordination.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MapPin,
      title: 'Live Location Sharing',
      description: 'Optional real-time location sharing with trusted contacts during your village experience.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      title: 'Community Accountability',
      description: 'Guides are accountable to their village councils, ensuring responsible behavior and cultural respect.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const soloTravelTips = [
    {
      icon: CheckCircle,
      title: 'Pre-Activity Briefing',
      description: 'Every experience starts with a safety briefing and cultural orientation from your guide.'
    },
    {
      icon: Clock,
      title: 'Flexible Timing',
      description: 'Choose activities during daylight hours and adjust duration based on your comfort level.'
    },
    {
      icon: Heart,
      title: 'Cultural Sensitivity',
      description: 'Guides are trained to respect personal boundaries and cultural differences.'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Protocols',
      description: 'Clear emergency procedures and local contact information provided before each activity.'
    }
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Safe Solo Travel, Guaranteed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your safety is our priority. We've built comprehensive safety measures 
            specifically designed for independent travelers exploring rural areas.
          </p>
        </div>

        {/* Main Safety Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Solo Travel Guidelines */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Solo Travel Guidelines
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Safety Measures</h4>
              <div className="space-y-4">
                {soloTravelTips.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                      <tip.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">{tip.title}</h5>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Gender Preferences</h4>
              <div className="space-y-4">
                <div className="bg-pink-50 p-4 rounded-xl">
                  <h5 className="font-semibold text-gray-900 mb-2">Female Travelers</h5>
                  <p className="text-gray-600 text-sm mb-3">
                    Filter for female guides or mixed-gender group activities. Many of our female guides 
                    specialize in cooking, crafts, and cultural activities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded text-xs">Female Guides Available</span>
                    <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded text-xs">Group Activities</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h5 className="font-semibold text-gray-900 mb-2">All Travelers</h5>
                  <p className="text-gray-600 text-sm mb-3">
                    Choose guides based on language preferences, activity interests, and availability. 
                    All guides are community-verified and culturally sensitive.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Language Matching</span>
                    <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Cultural Training</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Card */}
        <div className="mt-12 bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-red-600 mr-3" />
            <h3 className="text-xl font-bold text-red-900">Emergency Contacts</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-semibold text-red-900">VillageStay Emergency</div>
              <div className="text-red-700">+91 98765 43210</div>
              <div className="text-sm text-red-600">24/7 Available</div>
            </div>
            <div>
              <div className="font-semibold text-red-900">Local Police</div>
              <div className="text-red-700">100</div>
              <div className="text-sm text-red-600">National Emergency</div>
            </div>
            <div>
              <div className="font-semibold text-red-900">Medical Emergency</div>
              <div className="text-red-700">108</div>
              <div className="text-sm text-red-600">Ambulance Service</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyFeatures;