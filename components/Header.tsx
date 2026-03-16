import React, { useState, useEffect } from 'react';
import { IMAGES, LINKS } from '../constants';

const Header: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative bg-green-950 text-white shadow-xl">
      {/* Carousel - Increased height */}
      <div className="relative h-80 md:h-[32rem] w-full overflow-hidden">
        {IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-green-950/40"></div>
          </div>
        ))}
        
        {/* Branding Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          
          {/* Logo SVG Personalizado + Location Badge */}
          <div className="relative mb-6 group flex items-center gap-3 bg-white/95 p-3 md:p-4 rounded-xl shadow-2xl z-10">
              <div className="relative h-12 w-12 md:h-16 md:w-16 flex items-center justify-center">
                  {/* Black House Outline SVG */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-green-950">
                      <path 
                          d="M50 5 L95 40 V95 H5 V40 Z" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="6" 
                          strokeLinejoin="round"
                      />
                  </svg>
                  
                  {/* Green H SVG */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#39b54a]" style={{ zIndex: 1 }}>
                      <path 
                          d="M32 25 V95 M68 25 V95 M32 60 H68" 
                          stroke="currentColor" 
                          strokeWidth="12" 
                          strokeLinecap="square"
                      />
                  </svg>
              </div>

              <div className="flex flex-col justify-center h-full pt-1 text-left pr-4">
                  <span className="text-[10px] md:text-xs tracking-[0.2em] font-medium text-green-800 leading-none">
                      RESIDENCIAL
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-[#39b54a] tracking-wide leading-none my-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                      HUERTOS
                  </span>
                  <span className="text-[10px] md:text-xs tracking-[0.2em] font-medium text-green-950 leading-none">
                      DE LA CAÑADA
                  </span>
              </div>

              {/* Location Badge: Top Right of Logo */}
              <div className="absolute -top-6 -right-16 md:-right-24 bg-white text-green-900 p-2 rounded-lg shadow-xl border-2 border-green-100 transform rotate-6 z-20 flex flex-col items-center w-28 md:w-32 hover:scale-105 transition-transform hover:rotate-3">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase text-green-600 leading-none mb-1 whitespace-nowrap">A 1.500m de</span>
                  <img src={LINKS.ualLogo} alt="Universidad de Almería" className="h-8 md:h-10 object-contain" />
              </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-wider mb-2 font-serif text-green-50 drop-shadow-lg uppercase max-w-4xl leading-tight">
            Financio mi dúplex en Huertos de la Cañada
          </h1>
          <p className="text-xl md:text-2xl font-light text-white drop-shadow-md bg-green-900/80 px-6 py-1 rounded-full border border-green-700/50">
            Consulta los precios
          </p>
        </div>
      </div>

      {/* Navigation / Actions */}
      <nav className="bg-green-950 p-4 sticky top-0 z-50 shadow-md border-b border-green-800">
        <div className="container mx-auto flex flex-wrap justify-center gap-3 md:gap-6">
          <a href={LINKS.agenda} target="_blank" rel="noopener noreferrer" 
             className="px-5 py-2.5 bg-white hover:bg-stone-50 text-green-950 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] transform hover:scale-105 border-2 border-white hover:border-green-200">
             Agendar Visita
          </a>
          <a href={LINKS.dossier} target="_blank" rel="noopener noreferrer" 
             className="px-5 py-2.5 bg-green-100 hover:bg-green-50 text-green-900 rounded-full text-sm font-bold transition-all shadow-md transform hover:scale-105 border border-green-200">
             Dossier Completo
          </a>
          <a href={LINKS.video} target="_blank" rel="noopener noreferrer" 
             className="px-5 py-2.5 bg-red-50 hover:bg-white text-red-700 rounded-full text-sm font-bold transition-colors flex items-center gap-2 shadow-md border border-red-100 hover:border-red-300">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
             Arquitecto Explica
          </a>
          <a href={LINKS.maps} target="_blank" rel="noopener noreferrer" 
             className="px-5 py-2.5 bg-emerald-100 hover:bg-emerald-50 text-emerald-900 rounded-full text-sm font-bold transition-colors shadow-md border border-emerald-200">
             Ubicación
          </a>
          <a href={LINKS.web} target="_blank" rel="noopener noreferrer" 
             className="px-5 py-2.5 bg-stone-200 hover:bg-stone-100 text-stone-900 rounded-full text-sm font-bold transition-all shadow-md border border-stone-300">
             Quiero más información
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
