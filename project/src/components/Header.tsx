import React, { useState } from 'react';
import { Menu, X, MapPin, User, LogOut, DollarSign, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [userType, setUserType] = useState<'traveler' | 'guide'>('traveler');
  
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const openAuthModal = (mode: 'signin' | 'signup', type: 'traveler' | 'guide' = 'traveler') => {
    setAuthMode(mode);
    setUserType(type);
    setShowAuthModal(true);
    setIsMenuOpen(false);
    setShowSignInDropdown(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleHashNavigation = (hash: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  // NavItem component for consistent styling
  const NavItem = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <button
      onClick={onClick}
      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
    >
      {children}
    </button>
  );

  // Common navigation items for both travelers and guides
  const commonNavItems = (
    <>
      <NavItem onClick={() => handleHashNavigation('#experiences')}>Experiences</NavItem>
      <NavItem onClick={() => handleNavigation('/community')}>Community</NavItem>
      <NavItem onClick={() => handleHashNavigation('#about')}>About</NavItem>
    </>
  );

  // Traveler-specific navigation items
  const travelerNavItems = (
    <>
      <NavItem onClick={() => handleNavigation('/find-guides')}>Find Guides</NavItem>
      <NavItem onClick={() => handleNavigation('/become-guide')}>Become a Guide</NavItem>
    </>
  );

  // Guide-specific navigation items
  const guideNavItems = (
    <>
      <NavItem onClick={() => handleNavigation('/guide-dashboard')}>Guide Dashboard</NavItem>
      <NavItem onClick={() => handleNavigation('/merchant-dashboard')}>Earnings</NavItem>
    </>
  );

  // UserDropdown component for profile menu
  const UserDropdown = () => (
    <div className="relative group">
      <button className="flex items-center space-x-2 focus:outline-none">
        <img
          src={profile?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
          alt={profile?.full_name}
          className="w-8 h-8 rounded-full object-cover border-2 border-orange-100"
        />
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {profile?.full_name}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500 hidden md:inline" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {profile?.user_type === 'guide' ? (
          <>
            <DropdownItem icon={<User size={16} />} onClick={() => handleNavigation('/guide-dashboard')}>
              Dashboard
            </DropdownItem>
            <DropdownItem icon={<DollarSign size={16} />} onClick={() => handleNavigation('/merchant-dashboard')}>
              Earnings
            </DropdownItem>
          </>
        ) : (
          <DropdownItem icon={<User size={16} />} onClick={() => handleNavigation('/dashboard')}>
            Dashboard
          </DropdownItem>
        )}
        <div className="border-t border-gray-100 my-1"></div>
        <DropdownItem icon={<LogOut size={16} />} onClick={handleSignOut}>
          Sign Out
        </DropdownItem>
      </div>
    </div>
  );

  const DropdownItem = ({ children, icon, onClick }: { children: React.ReactNode, icon: React.ReactNode, onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 flex items-center"
    >
      <span className="mr-2">{icon}</span>
      {children}
    </button>
  );

  // AuthButtons component for unauthenticated users
  const AuthButtons = () => (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <button
          onClick={() => setShowSignInDropdown(!showSignInDropdown)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 rounded-md"
        >
          Sign In
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
        
        {showSignInDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <DropdownItem 
              icon={<User size={16} />} 
              onClick={() => openAuthModal('signin', 'traveler')}
            >
              As Traveler
            </DropdownItem>
            <DropdownItem 
              icon={<MapPin size={16} />} 
              onClick={() => openAuthModal('signin', 'guide')}
            >
              As Guide
            </DropdownItem>
          </div>
        )}
      </div>
      <button
        onClick={() => openAuthModal('signup')}
        className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
      >
        Sign Up
      </button>
    </div>
  );

  // MobileMenu component for responsive design
  const MobileMenu = () => (
    <div className="lg:hidden py-4 border-t bg-white">
      <nav className="flex flex-col space-y-2 px-4">
        {/* Common items */}
        {commonNavItems}
        
        {/* User type specific */}
        {user ? (
          profile?.user_type === 'guide' ? guideNavItems : travelerNavItems
        ) : (
          travelerNavItems
        )}

        {/* Auth section */}
        <div className="border-t border-gray-100 pt-3 mt-2">
          {user ? (
            <>
              <div className="flex items-center space-x-3 py-3">
                <img
                  src={profile?.avatar_url || 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={profile?.full_name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-100"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500">
                    {profile?.user_type === 'guide' ? 'Local Guide' : 'Traveler'}
                  </p>
                </div>
              </div>
              
              {profile?.user_type === 'guide' ? (
                <>
                  <DropdownItem icon={<User size={16} />} onClick={() => handleNavigation('/guide-dashboard')}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem icon={<DollarSign size={16} />} onClick={() => handleNavigation('/merchant-dashboard')}>
                    Earnings
                  </DropdownItem>
                </>
              ) : (
                <DropdownItem icon={<User size={16} />} onClick={() => handleNavigation('/dashboard')}>
                  Dashboard
                </DropdownItem>
              )}
              
              <DropdownItem icon={<LogOut size={16} />} onClick={handleSignOut}>
                Sign Out
              </DropdownItem>
            </>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">SIGN IN AS</p>
                <DropdownItem 
                  icon={<User size={16} />} 
                  onClick={() => openAuthModal('signin', 'traveler')}
                >
                  Traveler
                </DropdownItem>
                <DropdownItem 
                  icon={<MapPin size={16} />} 
                  onClick={() => openAuthModal('signin', 'guide')}
                >
                  Local Guide
                </DropdownItem>
              </div>
              <button
                onClick={() => openAuthModal('signup')}
                className="w-full px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
  <div className="flex items-center gap-2 sm:gap-3">
    <img
      src="https://ik.imagekit.io/8vvkoi3dt/ChatGPT_Image_Jul_12__2025__01_28_03_AM-removebg-preview.png?updatedAt=1752263937896"
      alt="Logo"
      width={105}
      height={105}
      className="object-contain w-12 h-12 sm:w-[105px] sm:h-[105px]"
    />
    <span className="text-lg font-bold text-gray-1500 md:text-4xl uppercase tracking-wider font-['Oswald'] sm:inline-block">
      <span className="inline sm:hidden">सहचारी</span> {/* Single character for mobile */}
      <span className="hidden sm:inline">सहचारी</span> {/* Full text for desktop */}
    </span>
  </div>
</Link>
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {commonNavItems}
              {user ? (
                profile?.user_type === 'guide' ? guideNavItems : travelerNavItems
              ) : (
                travelerNavItems
              )}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center">
              {user ? <UserDropdown /> : <AuthButtons />}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && <MobileMenu />}
        </div>
      </header>
      
      {/* Click outside to close dropdown */}
      {showSignInDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSignInDropdown(false)}
        />
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        userType={userType}
      />
    </>
  );
};

export default Header;