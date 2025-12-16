import React, { useState, useRef } from 'react';
import { Property } from '../types';
import { LINKS } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  property: Property;
  mortgagePercent: number; // Received from parent (FinancialView/App)
}

const InvestorKit: React.FC<Props> = ({ property, mortgagePercent }) => {
  const [investorPrice, setInvestorPrice] = useState<number>(375);
  const [investorRooms, setInvestorRooms] = useState<number>(4);
  const [roiMethod, setRoiMethod] = useState<'total' | 'cash'>('cash');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  const { financials } = property;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  // --- CALCULATION LOGIC ---

  // 1. Calculate Total Contributed (Total Aportado en Pagos durante obra)
  const totalContributed = financials.breakdown.reduce((sum, item) => sum + item.total, 0);

  // 2. Mortgage Logic
  const dynamicLoanAmount = mortgagePercent === 63 
    ? financials.mortgage.loanAmount 
    : financials.totalPrice * (mortgagePercent / 100);

  const dynamicMonthlyPayment = (dynamicLoanAmount / financials.mortgage.loanAmount) * financials.mortgage.monthlyPayment30y;

  // 3. Recovery Logic (Cashback at keys)
  let recoveryPercentage = 0;
  if (mortgagePercent === 80) recoveryPercentage = 17;
  if (mortgagePercent === 70) recoveryPercentage = 7;
  
  const recoveryAmount = recoveryPercentage > 0 ? totalContributed * (recoveryPercentage / 100) : 0;

  // 4. Net Initial Investment (The actual cash "stuck" in the deal)
  const netInitialInvestment = totalContributed - recoveryAmount;

  // 5. Income Logic
  const investorGrossMonthlyIncome = investorRooms * investorPrice;
  const investorGrossAnnualIncome = investorGrossMonthlyIncome * 12;

  // 6. Net Income (Cash Flow) - Used for BOTH calculations now as per request
  const investorNetMonthlyIncome = investorGrossMonthlyIncome - dynamicMonthlyPayment;
  const investorNetAnnualIncome = investorNetMonthlyIncome * 12;

  let displayedInvestmentBasis = 0;
  
  // Logic Update: Both modes use Net Income (Rent - Mortgage).
  // The difference is ONLY the Investment Basis (Total Price vs Cash Invested).
  if (roiMethod === 'total') {
      displayedInvestmentBasis = financials.totalPrice; 
  } else {
      displayedInvestmentBasis = netInitialInvestment;
  }

  const displayedAnnualReturn = investorNetAnnualIncome;
  const displayedMonthlyReturn = investorNetMonthlyIncome;

  const investorYield = (displayedAnnualReturn / displayedInvestmentBasis) * 100;
  const investorPaybackYears = displayedInvestmentBasis / displayedAnnualReturn;

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);

    try {
        const originalElement = printRef.current;
        const originalWidth = originalElement.offsetWidth;
        const originalHeight = originalElement.offsetHeight;
        
        // Configuration for A4
        const pdfPageWidthMm = 210;
        const marginMm = 10;
        const contentWidthMm = pdfPageWidthMm - (marginMm * 2);
        
        // Capture logic
        const canvas = await html2canvas(originalElement, {
            scale: 2, // High resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#0f172a', // Match the bg-slate-900 color (Blue theme)
            windowWidth: originalWidth,
            windowHeight: originalHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calculate image height to fit width
        const pdfImgHeight = (canvas.height * contentWidthMm) / canvas.width;

        // Header Title in PDF
        pdf.setFontSize(16);
        pdf.setTextColor(30, 58, 138); // Dark Blue text
        pdf.text(`Estudio de Inversión - V${property.number}`, marginMm, marginMm + 5);
        
        pdf.addImage(imgData, 'PNG', marginMm, marginMm + 15, contentWidthMm, pdfImgHeight);
        
        // Add footer text
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text("Generado por Simulador Huertos de la Cañada", marginMm, pdfPageWidthMm * 1.35);

        pdf.save(`Inversion_V${property.number}_${property.name}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Hubo un error al generar el PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div ref={printRef} className="bg-slate-900 rounded-xl shadow-xl border-2 border-slate-700 overflow-hidden mt-8 animate-fade-in-up text-white">
      {/* Header */}
      <div className="bg-slate-950 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800">
        <div>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none mb-2">
                CONVIERTE MI VIVIENDA<br/><span className="text-blue-400">EN UN NEGOCIO</span>
            </h3>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 012 2h2a2 2 0 012-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Kit del Inversor
            </div>
        </div>
        
        {/* Light Tabs for ROI Method */}
        <div className="flex bg-slate-800 rounded-lg p-1.5 shadow-inner" data-html2canvas-ignore="true">
            <button 
                onClick={() => setRoiMethod('cash')}
                className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${roiMethod === 'cash' ? 'bg-blue-100 text-blue-900 shadow' : 'text-slate-400 hover:text-white'}`}
            >
                Sobre Aportado
            </button>
            <button 
                onClick={() => setRoiMethod('total')}
                className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${roiMethod === 'total' ? 'bg-blue-100 text-blue-900 shadow' : 'text-slate-400 hover:text-white'}`}
            >
                Sobre Total
            </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Connection Notice */}
        <div className="bg-blue-900/30 text-blue-100 text-sm p-4 rounded-lg border border-blue-800 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <p>Conectado a la simulación: <strong>{mortgagePercent}% Hipoteca</strong>. {recoveryAmount > 0 ? `Se incluye la devolución de ${formatCurrency(recoveryAmount)} al calcular la inversión inicial.` : 'Ajusta el porcentaje en la derecha para ver el efecto en tu capital.'}</p>
        </div>

        {/* Sliders - INCREASED SIZE */}
        <div className="space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between mb-3 items-center">
                    <label className="text-lg font-bold text-blue-100">Precio Alquiler / Habitación</label>
                    <span className="text-xl font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded shadow-sm min-w-[100px] text-center">{formatCurrency(investorPrice)}</span>
                </div>
                <input 
                    type="range" min="250" max="600" step="10" 
                    value={investorPrice} 
                    onChange={(e) => setInvestorPrice(parseInt(e.target.value))}
                    className="w-full h-4 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                    <span>250 €</span>
                    <span>600 €</span>
                </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between mb-3 items-center">
                    <label className="text-lg font-bold text-blue-100">Ocupación (Habitaciones)</label>
                    <span className="text-xl font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded shadow-sm min-w-[100px] text-center">{investorRooms} / 4</span>
                </div>
                <input 
                    type="range" min="1" max="4" step="1" 
                    value={investorRooms} 
                    onChange={(e) => setInvestorRooms(parseInt(e.target.value))}
                    className="w-full h-4 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
                 <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                    <span>1 Hab</span>
                    <span>4 Hab</span>
                </div>
            </div>
        </div>

        {/* Investment Basis Display - Dynamic for both modes */}
        <div className="bg-slate-950 p-5 rounded-lg shadow-inner border border-slate-800 flex justify-between items-center transition-all duration-300">
            <div>
                <p className="text-xs uppercase font-bold text-blue-300 tracking-wider">
                    {roiMethod === 'cash' ? 'Inversión Inicial Neta (Aportado)' : 'Valor Total Inmueble'}
                </p>
                {roiMethod === 'cash' ? (
                    <p className="text-xs text-blue-400 opacity-80 mt-1">
                        {formatCurrency(totalContributed)} (Aportado)
                        {recoveryAmount > 0 && <span className="font-bold text-blue-300"> - {formatCurrency(recoveryAmount)} (Devolución)</span>}
                    </p>
                ) : (
                    <p className="text-xs text-blue-400 opacity-80 mt-1">
                        Precio de venta con IVA incluido
                    </p>
                )}
            </div>
            <div className="text-right">
                 <p className="text-3xl font-bold text-white tracking-tight">{formatCurrency(displayedInvestmentBasis)}</p>
            </div>
        </div>

        {/* Big Stats */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl shadow-md z-10 tracking-wider">
                HIPOTECA DESCONTADA
            </div>

            <div className="mb-6 mt-2">
                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4 text-center">
                    Flujo de Caja Neto (Mensual)
                </p>
                
                {/* Visual Breakdown */}
                 <div className="w-full bg-slate-900/50 p-5 rounded-xl border border-slate-700 shadow-sm">
                    {/* Breakdown Rows */}
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-blue-300 font-medium text-sm">Ingresos Alquiler</span>
                        <span className="text-xl font-bold text-blue-400">+{formatCurrency(investorGrossMonthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-5 pb-5 border-b border-slate-700">
                        <span className="text-blue-300 font-medium text-sm">Cuota Hipoteca</span>
                        <span className="text-xl font-bold text-red-400">-{formatCurrency(dynamicMonthlyPayment)}</span>
                    </div>
                    
                    {/* Net Result - HUGE */}
                    <div className="flex flex-col items-center justify-center bg-slate-950 rounded-lg py-6 border border-slate-800 shadow-inner">
                        <span className="text-blue-400 text-xs uppercase font-bold tracking-widest mb-2">Beneficio Mensual</span>
                        <span className="text-6xl font-black text-white tracking-tighter leading-none">
                            {formatCurrency(displayedMonthlyReturn)}
                        </span>
                        <span className="text-blue-300 text-sm font-medium mt-2">Neto / mes</span>
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-6 mt-4">
                 <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-sm">
                    <p className="text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-2">
                        Rentabilidad {roiMethod === 'cash' ? '(Sobre Aportado)' : '(s/ Total)'}
                    </p>
                    <p className={`text-4xl md:text-5xl font-black ${investorYield > 0 ? 'text-blue-300' : 'text-red-400'}`}>
                        {investorYield.toFixed(1)}%
                    </p>
                 </div>
                 <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-sm">
                    <p className="text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-2">
                        Amortización {roiMethod === 'cash' ? 'Inversión' : 'Inmueble'}
                    </p>
                    <p className="text-4xl md:text-5xl font-black text-orange-400">
                        {investorPaybackYears > 0 ? investorPaybackYears.toFixed(1) : '∞'} <span className="text-lg md:text-xl text-blue-500 font-bold">años</span>
                    </p>
                 </div>
            </div>
         </div>

         {/* Actions */}
         <div className="flex flex-col gap-3" data-html2canvas-ignore="true">
            {/* Generate PDF Button */}
            <button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className={`w-full bg-white hover:bg-stone-50 text-blue-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-stone-200 transition-all shadow-md transform hover:scale-[1.02] ${isGeneratingPdf ? 'opacity-70 cursor-wait' : ''}`}
            >
                {isGeneratingPdf ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generando PDF...
                    </>
                ) : (
                    <>
                         <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Descargar Estudio PDF
                    </>
                )}
            </button>

            {/* External Link */}
            <a 
                href={LINKS.studentRentForecast}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-900 hover:bg-blue-800 text-blue-100 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-blue-700 transition-all shadow-sm hover:shadow-md text-sm"
            >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Ver Previsión Alquiler Estudiantes (Drive)
            </a>
         </div>

      </div>
    </div>
  );
};

export default InvestorKit;