import React, { useState } from 'react';
import { User, MapPin, Languages, Award, FileText, Check, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const BecomeGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    village: '',
    district: '',
    state: '',
    pincode: '',
    specialties: [] as string[],
    languages: [] as string[],
    gender: '',
    years_experience: '',
    description: '',
    hourly_rate: 300,
    availability: [] as string[],
  });

  const { user, profile } = useAuth();

  const steps = [
    { id: 1, title: 'Location', icon: MapPin },
    { id: 2, title: 'Skills & Languages', icon: Languages },
    { id: 3, title: 'Experience', icon: Award },
    { id: 4, title: 'Availability', icon: FileText },
    { id: 5, title: 'Review', icon: Check }
  ];

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
    'Animal Husbandry',
    'Traditional Music',
    'Folk Dance'
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
    'Odia'
  ];

  const stateOptions = [
    'Andhra Pradesh',
    'Karnataka',
    'Kerala',
    'Tamil Nadu',
    'Telangana',
    'Maharashtra',
    'Gujarat',
    'Rajasthan',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'West Bengal',
    'Odisha',
    'Punjab',
    'Haryana',
    'Himachal Pradesh',
    'Uttarakhand'
  ];

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // First create the guide profile
      const { error: guideError } = await supabase
        .from('guides')
        .insert([
          {
            user_id: user.id,
            ...formData,
            is_verified: false,
            is_active: true,
          }
        ]);

      if (guideError) {
        console.error('Error creating guide profile:', guideError);
        alert('Error creating guide profile. Please try again.');
        return;
      }

      // Update the user's profile to mark them as a guide
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          user_type: 'guide',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        alert('Error updating profile. Please try again.');
      } else {
        alert('Guide application submitted successfully! We will review and contact you within 2-3 business days.');
        
        // Use React Router navigation instead of window.location
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Location Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village/Town *
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your village or town"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your district"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select state</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter PIN code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Skills & Languages</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Your Specialties * (Select at least 2)
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {specialtyOptions.map((specialty) => (
                  <label key={specialty} className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, specialties: [...formData.specialties, specialty] });
                        } else {
                          setFormData({ ...formData, specialties: formData.specialties.filter(s => s !== specialty) });
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Languages You Speak * (Select at least 2)
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {languageOptions.map((language) => (
                  <label key={language} className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, languages: [...formData.languages, language] });
                        } else {
                          setFormData({ ...formData, languages: formData.languages.filter(l => l !== language) });
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm">{language}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Experience & Description</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <select
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select experience</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6-10 years">6-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about yourself *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe your background, experience, and what makes you a great guide. Share your passion for your village and culture..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (₹) *
              </label>
              <input
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="200"
                max="1000"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Recommended range: ₹300-₹600 per hour
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                When are you typically available? * (Select all that apply)
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {['Weekdays', 'Weekends', 'Mornings (6AM-12PM)', 'Afternoons (12PM-6PM)', 'Evenings (6PM-9PM)', 'Flexible timing'].map((time) => (
                  <label key={time} className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(time)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, availability: [...formData.availability, time] });
                        } else {
                          setFormData({ ...formData, availability: formData.availability.filter(a => a !== time) });
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We'll review your application within 2-3 business days</li>
                <li>• Our team may contact you for a brief phone interview</li>
                <li>• Once approved, you'll receive guide training materials</li>
                <li>• Your profile will go live and you can start receiving bookings</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your Application</h2>
            
            <form className="space-y-4">
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> You'll need to sign in to submit your guide application. 
                    Please use the "Sign In\" button in the navigation bar above to continue.
                  </p>
                </div>
              )}
              
              <div>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600">{profile?.full_name}</p>
                <p className="text-gray-600">{profile?.email}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">{formData.village}, {formData.district}, {formData.state} - {formData.pincode}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang) => (
                    <span key={lang} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty) => (
                    <span key={specialty} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Experience & Rate</h3>
                <p className="text-gray-600">{formData.years_experience} • ₹{formData.hourly_rate}/hour</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.availability.map((time) => (
                    <span key={time} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Ready to Submit</h3>
                  <p className="text-sm text-green-800">
                    Your application will be reviewed within 2-3 business days. We'll contact you via email with the next steps.
                  </p>
                </div>
              </div>
            </div>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Become a VillageStay Guide
          </h1>
          <p className="text-xl text-gray-600">
            Share your village culture and earn fair income from tourism
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="text-xs text-gray-600 text-center w-10">
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            onClick={() => {
              if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
              } else {
                if (user) {
                  handleSubmit();
                } else {
                  alert('Please sign in using the navigation bar to submit your application.');
                }
              }
            }}
            disabled={loading || (!user && currentStep === 5)}
            className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : (currentStep === 5 ? (user ? 'Submit Application' : 'Sign In Required') : 'Continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeGuide;