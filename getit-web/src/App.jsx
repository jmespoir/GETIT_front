import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react'; // 아이콘 (npm install lucide-react)

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#110b29] text-white font-sans overflow-x-hidden selection:bg-cyan-400 selection:text-black">
      
      {/* 1. 네비게이션 바 (Navbar) */}
      <nav className="absolute top-0 left-0 w-full z-50 bg-transparent px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* 로고 */}
          <a href="/" className="text-3xl font-black tracking-tighter italic z-50">
            GET IT
            <span className="text-cyan-400 not-italic text-4xl">.</span>
          </a>

          {/* PC 메뉴 */}
          <div className="hidden md:flex space-x-12 text-lg font-medium text-gray-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#project" className="hover:text-cyan-400 transition-colors">Project</a>
            <a href="#invest" className="hover:text-cyan-400 transition-colors">Invest</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Recruit</a>
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button 
            className="md:hidden text-white z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* 모바일 전체화면 메뉴 (애니메이션 효과) */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#110b29] z-40 flex flex-col justify-center items-center space-y-8 text-2xl font-bold md:hidden">
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#project" onClick={() => setIsMenuOpen(false)}>Project</a>
            <a href="#invest" onClick={() => setIsMenuOpen(false)}>Invest</a>
            <a href="#recruit" onClick={() => setIsMenuOpen(false)} className="text-cyan-400">Recruit</a>
          </div>
        )}
      </nav>

      {/* 2. 히어로 섹션 (Hero Section) */}
      <header className="relative w-full h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
        
        {/* 배경 장식 (Fluid Shapes - SVG) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 상단 파란색 물결 */}
          <svg className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] text-blue-700 opacity-80 animate-pulse-slow" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.3,32.7C60.4,43.9,49.9,53.4,38.1,60.5C26.3,67.6,13.2,72.3,0.5,71.4C-12.2,70.5,-24.4,64,-35.3,56.5C-46.2,49,-55.8,40.5,-63.9,30.3C-72,20.1,-78.6,8.2,-77.7,-3.3C-76.8,-14.8,-68.4,-25.9,-59.1,-35.8C-49.8,-45.7,-39.6,-54.3,-28.3,-63.3C-17,-72.3,-4.6,-81.7,8.2,-83.1L21,-84.5Z" transform="translate(100 100)" />
          </svg>
          
          {/* 하단 하늘색 물결 */}
          <svg className="absolute bottom-0 right-0 w-[80%] h-[80%] text-cyan-500 opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M39.9,-65.7C54.1,-60.5,69.6,-53.8,79.8,-42.6C90,-31.4,94.9,-15.7,91.5,-1.9C88.2,11.8,76.6,23.6,65.6,33.8C54.6,44,44.2,52.6,32.8,59.3C21.4,66,9,70.8,-3.8,77.4C-16.6,84,-29.8,92.4,-40.4,87.6C-51,82.8,-59,64.8,-64.7,48.5C-70.4,32.2,-73.8,17.6,-73.1,3.4C-72.4,-10.8,-67.6,-24.6,-59.5,-36.5C-51.4,-48.4,-40,-58.4,-27.9,-64.8C-15.8,-71.2,-3,-74,8.8,-75.5L20.6,-77Z" transform="translate(100 100)" />
          </svg>

          {/* 떠다니는 원들 (흰색 포인트) */}
          <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-white rounded-full opacity-80 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/3 left-10 w-4 h-4 bg-cyan-300 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '5s' }}></div>
          <div className="absolute top-20 right-10 w-3 h-3 bg-white rounded-full"></div>
        </div>

        {/* 메인 텍스트 (Content) */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm md:text-base animate-fade-in-up">
            IT Startup Club
          </p>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black italic leading-tight tracking-tighter drop-shadow-2xl">
            LET'S MAKE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              ANYTHING.
            </span>
          </h1>

          <p className="text-gray-400 text-sm md:text-xl max-w-lg mt-4 font-light">
            상상을 현실로 만드는 IT 창업 동아리, <b>GET IT</b>입니다.<br className="hidden md:block"/>
            우리는 기술을 넘어 가치를 만듭니다.
          </p>

          {/* 버튼 그룹 (CTA) */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 w-full md:w-auto px-6">
             <button className="bg-white text-[#110b29] font-bold py-4 px-8 rounded-full hover:bg-cyan-300 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              지원하기 <ArrowRight size={20} />
            </button>
            <button className="border border-white/30 backdrop-blur-sm text-white font-medium py-4 px-8 rounded-full hover:bg-white/10 transition-all">
              프로젝트 구경하기
            </button>
          </div>
        </div>
      </header>
      

      {/* 3. 간단 소개 섹션 (스크롤 유도용) */}
      <section id="about" className="relative py-20 bg-[#110b29] px-6">
        <div className="max-w-4xl mx-auto text-center">
           <span className="inline-block w-1 h-20 bg-gradient-to-b from-cyan-400 to-transparent mb-8"></span>
           <h2 className="text-3xl font-bold mb-4">Why GET IT?</h2>
           <p className="text-gray-400">
             단순한 코딩 동아리가 아닙니다. 기획부터 개발, 배포, 그리고 창업까지.<br />
             전 과정을 경험하며 진짜 '내 서비스'를 만드는 곳입니다.
           </p>
        </div>
      </section>

    </div>
  );
};

export default MainPage;