import React, { useState } from 'react';
import { Calendar, Clock, Users, CreditCard, Shield, Check, ArrowLeft, MapPin, Smartphone, Building, Wallet } from 'lucide-react';

interface BookingFlowProps {
  guide: {
    name: string;
    image: string;
    location: string;
    specialty: string;
    hourlyRate: number;
    rating: number;
  };
}

const BookingFlow: React.FC<BookingFlowProps> = ({ guide }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 3,
    guests: 1,
    experience: '',
    specialRequests: '',
    paymentMethod: 'card'
  });

  const steps = [
    { id: 1, title: 'Select Date & Time', icon: Calendar },
    { id: 2, title: 'Choose Experience', icon: MapPin },
    { id: 3, title: 'Guest Details', icon: Users },
    { id: 4, title: 'Payment', icon: CreditCard },
    { id: 5, title: 'Confirmation', icon: Check }
  ];

  const experiences = [
    {
      id: 'farming',
      title: 'Sustainable Farming Experience',
      description: 'Learn organic farming techniques and work alongside local farmers',
      duration: '3-4 hours',
      price: guide.hourlyRate * 3
    },
    {
      id: 'cooking',
      title: 'Traditional Cooking Class',
      description: 'Cook authentic local dishes using traditional methods',
      duration: '2-3 hours',
      price: guide.hourlyRate * 2.5
    },
    {
      id: 'crafts',
      title: 'Local Handicrafts Workshop',
      description: 'Create beautiful handicrafts using traditional techniques',
      duration: '2-3 hours',
      price: guide.hourlyRate * 2.5
    }
  ];

  const calculateTotal = () => {
    const basePrice = guide.hourlyRate * bookingData.duration;
    const serviceFee = Math.round(basePrice * 0.1);
    return basePrice + serviceFee;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <div className="flex space-x-4">
                {[2, 3, 4, 5].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setBookingData({ ...bookingData, duration: hours })}
                    className={`px-4 py-2 rounded-xl border-2 transition-colors ${
                      bookingData.duration === hours
                        ? 'border-orange-600 bg-orange-50 text-orange-600'
                        : 'border-gray-300 text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {hours} hours
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Experience</h2>
            
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setBookingData({ ...bookingData, experience: exp.id })}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-colors ${
                    bookingData.experience === exp.id
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{exp.title}</h3>
                      <p className="text-gray-600 mb-3">{exp.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {exp.duration}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{exp.price}</div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Guest Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <select
                value={bookingData.guests}
                onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests or Dietary Requirements
              </label>
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Any special requirements, dietary restrictions, or requests..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{bookingData.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{bookingData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>₹{guide.hourlyRate * bookingData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>₹{Math.round(guide.hourlyRate * bookingData.duration * 0.1)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Payment Method</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={bookingData.paymentMethod === 'card'}
                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                  <div>
                    <span className="font-medium">Credit/Debit Card</span>
                    <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={bookingData.paymentMethod === 'upi'}
                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                    className="mr-3"
                  />
                  <Smartphone className="h-5 w-5 mr-3 text-gray-600" />
                  <div>
                    <span className="font-medium">UPI Payment</span>
                    <p className="text-sm text-gray-500">PhonePe, Google Pay, Paytm</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={bookingData.paymentMethod === 'netbanking'}
                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                    className="mr-3"
                  />
                  <Building className="h-5 w-5 mr-3 text-gray-600" />
                  <div>
                    <span className="font-medium">Net Banking</span>
                    <p className="text-sm text-gray-500">All major banks supported</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={bookingData.paymentMethod === 'wallet'}
                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                    className="mr-3"
                  />
                  <Wallet className="h-5 w-5 mr-3 text-gray-600" />
                  <div>
                    <span className="font-medium">Digital Wallet</span>
                    <p className="text-sm text-gray-500">Paytm, Amazon Pay, etc.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-4 rounded-xl">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Secure Payment</p>
                <p>Your payment is protected by 256-bit SSL encryption. Money is held securely until your experience is completed.</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            
            <p className="text-gray-600">
              Your booking request has been sent to {guide.name}. You'll receive a confirmation 
              email shortly with all the details.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono">#VS{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guide:</span>
                  <span>{guide.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="font-semibold">₹{calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors">
                View Booking Details
              </button>
              <button className="border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-600 hover:text-white transition-colors">
                Message Guide
              </button>
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
                  className={`w-16 h-1 mx-2 ${
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

      {/* Guide Info */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={guide.image}
            alt={guide.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{guide.name}</h3>
            <p className="text-gray-600 text-sm">{guide.specialty}</p>
            <p className="text-gray-500 text-sm">{guide.location}</p>
          </div>
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
          className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {currentStep < 5 && (
          <button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors"
          >
            {currentStep === 4 ? 'Complete Booking' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;