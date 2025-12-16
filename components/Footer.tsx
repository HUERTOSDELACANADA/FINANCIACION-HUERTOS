import React from 'react';
import { PARTNER_LOGOS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-950 text-green-100 py-12 mt-12 border-t-4 border-green-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 text-center md:text-left mb-12">
            <div>
                <h3 className="text-white text-lg font-bold mb-4 font-serif">Huertos de la Cañada</h3>
                <p className="mb-2 text-green-200/80">Calle Carlos V</p>
                <p className="mb-2 text-green-200/80">La Cañada de San Urbano, Almería</p>
            </div>
            <div className="md:text-right">
                <h4 className="text-green-500 font-bold mb-2">COMERCIALIZA</h4>
                <p className="font-bold text-white tracking-wide">MORETURISMO INT SL</p>
                <p className="text-sm text-green-200/60">C/ ORTEGA Y GASSET, 3, LOCAL BAJO</p>
                <div className="mt-4">
                    <p className="font-medium text-green-200">DTOR. COMERCIAL JUAN MIGUEL MORENO</p>
                    <p className="text-lg text-white font-bold">TLF 691 245 047</p>
                    <a href="mailto:infohuertosdelacanada@gmail.com" className="hover:text-green-400 transition-colors text-green-200/80">infohuertosdelacanada@gmail.com</a>
                </div>
            </div>
        </div>

        {/* Partner Logos on White Background */}
        <div className="border-t border-green-900 pt-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {PARTNER_LOGOS.map((logo, idx) => (
                    <img 
                        key={idx} 
                        src={logo} 
                        alt={`Partner ${idx + 1}`} 
                        className="h-12 md:h-20 object-contain hover:scale-105 transition-transform duration-300" 
                    />
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;