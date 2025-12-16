export interface FinancialBreakdown {
  concept: string;
  amount: number;
  vat: number;
  total: number;
  date?: string;
  notes?: string;
}

export interface FinancialPlan {
  basePrice: number;
  totalVat: number;
  totalPrice: number;
  breakdown: FinancialBreakdown[];
  mortgage: {
    loanAmount: number; // Cantidad exacta hipoteca (aprox 63%)
    monthlyPayment30y: number; // Estimación mensual
  };
}

export interface Property {
  id: string;
  number: number;
  name: string; // Name of the Villa
  type: 'Normal' | 'Esquina' | 'Parcela' | 'Parcela Piscina';
  street: string;
  areaInterior: number; // Sup. Const. Estancias
  areaTotal: number; // Total Planta (Const + Ext)
  financials: FinancialPlan;
}

export interface GlobalData {
  properties: Property[];
}