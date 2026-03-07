import React from 'react';
import { useAppStore } from '../../../hooks/appStore';
import { MessageCircle } from 'lucide-react';

const Login = () => {
  const { generationText } = useAppStore();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  const GOOGLE_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;
  const KAKAO_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/kakao`;

  const handleSocialLogin = (url, provider) => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (provider === 'google') {
      const isInAppBrowser = /kakaotalk|instagram|facebook|line|twitter|naver/i.test(userAgent);
      
      if (isInAppBrowser) {
        if (userAgent.includes('android')) {
          const currentUrl = window.location.href;

          const urlWithoutScheme = currentUrl.replace(/^https?:\/\//i, '');
          const scheme = currentUrl.startsWith('http://') ? 'http' : 'https';
          
          const intentUrl = `intent://${urlWithoutScheme}#Intent;scheme=${scheme};package=com.android.chrome;end;`;
          
          window.location.href = intentUrl;
          return; 
        } 
        
        else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
          alert("구글 로그인은 보안상 카카오톡 브라우저에서 차단됩니다.\n\n화면 우측 하단(또는 상단)의 메뉴[⋮]를 눌러 [Safari로 열기] 또는 [다른 브라우저로 열기]를 선택해주세요.");
          return; 
        }
      }
    }

    // 인앱 브라우저가 아니거나, 카카오 로그인인 경우 정상적으로 백엔드 로그인 URL로 이동합니다.
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#110b29] text-white px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl shadow-2xl animate-fade-in-up">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black italic mb-3 tracking-tighter">GET IT</h2>
          <p className="text-gray-400 text-sm font-medium">{generationText} 멤버십 서비스에 로그인하세요</p>
        </div>

        <div className="space-y-4">
          {/* 구글 버튼: 클릭 시 provider로 'google'을 넘김 */}
          <button 
            onClick={() => handleSocialLogin(GOOGLE_AUTH_URL, 'google')}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5"
            />
            Google로 시작하기
          </button>

          {/* 카카오 버튼: 클릭 시 provider로 'kakao'를 넘김 */}
          <button 
            onClick={() => handleSocialLogin(KAKAO_AUTH_URL, 'kakao')}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#3c1e1e] font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <MessageCircle size={22} fill="#3c1e1e" stroke="none" />
            Kakao로 시작하기
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            로그인 시 서비스 <span className="text-gray-400 underline cursor-pointer">이용약관</span> 및 
            <br />
            <span className="text-gray-400 underline cursor-pointer">개인정보 처리방침</span>에 동의하게 됩니다.
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>문제가 발생했나요? <span className="text-cyan-400 underline cursor-pointer font-bold">운영진에게 문의</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;