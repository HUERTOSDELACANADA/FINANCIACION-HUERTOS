import React, { useRef } from 'react';
import { Property } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  property: Property;
  mortgagePercent: number;
  onMortgageChange: (val: number) => void;
  showVat: boolean;
  onVatChange: (val: boolean) => void;
}

const FinancialView: React.FC<Props> = ({ property, mortgagePercent, onMortgageChange, showVat, onVatChange }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState<boolean>(false);
  
  // Ref for the element we want to capture
  const printRef = useRef<HTMLDivElement>(null);
  
  const { financials } = property;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };
  
  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(val);
  };

  // Determine displayed price based on toggle
  const displayedPrice = showVat ? financials.totalPrice : financials.basePrice;

  // Get specific breakdown items for the chart
  const itemReserva = financials.breakdown[0];
  const itemSolar = financials.breakdown[1];
  const itemObra = financials.breakdown[2]; // Total Obra
  const itemLlaves = financials.breakdown[3];

  // Helper to get value based on VAT toggle for specific items
  const getVal = (item: any) => showVat ? item.total : item.amount;

  // Construction Monthly Calculation
  const quotaDivisor = 18; 
  const monthlyConstructionPayment = getVal(itemObra) / quotaDivisor;

  // Visual Timeline Intervals
  const monthsReservaToSolar = 11; 
  const monthsSolarToObra = 2;     
  const monthsObraToKeys = 15;     

  // Calculations for Price per M2
  const priceM2Interior = displayedPrice / property.areaInterior;
  const priceM2Total = displayedPrice / property.areaTotal;

  // --- MORTGAGE & RECOVERY LOGIC ---
  
  // 1. Calculate Total Contributed (Total "Puesto")
  const totalContributed = financials.breakdown.reduce((sum, item) => sum + item.total, 0);

  // 2. Determine Loan Amount
  const dynamicLoanAmount = mortgagePercent === 63 
    ? property.financials.mortgage.loanAmount 
    : property.financials.totalPrice * (mortgagePercent / 100);

  // 3. Calculate Monthly Payment (Proportional to the default simulation)
  const dynamicMonthlyPayment = (dynamicLoanAmount / property.financials.mortgage.loanAmount) * property.financials.mortgage.monthlyPayment30y;

  // 4. Calculate Recovery Amount (Surplus)
  let recoveryPercentage = 0;
  if (mortgagePercent === 80) recoveryPercentage = 17;
  if (mortgagePercent === 70) recoveryPercentage = 7;
  
  const recoveryAmount = recoveryPercentage > 0 ? totalContributed * (recoveryPercentage / 100) : 0;

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);

    try {
        const originalElement = printRef.current;
        const clone = originalElement.cloneNode(true) as HTMLElement;
        const originalWidth = originalElement.offsetWidth;
        
        clone.style.width = `${originalWidth}px`;
        clone.style.position = 'absolute';
        clone.style.top = '-10000px';
        clone.style.left = '-10000px';
        clone.classList.add('bg-white'); 
        
        document.body.appendChild(clone);

        const pdfPageWidthMm = 210;
        const pdfPageHeightMm = 297;
        const marginMm = 10;
        const contentHeightMm = pdfPageHeightMm - (marginMm * 2);
        const contentWidthMm = pdfPageWidthMm - (marginMm * 2);
        const pxPerMm = originalWidth / contentWidthMm;
        const pageContentHeightPx = contentHeightMm * pxPerMm;
        
        let currentY = 0;
        const header = clone.querySelector('.bg-green-950') as HTMLElement;
        if (header) currentY += header.offsetHeight;

        const contentDiv = clone.querySelector('.p-6') as HTMLElement;
        if (contentDiv) {
            const contentStyle = window.getComputedStyle(contentDiv);
            currentY += parseFloat(contentStyle.paddingTop) || 0;

            const children = Array.from(contentDiv.children) as HTMLElement[];
            for (const child of children) {
                if (child.style.display === 'none') continue;
                const style = window.getComputedStyle(child);
                const marginTop = parseFloat(style.marginTop) || 0;
                const marginBottom = parseFloat(style.marginBottom) || 0;
                const childHeight = child.offsetHeight + marginBottom;
                const elementStartY = currentY + marginTop;
                const elementEndY = elementStartY + childHeight;
                const startPage = Math.floor(elementStartY / pageContentHeightPx);
                const endPage = Math.floor(elementEndY / pageContentHeightPx);
                
                if (startPage !== endPage) {
                    const nextPageStartY = (startPage + 1) * pageContentHeightPx;
                    const spacer = nextPageStartY - elementStartY;
                    child.style.marginTop = `${marginTop + spacer}px`;
                    currentY += spacer + marginTop + childHeight;
                } else {
                    currentY += marginTop + childHeight;
                }
            }
        }

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: originalWidth,
            windowHeight: clone.scrollHeight + 500
        });

        document.body.removeChild(clone);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const totalCanvasHeight = canvas.height;
        const pageCanvasHeight = pageContentHeightPx * 2;
        let currentCanvasY = 0;
        
        while (currentCanvasY < totalCanvasHeight) {
            if (currentCanvasY > 0) pdf.addPage();
            const sliceHeight = Math.min(pageCanvasHeight, totalCanvasHeight - currentCanvasY);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeight;
            const ctx = sliceCanvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(canvas, 0, currentCanvasY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
                const sliceImgData = sliceCanvas.toDataURL('image/png');
                const pdfImgHeight = (sliceHeight * contentWidthMm) / canvas.width;
                pdf.addImage(sliceImgData, 'PNG', marginMm, marginMm, contentWidthMm, pdfImgHeight);
            }
            currentCanvasY += pageCanvasHeight;
        }

        pdf.save(`Plan_Financiero_V${property.number}_${property.name}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Hubo un error al generar el PDF. Por favor, inténtelo de nuevo.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div ref={printRef} className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-200 animate-fade-in-up relative">
      {/* Header */}
      <div className="bg-green-950 text-white p-6 flex justify-between items-center flex-wrap gap-4 border-b border-green-800">
        <div>
          <div className="flex items-baseline gap-3">
             <h2 className="text-3xl font-bold text-green-400">V{property.number}</h2>
             <span className="text-2xl font-light font-serif">{property.name}</span>
          </div>
          <p className="text-sm opacity-80 uppercase tracking-wide mt-1 text-green-100">{property.type} - {property.street}</p>
        </div>
        <div className="text-right">
            <p className="text-xs uppercase text-green-300 mb-1">{showVat ? "Precio Total (IVA Incluido)" : "Precio Base (IVA no incluido)"}</p>
            <p className="text-3xl font-bold text-white transition-all duration-300">{formatCurrency(displayedPrice)}</p>
        </div>
      </div>

      <div className="p-6">
        
        {/* Measurements & Ratios Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                <h4 className="text-green-700 text-xs uppercase font-bold mb-2">Sup. Const. Estancias (Interior)</h4>
                <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-green-950">{formatNumber(property.areaInterior)} m²</span>
                    <div className="text-right">
                        <span className="block text-xs text-green-600">Precio / m² ({showVat ? 'C/IVA' : 'S/IVA'})</span>
                        <span className="font-bold text-green-700">{formatCurrency(priceM2Interior)}/m²</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="text-green-800 text-xs uppercase font-bold mb-2">Total Planta (Const. + Exterior)</h4>
                <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-green-950">{formatNumber(property.areaTotal)} m²</span>
                    <div className="text-right">
                        <span className="block text-xs text-green-600">Precio / m² ({showVat ? 'C/IVA' : 'S/IVA'})</span>
                        <span className="font-bold text-green-700">{formatCurrency(priceM2Total)}/m²</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- SMART TIMELINE CHART --- */}
        <div className="mb-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-green-100 pb-4">
                <h3 className="text-xl font-bold text-green-950">Cronograma Visual de Pagos</h3>
                
                {/* VAT Toggle inside Chart Area - LIGHT COLORS */}
                <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-full border border-stone-200" data-html2canvas-ignore="true">
                    <button
                        onClick={() => onVatChange(false)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!showVat ? 'bg-white text-green-800 shadow-sm ring-1 ring-green-200' : 'text-stone-400 hover:text-green-600'}`}
                    >
                        SIN IVA
                    </button>
                    <button
                        onClick={() => onVatChange(true)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${showVat ? 'bg-green-200 text-green-900 shadow-sm' : 'text-stone-400 hover:text-green-600'}`}
                    >
                        CON IVA
                    </button>
                </div>
            </div>
            
            <div className="relative pl-4 md:pl-8 space-y-0">
                
                {/* 1. RESERVA */}
                <div className="relative pb-0">
                    <div className="absolute -left-[5px] md:-left-[5px] top-0 w-4 h-4 rounded-full bg-green-950 border-2 border-white ring-2 ring-green-200 z-10"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-green-100 p-3 rounded-lg shadow-sm -mt-2 ml-6 relative">
                        <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b border-green-100 transform rotate-45"></div>
                        <div>
                            <span className="text-xs font-bold text-green-600 uppercase block">Ene 2026 - Hito 1</span>
                            <span className="font-bold text-green-950">Firma Reserva</span>
                        </div>
                        <span className="font-bold text-xl text-green-800">{formatCurrency(getVal(itemReserva))}</span>
                    </div>
                </div>

                {/* GAP 1: Reserva -> Solar */}
                <div className="pl-6 py-6 border-l-2 border-dashed border-green-300 ml-[2px] relative">
                     <div className="absolute top-1/2 -translate-y-1/2 left-0 ml-[-12px] md:ml-[-12px] bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                        {monthsReservaToSolar} MESES
                     </div>
                </div>

                {/* 2. COMPRA SOLAR */}
                <div className="relative pb-0">
                    <div className="absolute -left-[5px] md:-left-[5px] top-0 w-4 h-4 rounded-full bg-green-950 border-2 border-white ring-2 ring-green-200 z-10"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-green-100 p-3 rounded-lg shadow-sm -mt-2 ml-6 relative">
                         <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b border-green-100 transform rotate-45"></div>
                        <div>
                            <span className="text-xs font-bold text-green-600 uppercase block">Dic 2026 - Hito 2</span>
                            <span className="font-bold text-green-950">Compra de Solar</span>
                        </div>
                        <span className="font-bold text-xl text-green-800">{formatCurrency(getVal(itemSolar))}</span>
                    </div>
                </div>

                {/* GAP 2: Solar -> Obra */}
                <div className="pl-6 py-6 border-l-2 border-dashed border-green-300 ml-[2px] relative">
                     <div className="absolute top-1/2 -translate-y-1/2 left-0 ml-[-12px] md:ml-[-12px] bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                        {monthsSolarToObra} MESES
                     </div>
                </div>

                {/* 3. INICIO PAGOS OBRA */}
                <div className="relative pb-0">
                     <div className="absolute -left-[5px] md:-left-[5px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white ring-2 ring-green-200 z-10"></div>
                     <div className="bg-green-50 border border-green-100 p-3 rounded-lg ml-6 relative -mt-2">
                        <div className="absolute top-4 -left-2 w-4 h-4 bg-green-50 border-l border-b border-green-100 transform rotate-45"></div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                             <div>
                                <span className="text-xs font-bold text-green-600 uppercase block">Feb 2027 - Inicio Pagos</span>
                                <span className="font-bold text-green-950">Mensualidades Obra</span>
                             </div>
                             <div className="text-right">
                                <span className="block text-xs text-green-600">Cuota Mensual (x{quotaDivisor})</span>
                                <span className="font-bold text-lg text-green-700">{formatCurrency(monthlyConstructionPayment)}/mes</span>
                             </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600 border-t border-green-200 pt-2 flex justify-between">
                            <span>Total fase de obra:</span>
                            <strong className="text-base">{formatCurrency(getVal(itemObra))}</strong>
                        </div>
                     </div>
                </div>

                {/* GAP 3: Obra -> Entrega */}
                <div className="pl-6 py-8 border-l-4 border-green-500 ml-[1px] relative">
                     <div className="absolute top-1/2 -translate-y-1/2 left-0 ml-[-12px] md:ml-[-12px] bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200 shadow-sm z-10 whitespace-nowrap">
                        {monthsObraToKeys} MESES DE EJECUCIÓN
                     </div>
                </div>

                {/* 4. ENTREGA LLAVES */}
                <div className="relative">
                    <div className="absolute -left-[10px] md:-left-[10px] top-0 w-6 h-6 rounded-full bg-green-600 border-4 border-white ring-2 ring-green-600 z-10 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-green-950 text-white p-4 rounded-lg shadow-lg -mt-3 ml-6 relative">
                        <div className="absolute top-4 -left-2 w-4 h-4 bg-green-950 transform rotate-45"></div>
                        <div>
                            <span className="text-xs font-bold text-green-400 uppercase block">Mayo 2028 - FIN DE OBRA</span>
                            <span className="font-bold text-lg">Entrega de Llaves</span>
                        </div>
                        <span className="font-bold text-2xl text-green-400">{formatCurrency(getVal(itemLlaves))}</span>
                    </div>
                </div>

            </div>
        </div>

        <h3 className="text-xl font-bold text-green-900 mb-4 border-b border-green-100 pb-2">Desglose Detallado</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-green-800">
            <thead className="text-xs text-green-900 uppercase bg-green-100/50">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">Concepto / Hito</th>
                <th scope="col" className="px-6 py-3 text-right">Base Imponible</th>
                <th scope="col" className="px-6 py-3 text-right">IVA (10%)</th>
                <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {financials.breakdown.map((item, idx) => (
                <tr key={idx} className="bg-white border-b border-green-50 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-green-950">
                    {item.concept}
                    {item.date && <span className="block text-xs text-green-600 font-normal">{item.date}</span>}
                    {item.notes && <span className="block text-xs text-green-400/80 italic">{item.notes}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">{formatCurrency(item.amount)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(item.vat)}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              <tr className="bg-green-50 border-t-2 border-green-200">
                <td className="px-6 py-4 font-bold text-lg text-green-950">TOTALES (Aportado en pagos)</td>
                <td className="px-6 py-4 text-right font-bold text-lg"></td>
                <td className="px-6 py-4 text-right font-bold text-lg"></td>
                <td className="px-6 py-4 text-right font-bold text-lg text-green-700">
                    {formatCurrency(totalContributed)}
                </td>
              </tr>
              <tr className="bg-white">
                <td colSpan={4} className="px-6 py-2 text-xs text-right text-stone-400 italic">
                    * El resto del importe hasta completar el precio total ({formatCurrency(financials.totalPrice)}) corresponde a la subrogación hipotecaria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dynamic Mortgage Simulation - DARKER THEME */}
        <div className="mt-8 bg-green-900 rounded-lg p-6 border border-green-800 transition-all duration-300 text-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h4 className="font-bold text-green-100 text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    Simulación Hipoteca
                </h4>
                
                {/* Percentage Toggles - Ignore in PDF because interactivity is lost */}
                <div className="flex bg-green-800 rounded-lg p-1 shadow-inner border border-green-700" data-html2canvas-ignore="true">
                    {[80, 70, 63].map((pct) => (
                        <button
                            key={pct}
                            onClick={() => onMortgageChange(pct)}
                            className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                                mortgagePercent === pct 
                                ? 'bg-green-100 text-green-900 shadow-sm' 
                                : 'text-green-300 hover:text-white'
                            }`}
                        >
                            {pct}%
                        </button>
                    ))}
                </div>
                {/* Visual fallback for PDF only */}
                <div className="hidden pdf-only text-sm font-bold text-green-200">
                    Escenario: {mortgagePercent}% Financiación
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1 w-full">
                        <p className="text-sm text-green-200 mb-2">
                            Calculado sobre el precio TOTAL (con IVA). Importe a financiar estimado ({mortgagePercent}%):
                        </p>
                        <p className="text-3xl font-bold text-white mb-3 tracking-wide">
                            {formatCurrency(dynamicLoanAmount)}
                        </p>
                        
                        {/* Bank Info */}
                        <div className="bg-green-800/50 border border-green-700 rounded p-3 text-xs text-green-200">
                            <span className="font-bold text-white">Entidades Financieras:</span> Actualmente se está negociando la financiación con <span className="font-bold text-white">Caixa, Cajamar y Cajasur</span>.
                        </div>
                    </div>
                    
                    <div className="bg-green-800 p-4 rounded-xl shadow-lg text-center min-w-[200px] w-full md:w-auto border border-green-700">
                        <p className="text-xs text-green-300 uppercase font-bold tracking-wider">Cuota Mensual Est.</p>
                        <p className="text-3xl font-bold text-white mt-1">{formatCurrency(dynamicMonthlyPayment)}<span className="text-sm font-normal text-green-300">/mes</span></p>
                        <p className="text-[10px] text-green-400 mt-1">Plazo estimado 30 años</p>
                    </div>
                </div>

                {/* RECOVERY / CASHBACK INFO */}
                {recoveryAmount > 0 && (
                    <div className="bg-emerald-900 border-l-4 border-emerald-400 p-4 rounded-r-lg animate-fade-in-up">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-800 p-2 rounded-full shadow-sm text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h5 className="font-bold text-white text-lg">Dinero a Recuperar en Entrega de Llaves</h5>
                                <p className="text-sm text-emerald-200 mb-1">
                                    Al financiar el <strong>{mortgagePercent}%</strong>, recuperas el <strong>{recoveryPercentage}%</strong> de lo aportado durante la obra ({formatCurrency(totalContributed)}).
                                </p>
                                <p className="text-2xl font-bold text-emerald-300 mt-2">
                                    {formatCurrency(recoveryAmount)} <span className="text-sm font-normal text-emerald-100/70">a tu favor</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-green-200 flex flex-col md:flex-row justify-end items-center gap-4" data-html2canvas-ignore="true">
            <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className={`w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${isGeneratingPdf ? 'bg-stone-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
                {isGeneratingPdf ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generando PDF...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Descargar Informe PDF
                    </>
                )}
            </button>
        </div>

        <div className="mt-4 text-xs text-stone-400 text-center">
            * Información informativa no contractual. Precios válidos salvo error tipográfico. IVA vigente 10% incluido en totales. Financiación sujeta a aprobación bancaria. El precio/m² mostrado arriba varía según se seleccione con o sin IVA.
        </div>
      </div>
    </div>
  );
};

export default FinancialView;