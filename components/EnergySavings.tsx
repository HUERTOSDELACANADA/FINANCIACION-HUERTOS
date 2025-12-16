import React, { useState } from 'react';

const EnergySavings: React.FC = () => {
  // Estado para el gasto mensual estimado de una vivienda tradicional comparable
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState<number>(180);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  // --- LÓGICA DE CÁLCULO (Estimaciones Almería) ---
  
  // 1. Ahorro Solar: 4 Paneles (~2.2kWp) en Almería generan aprox 3.800 kWh/año.
  // Suponiendo autoconsumo del 70% y precio 0.20€: Ahorro fijo base ~530€/año solo luz.
  const solarSavingsYearly = 600; 

  // 2. Eficiencia Aerotermia + Aislamiento:
  // Una casa vieja gasta X. Una casa nueva con Aerotermia gasta 0.3X en climatización/ACS.
  // Aplicamos un factor de reducción agresivo sobre la factura introducida debido a la combinación de tecnologías.
  const efficiencyFactor = 0.75; // 75% de ahorro total estimado vs vivienda tradicional

  const monthlySavings = currentMonthlyBill * efficiencyFactor;
  const annualSavings = monthlySavings * 12;
  const tenYearSavings = annualSavings * 10; // Proyección 10 años
  const mortgageLifeSavings = annualSavings * 30; // Proyección vida hipoteca

  const estimatedNewBill = currentMonthlyBill - monthlySavings;

  return (
    <div className="bg-emerald-900 rounded-xl shadow-xl border-2 border-emerald-800 overflow-hidden mt-8 text-white">
      {/* Header */}
      <div className="bg-emerald-950 p-5 flex justify-between items-center border-b border-emerald-800">
        <h3 className="text-lg font-bold flex items-center gap-2 text-white">
            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Kit de Ahorro Energético
        </h3>
        <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-2 py-1 rounded border border-emerald-700">Eco-Friendly</span>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Tecnologías Incluidas */}
        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-800/50 p-2 rounded border border-emerald-700/50">
                <div className="text-2xl mb-1">☀️</div>
                <p className="text-[10px] text-emerald-200 font-bold uppercase leading-tight">4 Paneles<br/>Fotovoltaicos</p>
                <p className="text-[9px] text-emerald-400 mt-1">En Castillete</p>
            </div>
            <div className="bg-emerald-800/50 p-2 rounded border border-emerald-700/50">
                <div className="text-2xl mb-1">❄️🔥</div>
                <p className="text-[10px] text-emerald-200 font-bold uppercase leading-tight">Aerotermia<br/>Alta Eficiencia</p>
                <p className="text-[9px] text-emerald-400 mt-1">Frio/Calor/ACS</p>
            </div>
            <div className="bg-emerald-800/50 p-2 rounded border border-emerald-700/50">
                <div className="text-2xl mb-1">🧱</div>
                <p className="text-[10px] text-emerald-200 font-bold uppercase leading-tight">Aislamiento<br/>Térmico</p>
                <p className="text-[9px] text-emerald-400 mt-1">SATE + Doble Vidrio</p>
            </div>
        </div>

        {/* Slider Comparativo */}
        <div>
            <div className="flex justify-between mb-2 items-end">
                <label className="text-sm font-bold text-emerald-100">Gasto Luz/Gas Mensual (Vivienda Actual)</label>
                <span className="text-xl font-bold text-white bg-emerald-800 px-3 py-1 rounded border border-emerald-600">
                    {formatCurrency(currentMonthlyBill)}
                </span>
            </div>
            <input 
                type="range" min="80" max="400" step="10" 
                value={currentMonthlyBill} 
                onChange={(e) => setCurrentMonthlyBill(parseInt(e.target.value))}
                className="w-full h-2 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
            <p className="text-xs text-emerald-300/70 mt-2 text-right">Desliza para simular tu gasto actual en una casa tradicional.</p>
        </div>

        {/* Resultados Ahorro */}
        <div className="bg-emerald-950 rounded-xl p-6 border border-emerald-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-yellow-400/20 transition-all"></div>
            
            <div className="relative z-10">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Tu ahorro estimado anual</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">{formatCurrency(annualSavings)}</span>
                    <span className="text-emerald-200 font-medium">/ año</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-emerald-800 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] text-emerald-400 uppercase">Nueva Factura Est.</p>
                        <p className="text-xl font-bold text-white">~{formatCurrency(estimatedNewBill)}/mes</p>
                    </div>
                    <div className="text-right">
                         <p className="text-[10px] text-emerald-400 uppercase">Ahorro en 30 años</p>
                         <p className="text-xl font-bold text-yellow-400">{formatCurrency(mortgageLifeSavings)}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-emerald-800/30 p-3 rounded border border-emerald-800/50">
             <p className="text-[10px] text-emerald-300 leading-relaxed text-justify">
                * Estimación basada en precios medios de electricidad (0,20€/kWh) y comparativa de eficiencia energética CTE 2019 vs vivienda años 90. 
                El sistema incluye <strong>4 paneles de 2x2m</strong> ubicados en el castillete, optimizando el autoconsumo y reduciendo la dependencia de la red.
             </p>
        </div>

      </div>
    </div>
  );
};

export default EnergySavings;