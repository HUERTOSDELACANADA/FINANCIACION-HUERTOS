import { Property, FinancialPlan, FinancialBreakdown } from './types';

// External Links
export const LINKS = {
  agenda: "https://calendar.app.google/MuHy9FvrmHbfuLpq7",
  dossier: "https://drive.google.com/drive/folders/14NLuZTZ8LkexbxDfBM1iIUHLjd9fghWY?usp=sharing",
  maps: "https://maps.app.goo.gl/iDz9J1orDJpZvQ67A",
  video: "https://youtu.be/mmd3os4GG8s?si=K3dqhIweRx_2maaP",
  web: "https://xn--huertosdelacaada-jub.com/#contact",
  
  // Logos corregidos usando Google Cloud Storage
  ualLogo: "https://storage.googleapis.com/huertos-planos/logo-ual.png",
  huertosLogo: "https://storage.googleapis.com/huertos-planos/HUERTOS%20LOGO.jpg",
  
  studentRentForecast: "https://drive.google.com/file/d/1nVN7A1qKV8g3M-uvt7_lk6qGWj_qmqfU/view?usp=drive_link",
};

export const IMAGES = [
  "https://drive.google.com/thumbnail?id=1jvAdC-anFwsN5rhkcReZUM-q_TSz86Vg&sz=w1000",
  "https://drive.google.com/thumbnail?id=1gwgNPCJEQXZyCfXrbjJ1-t_HYNYVq9ci&sz=w1000",
  "https://drive.google.com/thumbnail?id=10R3OMtd_c4mACkg9lL680VlGBxxjwMSx&sz=w1000",
  "https://drive.google.com/thumbnail?id=1B659iviiZ5Czt26AakDwHh-cThdy-4YC&sz=w1000",
  "https://drive.google.com/thumbnail?id=1zPe3b7mtwPtKEmYVdh4VMqwJYWseqBPd&sz=w1000",
];

// Logos de Partners corregidos usando Google Cloud Storage
export const PARTNER_LOGOS = [
  "https://storage.googleapis.com/huertos-planos/LOGO%20FERRER%20ARQUITECTOS.jpeg",
  "https://storage.googleapis.com/huertos-planos/LOGO%20ERY%20CONSULTING.png",
  "https://storage.googleapis.com/huertos-planos/MORETURISMO%20LOGO.jpeg"
];

// Helper to calculate from Total (User provided Totals in the new table)
const fromTotal = (total: number, concept: string, date?: string, notes?: string): FinancialBreakdown => ({
  concept,
  amount: total / 1.1,
  vat: total - (total / 1.1),
  total: total,
  date,
  notes
});

// Helper for monthly calculation note
const monthlyNote = (total: number, months: number) => {
    const monthly = total / months;
    return `Total: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total)}. Cuota mensual (${months} meses): ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(monthly)}`;
};

// Financial Templates based on New Data Table
// V1, V2: Total Aportado 92.482,00 €
const PLAN_ESQUINA: FinancialPlan = {
  basePrice: 250000, // Manteniendo precio base original referencia
  totalVat: 25000,
  totalPrice: 275000,
  breakdown: [
    fromTotal(13750.00, "Firma Reserva", "Ene 2026"),
    fromTotal(49500.00, "Compra de Solar", "Dic 2026"),
    fromTotal(8250.00, "Cuotas Mensuales", "Feb 2027", monthlyNote(8250, 18)),
    fromTotal(20982.00, "Entrega de Llaves", "Mayo 2028"),
  ],
  mortgage: {
    loanAmount: 173269.80, // Exact value provided
    monthlyPayment30y: 745 // Est calculated
  }
};

// V3-V14: Total Aportado 86.193,22 €
const PLAN_NORMAL: FinancialPlan = {
  basePrice: 233000,
  totalVat: 23300,
  totalPrice: 256300,
  breakdown: [
    fromTotal(12815.00, "Firma Reserva", "Ene 2026"),
    fromTotal(46134.00, "Compra de Solar", "Dic 2026"),
    fromTotal(7689.00, "Cuotas Mensuales", "Feb 2027", monthlyNote(7689, 18)),
    fromTotal(19555.22, "Entrega de Llaves", "Mayo 2028"),
  ],
  mortgage: {
    loanAmount: 161487.45, // Exact value provided
    monthlyPayment30y: 695 // Est calculated
  }
};

// V15: Total Aportado 94.331,64 €
const PLAN_PARCELA_15: FinancialPlan = {
  basePrice: 255000,
  totalVat: 25500,
  totalPrice: 280500,
  breakdown: [
    fromTotal(14025.00, "Firma Reserva", "Ene 2026"),
    fromTotal(50490.00, "Compra de Solar", "Dic 2026"),
    fromTotal(8415.00, "Cuotas Mensuales", "Feb 2027", monthlyNote(8415, 18)),
    fromTotal(21401.64, "Entrega de Llaves", "Mayo 2028"),
  ],
  mortgage: {
    loanAmount: 176735.20, // Exact value provided
    monthlyPayment30y: 760 // Est calculated
  }
};

// V16: Total Aportado 96.181,28 €
const PLAN_PARCELA_16: FinancialPlan = {
  basePrice: 260000,
  totalVat: 26000,
  totalPrice: 286000,
  breakdown: [
    fromTotal(14300.00, "Firma Reserva", "Ene 2026"),
    fromTotal(51480.00, "Compra de Solar", "Dic 2026"),
    fromTotal(8580.00, "Cuotas Mensuales", "Feb 2027", monthlyNote(8580, 18)),
    fromTotal(21821.28, "Entrega de Llaves", "Mayo 2028"),
  ],
  mortgage: {
    loanAmount: 180200.59, // Exact value provided
    monthlyPayment30y: 775 // Est calculated
  }
};

// Measurements Reference from PDF:
// V1, V2: Int: 162.92, Total: 257.36
// Normal (3-14): Int: 160.35, Total: 254.79
// V15: Int: 162.92, Total: 272.29
// V16: Int: 162.92, Total: 305.09

export const PROPERTIES: Property[] = [
  { id: 'v1', number: 1, name: "VILLA GRANADA", type: 'Esquina', street: 'Calle Carlos V', areaInterior: 162.92, areaTotal: 257.36, financials: PLAN_ESQUINA },
  { id: 'v2', number: 2, name: "VILLA ALOE", type: 'Esquina', street: 'Calle Carlos V', areaInterior: 162.92, areaTotal: 257.36, financials: PLAN_ESQUINA },
  
  { id: 'v3', number: 3, name: "VILLA MARGARITA", type: 'Normal', street: 'Calle Miramar', areaInterior: 160.35, areaTotal: 254.79, financials: PLAN_NORMAL },
  { id: 'v4', number: 4, name: "VILLA LAVANDA", type: 'Normal', street: 'Calle Diario de Almería', areaInterior: 160.35, areaTotal: 254.79, financials: PLAN_NORMAL },
  { id: 'v5', number: 5, name: "VILLA NARANJA", type: 'Normal', street: 'Calle Miramar', areaInterior: 160.35, areaTotal: 254.79, financials: PLAN_NORMAL },
  { id: 'v6', number: 6, name: "VILLA TOMILLO", type: 'Normal', street: 'Calle Diario de Almería', areaInterior: 160.35, areaTotal: 254.79, financials: PLAN_NORMAL },
  { id: 'v7', number: 7, name: "VILLA LIMONES", type: 'Normal', street: 'Calle Miramar', areaInterior: 160.35, areaTotal: 254.79, financials: PLAN_NORMAL },
  { id: 'v8', number: 8, name: "VILLA ROMERO", type: 'Normal', street: 'Calle Diario de Almería',
