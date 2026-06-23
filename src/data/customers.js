

export const customers = [
  {
    id: 1,
    name: 'Fatema Begum',
    phone: '+880 1711-234567',
    email: 'fatema.begum@gmail.com',
    address: 'House 12, Zindabazar, Sylhet',
    dateOfBirth: '1985-03-15',
    registeredAt: '2024-01-10',
    allergies: ['Penicillin'],
    notes: 'Regular customer. Diabetic patient.',
    loyaltyPoints: 320,
    totalSpent: 16000,
    tier: 'Silver',
  },
  {
    id: 2,
    name: 'Mohammad Karim',
    phone: '+880 1812-876543',
    email: 'md.karim@yahoo.com',
    address: 'Road 5, Shahjalal Uposhohor, Sylhet',
    dateOfBirth: '1972-07-22',
    registeredAt: '2024-02-18',
    allergies: [],
    notes: 'Hypertension patient. Monthly refill.',
    loyaltyPoints: 180,
    totalSpent: 9000,
    tier: 'Bronze',
  },
  {
    id: 3,
    name: 'Sumaiya Islam',
    phone: '+880 1912-345678',
    email: 'sumaiya.islam@gmail.com',
    address: 'Tilagarh, Sylhet',
    dateOfBirth: '1990-11-08',
    registeredAt: '2024-03-05',
    allergies: ['Sulfa drugs'],
    notes: 'Asthma patient.',
    loyaltyPoints: 650,
    totalSpent: 32500,
    tier: 'Gold',
  },
  {
    id: 4,
    name: 'Abdul Karim Chowdhury',
    phone: '+880 1611-567890',
    email: 'akarim@hotmail.com',
    address: 'Amberkhana, Sylhet',
    dateOfBirth: '1965-04-30',
    registeredAt: '2024-01-25',
    allergies: ['Aspirin'],
    notes: 'Elderly patient. Cholesterol medication.',
    loyaltyPoints: 90,
    totalSpent: 4500,
    tier: 'Bronze',
  },
  {
    id: 5,
    name: 'Nasrin Akter',
    phone: '+880 1751-678901',
    email: 'nasrin.akter@gmail.com',
    address: 'Kumarpara, Sylhet',
    dateOfBirth: '1998-09-14',
    registeredAt: '2024-04-12',
    allergies: [],
    notes: '',
    loyaltyPoints: 40,
    totalSpent: 2000,
    tier: 'Bronze',
  },
]

export const loyaltyTiers = [
  { name: 'Bronze', minPoints: 0,    color: 'text-orange-400',  bg: 'bg-orange-500/15', border: 'border-orange-500/30',  icon: '🥉' },
  { name: 'Silver', minPoints: 200,  color: 'text-slate-300',   bg: 'bg-slate-500/15',  border: 'border-slate-500/30',   icon: '🥈' },
  { name: 'Gold',   minPoints: 500,  color: 'text-amber-400',   bg: 'bg-amber-500/15',  border: 'border-amber-500/30',   icon: '🥇' },
  { name: 'Platinum', minPoints: 1000, color: 'text-cyan-400',  bg: 'bg-cyan-500/15',   border: 'border-cyan-500/30',    icon: '💎' },
]

export function getTier(points) {
  const tiers = [...loyaltyTiers].reverse()
  return tiers.find(t => points >= t.minPoints) || loyaltyTiers[0]
}

export const purchaseHistory = [
  {
    id: 'INV-2024-001',
    customerId: 1,
    date: '2024-06-15',
    items: [
      { medicineId: 4, name: 'Metformin 500mg', qty: 2, price: 130 },
      { medicineId: 1, name: 'Paracetamol 500mg', qty: 1, price: 50 },
    ],
    total: 310,
    pointsEarned: 6,
    paymentMethod: 'Cash',
    staff: 'Hamza Hassan',
  },
  {
    id: 'INV-2024-015',
    customerId: 1,
    date: '2024-05-28',
    items: [
      { medicineId: 4, name: 'Metformin 500mg', qty: 2, price: 130 },
      { medicineId: 8, name: 'Vitamin C 1000mg', qty: 3, price: 110 },
    ],
    total: 590,
    pointsEarned: 11,
    paymentMethod: 'bKash',
    staff: 'Rahim Uddin',
  },
  {
    id: 'INV-2024-022',
    customerId: 2,
    date: '2024-06-18',
    items: [
      { medicineId: 17, name: 'Amlodipine 5mg', qty: 1, price: 160 },
      { medicineId: 9, name: 'Atorvastatin 40mg', qty: 1, price: 300 },
    ],
    total: 460,
    pointsEarned: 9,
    paymentMethod: 'Nagad',
    staff: 'Hamza Hassan',
  },
  {
    id: 'INV-2024-031',
    customerId: 3,
    date: '2024-06-10',
    items: [
      { medicineId: 14, name: 'Salbutamol Inhaler', qty: 1, price: 700 },
      { medicineId: 5,  name: 'Cough Syrup Plus', qty: 2, price: 240 },
    ],
    total: 1180,
    pointsEarned: 23,
    paymentMethod: 'Cash',
    staff: 'Karim Hossain',
  },
  {
    id: 'INV-2024-042',
    customerId: 4,
    date: '2024-06-20',
    items: [
      { medicineId: 9, name: 'Atorvastatin 40mg', qty: 1, price: 300 },
    ],
    total: 300,
    pointsEarned: 6,
    paymentMethod: 'Card',
    staff: 'Rahim Uddin',
  },
]
