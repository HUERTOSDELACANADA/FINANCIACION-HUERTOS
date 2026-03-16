import React, { useState } from 'react';
import { Info, Share2, Check, MessageCircle, X, PlayCircle, Phone, Mail, ExternalLink, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleShare = () => {
    // Copy the specific deployment URL to clipboard
    navigator.clipboard.writeText("https://medidas.xn--huertosdelacaada-jub.com/");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            {/* Custom Logo Implementation */}
            <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 flex items-center justify-center">
                    {/* Black House Outline SVG */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-black">
                        <path 
                            d="M50 5 L95 40 V95 H5 V40 Z" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="6" 
                            strokeLinejoin="round"
                        />
                         {/* Roof Inner Line details from logo */}
                         <path d="M25 40 H75" stroke="currentColor" strokeWidth="0" /> 
                    </svg>
                    
                    {/* Green H SVG */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#39b54a]" style={{ zIndex: 1 }}>
                        {/* A stylized H that breaks the house line slightly */}
                        <path 
                            d="M32 25 V95 M68 25 V95 M32 60 H68" 
                            stroke="currentColor" 
                            strokeWidth="12" 
                            strokeLinecap="square"
                        />
                    </svg>
                </div>

                <div className="flex flex-col justify-center h-full pt-1">
                    <span className="text-[10px] tracking-[0.2em] font-medium text-gray-500 leading-none">
                        RESIDENCIAL
                    </span>
                    <span className="text-2xl font-black text-[#39b54a] tracking-wide leading-none my-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                        HUERTOS
                    </span>
                    <span className="text-[10px] tracking-[0.2em] font-medium text-gray-800 leading-none">
                        DE LA CAÑADA
                    </span>
                </div>
            </div>

            {/* University Link Section */}
            <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 h-10">
                <div className="flex flex-col items-end justify-center text-gray-400">
                    <span className="text-[10px] font-semibold leading-none">a 1.500</span>
                    <span className="text-[10px] font-semibold leading-none">metros de</span>
                </div>
                <img 
                    src="https://drive.google.com/thumbnail?id=1cJQ9faDsOJtYXDj7SAOT1qfrWQ0r8egw&sz=w200" 
                    alt="Universidad de Almería" 
                    className="h-10 w-auto object-contain mix-blend-multiply opacity-90"
                />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <button 
                onClick={handleShare}
                className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-50 text-gray-600 hover:bg-[#39b54a] hover:text-white'
                }`}
             >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Enlace Copiado' : 'Compartir'}
             </button>

             <a 
                href="https://youtu.be/mmd3os4GG8s?si=K3dqhIweRx_2maaP"
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-gray-900 text-white hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg min-w-[180px]"
             >
                <PlayCircle className="h-4 w-4" />
                <span>Video Arquitecto</span>
             </a>

             <a 
                href="https://xn--huertosdelacaada-jub.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-[#39b54a] text-white hover:bg-[#2ea03f] transition-all duration-300 shadow-md hover:shadow-lg min-w-[180px]"
             >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Quiero más información</span>
                <span className="inline md:hidden">Info</span>
             </a>

             <div className="flex items-center">
                <button 
                    onClick={onOpenAdmin}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors mr-1"
                    title="Acceso Admin"
                >
                    <Lock className="h-5 w-5" />
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setShowInfo(!showInfo)}
                        className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50 hover:text-[#39b54a]'}`}
                    >
                    <Info className="h-6 w-6" />
                    </button>
                    
                    {showInfo && (
                    <>
                        {/* Overlay to close when clicking outside */}
                        <div className="fixed inset-0 z-40" onClick={() => setShowInfo(false)}></div>
                        
                        {/* Dropdown Card */}
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-6 animate-fadeIn">
                            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Comercializa</h4>
                            <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-4 w-4" />
                            </button>
                            </div>
                            <div className="space-y-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-bold text-gray-800">MORETURISMO INT SL</p>
                                    <div className="flex items-start gap-2">
                                        <span className="block text-gray-500 leading-snug">
                                        C/ ORTEGA Y GASSET, 3 <br/>
                                        LOCAL BAJO
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-3 space-y-3">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase">Dtor. Comercial</span>
                                        <p className="font-bold text-gray-900">Juan Miguel Moreno</p>
                                    </div>
                                    
                                    <a href="tel:+34691245047" className="flex items-center gap-3 hover:text-[#39b54a] transition-colors group">
                                        <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-[#39b54a] group-hover:text-white transition-colors">
                                            <Phone className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-medium">691 245 047</span>
                                    </a>
                                    
                                    <a href="mailto:infohuertosdelacanada@gmail.com" className="flex items-center gap-3 hover:text-[#39b54a] transition-colors group">
                                        <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-[#39b54a] group-hover:text-white transition-colors">
                                            <Mail className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-medium break-all text-xs">infohuertosdelacanada@gmail.com</span>
                                    </a>

                                    <a href="https://xn--huertosdelacaada-jub.com/#contact" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#39b54a] hover:underline font-medium mt-1">
                                        <div className="bg-[#39b54a]/10 p-1.5 rounded-full">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </div>
                                        <span>Visitar Web Oficial</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                    )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
