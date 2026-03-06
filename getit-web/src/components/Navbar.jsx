import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, PlayCircle, TrendingUp, Settings } from 'lucide-react';
import { ROLES } from '../constants';

const Navbar = ({ auth }) => {
  const { userRole, setUserRole, isLoggedIn, isApproved,isAdmin,isMember } = auth ?? {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUserRole(ROLES.GUEST);
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#110b29]/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4 transition-all pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" onClick={closeMenu} className="text-2xl md:text-3xl font-black italic text-white z-50 hover:opacity-80">
          GET IT<span className="text-cyan-400 not-italic">.</span>
        </Link>

        {/* --- 데스크톱 메뉴 --- */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-gray-300">
          <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
          <Link to="/executives" className="hover:text-cyan-400 transition-colors">Executives</Link>
          <Link to="/recruit" className="hover:text-cyan-400 transition-colors">Recruit</Link>

          {isLoggedIn ? (
            <>
              {/* 💡 [핵심] 승인된 멤버에게만 보이는 메뉴 */}
              {isMember && (
                <>
                  <div className="h-4 w-px bg-gray-700 mx-2"></div>
                  <Link to="/lecture" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <PlayCircle size={18} /> Lecture
                  </Link>
                  <Link to="/invest" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <TrendingUp size={18} /> Invest
                  </Link>
                </>
              )}

              {/* 관리자 전용 메뉴 */}
              {userRole === ROLES.ADMIN && (
                <Link 
                  to="/admin" 
                  className="hover:text-cyan-400 transition-colors"
                >
                 Admin
                </Link>
              )}
              
              <button onClick={handleLogout} className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors pl-4">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-cyan-500 text-[#110b29] px-5 py-2 rounded-full font-bold hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              Login
            </Link>
          )}
        </div>

        <button type="button" aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'} className="md:hidden text-white z-50 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- 모바일 메뉴 --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#110b29] z-40 flex flex-col justify-center items-center gap-6 text-xl font-bold md:hidden text-white animate-fade-in overflow-y-auto pt-24 pb-12 px-4">
          <Link to="/about" onClick={closeMenu} className="py-2">About</Link>
          <Link to="/executives" onClick={closeMenu} className="py-2">Executives</Link>
          <Link to="/recruit" onClick={closeMenu} className="py-2">Recruit</Link>
          
          {isLoggedIn ? (
            <>
              {isMember && (
                <>
                  <Link to="/lecture" onClick={closeMenu} className="text-cyan-400 py-2">Lecture</Link>
                  <Link to="/invest" onClick={closeMenu} className="text-cyan-400 py-2">Invest</Link>
                </>
              )}
              
              {userRole === ROLES.ADMIN && (
                <Link to="/admin" onClick={closeMenu} className="text-red-400 flex items-center gap-2 border border-red-500/50 px-4 py-2 rounded-xl bg-red-900/20">
                  <Settings size={20} /> Admin Page
                </Link>
              )}


              <button type="button" onClick={handleLogout} className="text-gray-400 mt-4 flex items-center gap-2 py-2">
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu} className="text-cyan-400 text-2xl mt-4 py-2">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;