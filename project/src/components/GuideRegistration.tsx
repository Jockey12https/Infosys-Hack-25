import React, { useState } from 'react';
import { User, MapPin, Languages, Camera, Award, FileText, Check } from 'lucide-react';

const GuideRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    
    // Location
    village: '',
    district: '',
    state: '',
    pincode: '',
    
    // Languages
    languages: [],
    
    // Specialties
    specialties: [],
    
    // Experience
    yearsOfExperience: '',
    description: '',
    
    // Availability
    availability: [],
    
    // Documents
    idProof: null,
    addressProof: null,
    certifications: []
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Languages & Skills', icon: Languages },
    { id: 4, title: 'Experience', icon: Award },
    { id: 5, title: 'Documents', icon: FileText },
    { id: 6, title: 'Review', icon: Check }
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
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
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 2:
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
                >
                  <option value="">Select state</option>
                  <option value="andhra-pradesh">Andhra Pradesh</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="kerala">Kerala</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="telangana">Telangana</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="madhya-pradesh">Madhya Pradesh</option>
                  <option value="uttar-pradesh">Uttar Pradesh</option>
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
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Languages & Specialties</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Languages You Speak *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Your Specialties *
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Experience & Description</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <select
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select experience</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                When are you typically available? *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings', 'Flexible'].map((time) => (
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
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Document Verification</h2>
            
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-blue-800">
                Please upload clear photos of your documents. All information will be kept secure and used only for verification purposes.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government ID Proof * (Aadhaar, Voter ID, Passport, etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-300 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Proof * (Utility bill, Bank statement, etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-300 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-300 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload any relevant certifications</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
                  <input type="file" className="hidden" accept="image/*" multiple />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your Application</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-600">{formData.email} • {formData.phone}</p>
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
                <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                <p className="text-gray-600">{formData.yearsOfExperience} years</p>
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            if (currentStep < 6) {
              setCurrentStep(currentStep + 1);
            } else {
              // Submit application
              alert('Application submitted successfully!');
            }
          }}
          className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors"
        >
          {currentStep === 6 ? 'Submit Application' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default GuideRegistration;