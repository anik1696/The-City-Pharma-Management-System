

export const interactionDatabase = [
  {
    drug1: ['Ibuprofen', 'Ibuprofen 400mg'],
    drug2: ['Metformin', 'Metformin HCl', 'Metformin 500mg'],
    severity: 'moderate',
    title: 'Ibuprofen + Metformin',
    description: 'NSAIDs like Ibuprofen can reduce kidney function, which may cause Metformin to accumulate in the blood and increase the risk of lactic acidosis.',
    recommendation: 'Monitor renal function closely. Consider paracetamol as an alternative pain reliever.',
    icon: '⚠️',
  },
  {
    drug1: ['Aspirin', 'Aspirin 75mg'],
    drug2: ['Ibuprofen', 'Ibuprofen 400mg'],
    severity: 'moderate',
    title: 'Aspirin + Ibuprofen',
    description: 'Concurrent use may reduce the cardioprotective effect of low-dose aspirin. Both drugs compete for the same COX-1 binding site.',
    recommendation: 'If both are needed, take aspirin at least 2 hours before Ibuprofen.',
    icon: '⚠️',
  },
  {
    drug1: ['Amlodipine', 'Amlodipine Besylate', 'Amlodipine 5mg'],
    drug2: ['Atorvastatin', 'Atorvastatin 40mg'],
    severity: 'mild',
    title: 'Amlodipine + Atorvastatin',
    description: 'Amlodipine can increase plasma levels of Atorvastatin by inhibiting its metabolism, potentially increasing the risk of muscle-related side effects (myopathy).',
    recommendation: 'Maximum Atorvastatin dose should not exceed 40mg/day when combined with Amlodipine. Monitor for muscle pain.',
    icon: '💊',
  },
  {
    drug1: ['Omeprazole', 'Pantoprazole', 'Omeprazole 20mg', 'Pantoprazole 40mg'],
    drug2: ['Metformin', 'Metformin HCl', 'Metformin 500mg'],
    severity: 'mild',
    title: 'PPI + Metformin',
    description: 'Proton pump inhibitors (PPIs) may slightly increase Metformin exposure by affecting renal transporters, potentially raising plasma concentrations.',
    recommendation: 'Generally safe at standard doses, but monitor blood glucose levels more closely.',
    icon: '💊',
  },
  {
    drug1: ['Cetirizine', 'Cetirizine HCl', 'Cetirizine 10mg'],
    drug2: ['Loratadine', 'Loratadine 10mg'],
    severity: 'moderate',
    title: 'Cetirizine + Loratadine',
    description: 'Combining two antihistamines does not provide additional benefit and significantly increases the risk of side effects such as excessive sedation, dry mouth, and urinary retention.',
    recommendation: 'Avoid combining. Use only one antihistamine at a time.',
    icon: '🚫',
  },
  {
    drug1: ['Metformin', 'Metformin HCl', 'Metformin 500mg'],
    drug2: ['Atorvastatin', 'Atorvastatin 40mg'],
    severity: 'mild',
    title: 'Metformin + Atorvastatin',
    description: 'Statins can slightly raise blood glucose levels, which may counteract some of the effects of Metformin in diabetic patients.',
    recommendation: 'Monitor blood glucose regularly. This combination is generally manageable under physician supervision.',
    icon: '💊',
  },
  {
    drug1: ['Amoxicillin', 'Amoxicillin 250mg'],
    drug2: ['Azithromycin', 'Azithromycin 500mg'],
    severity: 'mild',
    title: 'Amoxicillin + Azithromycin',
    description: 'Combining two antibiotics without a specific clinical indication can promote antibiotic resistance and increase the risk of side effects like gastrointestinal disturbances.',
    recommendation: 'Dual antibiotic therapy should only be used under physician guidance for specific infections.',
    icon: '⚠️',
  },
  {
    drug1: ['Doxycycline', 'Doxycycline HCl', 'Doxycycline 100mg'],
    drug2: ['Iron', 'Iron + Folic Acid', 'Ferrous Sulphate + Folic Acid'],
    severity: 'moderate',
    title: 'Doxycycline + Iron Supplement',
    description: 'Iron significantly reduces the absorption of Doxycycline (tetracycline-class antibiotics) by forming insoluble chelate complexes in the gut, reducing antibiotic effectiveness.',
    recommendation: 'Take Doxycycline at least 2 hours before or 4-6 hours after the iron supplement.',
    icon: '⚠️',
  },
  {
    drug1: ['Omeprazole', 'Omeprazole 20mg'],
    drug2: ['Azithromycin', 'Azithromycin 500mg'],
    severity: 'moderate',
    title: 'Omeprazole + Azithromycin',
    description: 'Both drugs can prolong the QT interval (a heart electrical measurement). Combining them may increase the risk of cardiac arrhythmias in susceptible patients.',
    recommendation: 'Use with caution, especially in patients with pre-existing heart conditions. Consider alternatives.',
    icon: '❤️',
  },
  {
    drug1: ['Cetirizine', 'Cetirizine HCl', 'Cetirizine 10mg'],
    drug2: ['Azithromycin', 'Azithromycin 500mg'],
    severity: 'moderate',
    title: 'Cetirizine + Azithromycin',
    description: 'Azithromycin may increase Cetirizine plasma levels by inhibiting its renal excretion, potentially increasing sedation and other side effects.',
    recommendation: 'Monitor for increased drowsiness. Consider dose adjustment if needed.',
    icon: '💤',
  },
]

export const severityConfig = {
  mild: {
    label: 'Mild',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/40',
    badge: 'badge-warning',
    dot: 'bg-amber-400',
  },
  moderate: {
    label: 'Moderate',
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/40',
    badge: 'badge-danger',
    dot: 'bg-orange-400',
  },
  severe: {
    label: 'Severe',
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/40',
    badge: 'badge-danger',
    dot: 'bg-red-500',
  },
}

export function checkInteractions(cartItems) {
  const found = []
  const names = cartItems.map(i => i.genericName || i.name)

  for (const interaction of interactionDatabase) {
    const matchDrug1 = names.some(n =>
      interaction.drug1.some(d => n.toLowerCase().includes(d.toLowerCase()))
    )
    const matchDrug2 = names.some(n =>
      interaction.drug2.some(d => n.toLowerCase().includes(d.toLowerCase()))
    )
    if (matchDrug1 && matchDrug2) {
      if (!found.find(f => f.title === interaction.title)) {
        found.push(interaction)
      }
    }
  }
  return found
}
