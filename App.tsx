import React, { useState } from 'react';
import Header from './components/Header';
import PropertySelector from './components/PropertySelector';
import FinancialView from './components/FinancialView';
import InvestorKit from './components/InvestorKit';
import EnergySavings from './components/EnergySavings';
import Footer from './components/Footer';
import { Property } from './types';
import { PROPERTIES } from './constants';

const App: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Shared State for Financial Simulation
  const [mortgagePercent, setMortgagePercent] = useState<number>(63);
  const [showVat, setShowVat] = useState<boolean>(false);

  const handleSelect = (property: Property) => {
    setSelectedProperty(property);
    // Scroll to details on mobile - points to the Financial View which is order-2
    const details = document.getElementById('details-section');
    if (details) {
      setTimeout(() => details.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        
        <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl font-bold text-green-950">Consulta las medidas y financiación</h2>
            <p className="text-green-800">Selecciona una parcela para ver los detalles económicos</p>
        </div>

        {/* Main Layout Wrapper: Flex on Mobile (to support reordering), Grid on Desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column Group (Selector + Investor + Energy) */}
            {/* 'contents' on mobile allows children to be direct flex items of the main container for reordering */}
            <div className="contents lg:flex lg:flex-col lg:gap-8">
                
                {/* 1. Plano (PropertySelector) - FIRST on Mobile */}
                <div className="order-1 w-full">
                    <PropertySelector 
                        selectedId={selectedProperty?.id || null} 
                        onSelect={handleSelect} 
                    />
                </div>
                
                {/* 3. Kit Inversor (InvestorKit) - LAST on Mobile */}
                {selectedProperty && (
                    <div className="order-3 w-full space-y-8">
                        <InvestorKit 
                            property={selectedProperty} 
                            mortgagePercent={mortgagePercent} 
                        />
                        <EnergySavings />
                    </div>
                )}
            </div>

            {/* Right Column Group (Financial View) */}
            <div className="contents lg:block lg:mt-24">
                
                {/* 2. Cronograma/Hipoteca (FinancialView) - SECOND on Mobile */}
                <div id="details-section" className="order-2 w-full transition-all duration-500 lg:sticky lg:top-24">
                    {selectedProperty ? (
                        <FinancialView 
                            property={selectedProperty} 
                            mortgagePercent={mortgagePercent}
                            onMortgageChange={setMortgagePercent}
                            showVat={showVat}
                            onVatChange={setShowVat}
                        />
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-dashed border-green-200 flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-green-900/50">Ninguna vivienda seleccionada</h3>
                            <p className="text-green-800/60 mt-2">Haz clic en un número del plano interactivo para ver el desglose de precios.</p>
                            
                            <div className="mt-8 text-left text-sm text-green-800/40 max-w-xs mx-auto">
                                <p>Ejemplo:</p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>V1-V2: Esquina (Carlos V)</li>
                                    <li>V3-V14: Tipo Normal</li>
                                    <li>V15-V16: Parcelas especiales</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>

      <Footer />
      
      {/* WhatsApp Floating Button */}
      {selectedProperty && (
         <a 
           href={`https://wa.me/?text=Estoy interesado en la vivienda V${selectedProperty.number} de Huertos de la Cañada. ¿Me podéis enviar más información?`}
           target="_blank"
           rel="noopener noreferrer"
           className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 flex items-center gap-2 border-2 border-green-400"
           aria-label="Compartir en WhatsApp"
         >
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
             Consultar
         </a>
      )}
    </div>
  );
};

export default App;