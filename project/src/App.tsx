import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import GuideSearch from './components/GuideSearch';
import LocalActivities from './components/LocalActivities';
import ExperienceCategories from './components/ExperienceCategories';
import FeaturedGuides from './components/FeaturedGuides';
import SafetyFeatures from './components/SafetyFeatures';
import CommunityImpact from './components/CommunityImpact';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import FindGuides from './components/FindGuides';
import BecomeGuide from './components/BecomeGuide';
import PaymentMethods from './components/PaymentMethods';
import TransactionHistory from './components/TransactionHistory';
import MerchantDashboard from './components/MerchantDashboard';
import CommunityGroups from './components/CommunityGroups';
import GroupDetail from './components/GroupDetail';
import UserDashboard from './components/UserDashboard';
import GuideDashboard from './components/GuideDashboard';

const HomePage = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    specialty: '',
    language: '',
    gender: '',
    availability: ''
  });

  return (
    <>
      <Hero />
      <GuideSearch filters={searchFilters} setFilters={setSearchFilters} />
      <LocalActivities />
      <ExperienceCategories />
      <FeaturedGuides filters={searchFilters} />
      <SafetyFeatures />
      <CommunityImpact />
      <HowItWorks />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-stone-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/find-guides" element={<FindGuides />} />
            <Route path="/become-guide" element={<BecomeGuide />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
            <Route path="/community" element={<CommunityGroups />} />
            <Route path="/community/groups/:groupId" element={<GroupDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;