import React from 'react';
import { PROPERTIES } from '../constants';
import { Property } from '../types';

interface Props {
  selectedId: string | null;
  onSelect: (property: Property) => void;
}

const PropertySelector: React.FC<Props> = ({ selectedId, onSelect }) => {
  const getProp = (num: number) => PROPERTIES.find(p => p.number === num);

  // Generamos las filas de viviendas alineadas.
  // Regla: Pares a la Izquierda (Calle Miramar), Impares a la Derecha (Calle Diario de Almería)
  const rows = [];
  
  // Fila superior: V2 (Par/Izq), V1 (Impar/Der)
  rows.push([2, 1]); 
  
  // Filas siguientes: 
  // El bucle va de impares (3, 5, 7...). 
  // Para cumplir la regla, ponemos el par (i+1) primero, y el impar (i) segundo.
  for (let i = 3; i <= 16; i += 2) {
    rows.push([i + 1, i]); // Ejemplo: [4, 3], [6, 5]...
  }

  return (
    <div className="bg-stone-50 p-4 md:p-8 rounded-xl shadow-inner w-full mt-8 lg:mt-24 mb-8 transition-all border border-green-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-950">Selecciona Tu dúplex</h2>
        <p className="text-green-800">Pulsar sobre la vivienda para ver plan de pagos</p>
      </div>

      <div className="relative border-4 border-green-200 p-8 md:p-12 rounded-lg bg-[#e8efe9]">
        
        {/* COMPASS ROSES - Dark Green */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-950 text-white px-4 py-2 font-black text-sm md:text-lg rounded-lg shadow-xl z-20 border-2 border-white tracking-widest">NORTE</div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-green-950 text-white px-4 py-2 font-black text-sm md:text-lg rounded-lg shadow-xl z-20 border-2 border-white tracking-widest">SUR</div>
        <div className="absolute top-1/2 -right-10 md:-right-12 -translate-y-1/2 bg-green-950 text-white px-4 py-2 font-black text-sm md:text-lg rounded-lg shadow-xl rotate-90 z-20 border-2 border-white tracking-widest flex items-center gap-2">
            ESTE <span className="text-yellow-400 text-xl">☀</span>
        </div>
        <div className="absolute top-1/2 -left-10 md:-left-12 -translate-y-1/2 bg-green-950 text-white px-4 py-2 font-black text-sm md:text-lg rounded-lg shadow-xl -rotate-90 z-20 border-2 border-white tracking-widest flex items-center gap-2">
            OESTE <span className="text-orange-400 text-xl">☀</span>
        </div>

        {/* Top Street Label - Calle Carlos V */}
        {/* Line above text */}
        <div className="absolute top-4 left-10 right-10 border-t-2 border-dashed border-green-300"></div>
        <div className="text-center mb-8 relative z-10">
             <span className="bg-green-100 px-4 py-1 text-xs md:text-sm font-bold text-green-800 uppercase tracking-widest border border-green-200 shadow-sm">
                Calle Carlos V
             </span>
        </div>

        <div className="flex justify-center items-stretch">
          
          {/* LEFT STREET (Miramar) */}
          <div className="flex flex-col justify-center items-center mr-4 md:mr-10"> 
             <div className="h-full w-0.5 bg-green-300 relative">
               <span className="absolute top-1/2 left-0 -translate-x-1/2 -rotate-90 whitespace-nowrap text-xs md:text-sm font-bold text-green-700 uppercase tracking-widest origin-center p-2 bg-[#e8efe9]">
                 Calle Miramar
               </span>
             </div>
          </div>

          {/* HOUSES GRID */}
          <div className="flex flex-col gap-4 relative z-10">
             {rows.map(([leftNum, rightNum], idx) => {
               const pLeft = getProp(leftNum);
               const pRight = getProp(rightNum);
               return (
                 <div key={idx} className="flex justify-between gap-4 md:gap-8">
                   {/* Left Prop (Pares) */}
                   {pLeft ? (
                      <button
                        onClick={() => onSelect(pLeft)}
                        className={`w-12 h-12 md:w-16 md:h-16 rounded flex items-center justify-center font-bold transition-all shadow-sm border-2
                          ${selectedId === pLeft.id 
                            ? 'bg-green-600 text-white scale-110 ring-2 ring-green-200 border-green-700' 
                            : 'bg-white text-green-900 hover:bg-green-100 border-green-200 hover:border-green-300'}`}
                     >
                       V{pLeft.number}
                     </button>
                   ) : <div className="w-12 h-12 md:w-16 md:h-16" />} 

                   {/* Central Walkway Gap */}
                   <div className="w-2 md:w-8"></div> 

                   {/* Right Prop (Impares) */}
                   {pRight ? (
                      <button
                        onClick={() => onSelect(pRight)}
                        className={`w-12 h-12 md:w-16 md:h-16 rounded flex items-center justify-center font-bold transition-all shadow-sm border-2
                          ${selectedId === pRight.id 
                            ? 'bg-green-600 text-white scale-110 ring-2 ring-green-200 border-green-700' 
                            : 'bg-white text-green-900 hover:bg-green-100 border-green-200 hover:border-green-300'}`}
                     >
                       V{pRight.number}
                     </button>
                   ) : <div className="w-12 h-12 md:w-16 md:h-16" />}
                 </div>
               );
             })}
          </div>

          {/* RIGHT STREET (Diario de Almería) */}
          <div className="flex flex-col justify-center items-center ml-4 md:ml-10"> 
             <div className="h-full w-0.5 bg-green-300 relative">
               <span className="absolute top-1/2 right-0 translate-x-1/2 rotate-90 whitespace-nowrap text-xs md:text-sm font-bold text-green-700 uppercase tracking-widest origin-center p-2 bg-[#e8efe9]">
                 Calle Diario de Almería
               </span>
             </div>
          </div>

        </div>

        {/* BOTTOM LABEL */}
         <div className="mt-10 pt-4 border-t-2 border-green-300 text-center relative z-10">
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-100 px-2 border border-green-200">Calle Nirvana</span>
         </div>
      </div>
    </div>
  );
};

export default PropertySelector;