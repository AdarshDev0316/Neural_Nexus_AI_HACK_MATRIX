// ============================================
// PharmaQuest AI - Pharmaceutical Data
// Mock Data for Demo & Simulations
// ============================================

import { Molecule, AyurvedaCompound, DrugData, ResearchTrend, Mission, KnowledgeCard, Scenario } from '@/types';

// === ELEMENT DATA ===
export const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', color: '#FFFFFF', bonds: 1 },
  { symbol: 'C', name: 'Carbon', color: '#404040', bonds: 4 },
  { symbol: 'N', name: 'Nitrogen', color: '#3050F8', bonds: 3 },
  { symbol: 'O', name: 'Oxygen', color: '#FF0D0D', bonds: 2 },
  { symbol: 'S', name: 'Sulfur', color: '#FFFF30', bonds: 2 },
  { symbol: 'P', name: 'Phosphorus', color: '#FF8000', bonds: 5 },
  { symbol: 'Cl', name: 'Chlorine', color: '#1FF01F', bonds: 1 },
  { symbol: 'F', name: 'Fluorine', color: '#90E050', bonds: 1 },
  { symbol: 'Br', name: 'Bromine', color: '#A62929', bonds: 1 },
];

// === MOLECULE TEMPLATES ===
export const MOLECULE_TEMPLATES: Molecule[] = [
  {
    id: 'aspirin',
    name: 'Aspirin',
    formula: 'C₉H₈O₄',
    atoms: [
      { id: 'c1', element: 'Carbon', symbol: 'C', color: '#404040', position: { x: 0, y: 0, z: 0 }, bonds: ['c2', 'c6', 'c7'] },
      { id: 'c2', element: 'Carbon', symbol: 'C', color: '#404040', position: { x: 1.2, y: 0.7, z: 0 }, bonds: ['c1', 'c3'] },
      { id: 'c3', element: 'Carbon', symbol: 'C', color: '#404040', position: { x: 2.4, y: 0, z: 0 }, bonds: ['c2', 'c4'] },
      { id: 'c4', element: 'Carbon', symbol: 'C', color: '#404040', position: { x: 2.4, y: -1.4, z: 0 }, bonds: ['c3', 'c5'] },
      { id: 'c5', element: 'Carbon', symbol: 'C', color: '#404040', position: { x: 1.2, y: -2.1, z: 0 }, bonds: ['c4', 'c6'] },
      { id: 'c6', element: 'Carbon', symbol: 'C', color: '#404040', position: { x: 0, y: -1.4, z: 0 }, bonds: ['c5', 'c1', 'o1'] },
      { id: 'c7', element: 'Carbon', symbol: 'C', color: '#404040', position: { x: -1.2, y: 0.7, z: 0 }, bonds: ['c1', 'o2', 'o3'] },
      { id: 'o1', element: 'Oxygen', symbol: 'O', color: '#FF0D0D', position: { x: -1.2, y: -2.1, z: 0 }, bonds: ['c6', 'c8'] },
      { id: 'o2', element: 'Oxygen', symbol: 'O', color: '#FF0D0D', position: { x: -2.4, y: 0, z: 0 }, bonds: ['c7'] },
      { id: 'o3', element: 'Oxygen', symbol: 'O', color: '#FF0D0D', position: { x: -1.2, y: 2.1, z: 0 }, bonds: ['c7'] },
    ],
    bonds: [],
    properties: {
      molecularWeight: 180.16,
      solubility: 'Slightly soluble in water',
      bioavailability: '80-100%',
      toxicity: 'Low at therapeutic doses'
    }
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    formula: 'C₈H₁₀N₄O₂',
    atoms: [],
    bonds: [],
    properties: {
      molecularWeight: 194.19,
      solubility: 'Freely soluble in water',
      bioavailability: '99%',
      toxicity: 'Low to moderate'
    }
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    formula: 'C₁₃H₁₈O₂',
    atoms: [],
    bonds: [],
    properties: {
      molecularWeight: 206.29,
      solubility: 'Practically insoluble in water',
      bioavailability: '80-100%',
      toxicity: 'Low at therapeutic doses'
    }
  }
];

// === AYURVEDA COMPOUNDS DATABASE ===
export const AYURVEDA_COMPOUNDS: AyurvedaCompound[] = [
  {
    id: 'ay1',
    name: 'Salicin',
    plantSource: 'Willow Bark (Salix alba)',
    activeIngredients: ['Salicylic acid', 'Salicin glycoside'],
    modernEquivalent: 'Aspirin',
    therapeuticUses: ['Pain relief', 'Anti-inflammatory', 'Fever reduction'],
    chemicalStructure: 'C₁₃H₁₈O₇'
  },
  {
    id: 'ay2',
    name: 'Curcumin',
    plantSource: 'Turmeric (Curcuma longa)',
    activeIngredients: ['Curcuminoids', 'Diferuloylmethane'],
    modernEquivalent: 'Anti-inflammatory drugs',
    therapeuticUses: ['Anti-inflammatory', 'Antioxidant', 'Cancer prevention'],
    chemicalStructure: 'C₂₁H₂₀O₆'
  },
  {
    id: 'ay3',
    name: 'Reserpine',
    plantSource: 'Sarpagandha (Rauwolfia serpentina)',
    activeIngredients: ['Reserpine', 'Ajmaline'],
    modernEquivalent: 'Antihypertensive drugs',
    therapeuticUses: ['Blood pressure control', 'Mental disorders', 'Sedation'],
    chemicalStructure: 'C₃₃H₄₀N₂O₉'
  },
  {
    id: 'ay4',
    name: 'Artemisinin',
    plantSource: 'Sweet Wormwood (Artemisia annua)',
    activeIngredients: ['Artemisinin', 'Sesquiterpene lactone'],
    modernEquivalent: 'Antimalarial drugs',
    therapeuticUses: ['Malaria treatment', 'Antiparasitic'],
    chemicalStructure: 'C₁₅H₂₂O₅'
  },
  {
    id: 'ay5',
    name: 'Withaferin A',
    plantSource: 'Ashwagandha (Withania somnifera)',
    activeIngredients: ['Withanolides', 'Withaferin'],
    modernEquivalent: 'Adaptogenic compounds',
    therapeuticUses: ['Stress relief', 'Immune modulation', 'Anti-cancer'],
    chemicalStructure: 'C₂₈H₃₈O₆'
  },
  {
    id: 'ay6',
    name: 'Morphine',
    plantSource: 'Opium Poppy (Papaver somniferum)',
    activeIngredients: ['Morphine', 'Codeine', 'Thebaine'],
    modernEquivalent: 'Opioid analgesics',
    therapeuticUses: ['Severe pain relief', 'Anesthesia'],
    chemicalStructure: 'C₁₇H₁₉NO₃'
  }
];

// === DRUG DATABASE ===
export const DRUG_DATABASE: DrugData[] = [
  {
    id: 'drug1',
    name: 'Ozempic',
    genericName: 'Semaglutide',
    approvalStatus: 'FDA Approved',
    approvalDate: '2017-12-05',
    indication: 'Type 2 Diabetes, Obesity',
    manufacturer: 'Novo Nordisk'
  },
  {
    id: 'drug2',
    name: 'Keytruda',
    genericName: 'Pembrolizumab',
    approvalStatus: 'FDA Approved',
    approvalDate: '2014-09-04',
    indication: 'Various Cancers',
    manufacturer: 'Merck'
  },
  {
    id: 'drug3',
    name: 'Humira',
    genericName: 'Adalimumab',
    approvalStatus: 'FDA Approved',
    approvalDate: '2002-12-31',
    indication: 'Autoimmune Diseases',
    manufacturer: 'AbbVie'
  },
  {
    id: 'drug4',
    name: 'Eliquis',
    genericName: 'Apixaban',
    approvalStatus: 'FDA Approved',
    approvalDate: '2012-12-28',
    indication: 'Blood Clot Prevention',
    manufacturer: 'Bristol-Myers Squibb'
  }
];

// === RESEARCH TRENDS ===
export const RESEARCH_TRENDS: ResearchTrend[] = [
  {
    id: 'trend1',
    title: 'AI Drug Discovery Accelerates',
    description: 'Machine learning models reduce drug development time by 60%',
    date: '2024-01-15',
    category: 'AI/ML',
    source: 'Nature Medicine'
  },
  {
    id: 'trend2',
    title: 'CRISPR Gene Therapy Breakthrough',
    description: 'First CRISPR-based treatment approved for sickle cell disease',
    date: '2024-01-10',
    category: 'Gene Therapy',
    source: 'FDA News'
  },
  {
    id: 'trend3',
    title: 'mRNA Vaccines for Cancer',
    description: 'Personalized cancer vaccines show 50% tumor reduction',
    date: '2024-01-08',
    category: 'Immunotherapy',
    source: 'Cell Journal'
  },
  {
    id: 'trend4',
    title: 'Alzheimer\'s Drug Shows Promise',
    description: 'New amyloid-targeting antibody slows cognitive decline',
    date: '2024-01-05',
    category: 'Neurology',
    source: 'NEJM'
  }
];

// === MISSIONS ===
export const MISSIONS: Mission[] = [
  {
    id: 'mission1',
    title: 'Build Your First Molecule',
    description: 'Construct a simple water molecule (H₂O) to understand atomic bonding.',
    type: 'molecule',
    difficulty: 'beginner',
    xpReward: 100,
    objectives: [
      { id: 'obj1', description: 'Place an Oxygen atom', completed: false },
      { id: 'obj2', description: 'Add two Hydrogen atoms', completed: false },
      { id: 'obj3', description: 'Create bonds between atoms', completed: false }
    ]
  },
  {
    id: 'mission2',
    title: 'Aspirin Synthesis Challenge',
    description: 'Recreate the molecular structure of acetylsalicylic acid (Aspirin).',
    type: 'molecule',
    difficulty: 'intermediate',
    xpReward: 250,
    objectives: [
      { id: 'obj1', description: 'Build the benzene ring', completed: false },
      { id: 'obj2', description: 'Add the acetyl group', completed: false },
      { id: 'obj3', description: 'Attach the carboxyl group', completed: false }
    ],
    timeLimit: 600
  },
  {
    id: 'mission3',
    title: 'Clinical Trial Design',
    description: 'Design a Phase II clinical trial for a new diabetes medication.',
    type: 'experiment',
    difficulty: 'advanced',
    xpReward: 500,
    objectives: [
      { id: 'obj1', description: 'Define primary endpoints', completed: false },
      { id: 'obj2', description: 'Calculate sample size', completed: false },
      { id: 'obj3', description: 'Establish control groups', completed: false },
      { id: 'obj4', description: 'Set dosing regimen', completed: false }
    ]
  }
];

// === KNOWLEDGE CARDS ===
export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'kc1',
    title: 'The Birth of Aspirin',
    content: 'In 1897, Felix Hoffmann at Bayer synthesized acetylsalicylic acid. He was motivated by his father\'s arthritis pain. The name "Aspirin" comes from "A" (acetyl) + "spir" (from Spiraea, the plant genus) + "in" (common suffix).',
    category: 'history',
    relevance: 0.95,
    source: 'Chemical Heritage Foundation'
  },
  {
    id: 'kc2',
    title: 'Thalidomide Tragedy',
    content: 'The 1950s thalidomide disaster led to birth defects in over 10,000 children worldwide. This tragedy revolutionized drug safety testing and led to the formation of modern FDA regulations including the Kefauver-Harris Amendment of 1962.',
    category: 'case-study',
    relevance: 0.88,
    source: 'FDA Historical Archives'
  },
  {
    id: 'kc3',
    title: 'ADME Principle',
    content: 'ADME stands for Absorption, Distribution, Metabolism, and Excretion. These four processes determine how a drug moves through the body and are critical for determining dosing and safety.',
    category: 'flashcard',
    relevance: 0.92
  },
  {
    id: 'kc4',
    title: 'Lipinski\'s Rule of Five',
    content: 'A molecule is likely to be orally active if: MW ≤ 500, LogP ≤ 5, H-bond donors ≤ 5, H-bond acceptors ≤ 10. This rule helps predict drug-likeness in early development.',
    category: 'flashcard',
    relevance: 0.90
  }
];

// === SCENARIOS ===
export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario1',
    title: 'Startup Founder Challenge',
    type: 'startup',
    narrative: 'You\'ve just founded PharmaTech Innovations with $5M seed funding. Your goal is to bring a novel pain medication to Phase I trials within 18 months.',
    challenges: [
      { id: 'ch1', description: 'Limited funding requires strategic allocation', constraints: ['Budget: $5M', 'Timeline: 18 months'] },
      { id: 'ch2', description: 'Competing with established pharma companies', constraints: ['Market analysis needed', 'IP protection required'] }
    ],
    decisions: [
      {
        id: 'dec1',
        prompt: 'How will you allocate your initial funding?',
        options: [
          { id: 'opt1', text: 'Focus 70% on R&D, 30% on regulatory', consequence: 'Faster development but regulatory delays possible' },
          { id: 'opt2', text: 'Balance 50/50 between R&D and business development', consequence: 'Slower but more sustainable growth' },
          { id: 'opt3', text: 'Invest heavily in AI drug discovery platform', consequence: 'High risk, potentially revolutionary results' }
        ]
      }
    ]
  },
  {
    id: 'scenario2',
    title: 'Regulatory Crisis Management',
    type: 'regulatory',
    narrative: 'FDA has raised concerns about adverse events in your Phase III trial. You must respond within 15 days to avoid a clinical hold.',
    challenges: [
      { id: 'ch1', description: 'Unexpected adverse events in 3% of patients', constraints: ['15-day response deadline', 'Data integrity questions'] }
    ],
    decisions: [
      {
        id: 'dec1',
        prompt: 'How do you respond to the FDA?',
        options: [
          { id: 'opt1', text: 'Request meeting to present additional safety data', consequence: 'Shows cooperation but delays timeline' },
          { id: 'opt2', text: 'Modify protocol to exclude at-risk populations', consequence: 'Reduces market size but addresses safety' },
          { id: 'opt3', text: 'Conduct independent safety audit', consequence: 'Expensive but builds credibility' }
        ]
      }
    ]
  }
];

// === EXPERIMENT PROTOCOLS ===
export const EXPERIMENT_PROTOCOLS = {
  aspirin_synthesis: {
    name: 'Aspirin Synthesis',
    steps: [
      { id: 'step1', action: 'Measure salicylic acid', chemical: 'Salicylic Acid', dosage: 2.0 },
      { id: 'step2', action: 'Add acetic anhydride', chemical: 'Acetic Anhydride', dosage: 3.0 },
      { id: 'step3', action: 'Add phosphoric acid catalyst', chemical: 'Phosphoric Acid', dosage: 0.5 },
      { id: 'step4', action: 'Heat mixture', duration: 15 },
      { id: 'step5', action: 'Add cold water', chemical: 'Distilled Water', dosage: 20.0 },
      { id: 'step6', action: 'Filter crystals', duration: 5 },
      { id: 'step7', action: 'Dry product', duration: 30 }
    ]
  },
  drug_dissolution: {
    name: 'Drug Dissolution Test',
    steps: [
      { id: 'step1', action: 'Prepare dissolution medium', chemical: 'Phosphate Buffer pH 6.8', dosage: 900 },
      { id: 'step2', action: 'Set apparatus temperature', duration: 37 },
      { id: 'step3', action: 'Add tablet to vessel', dosage: 1 },
      { id: 'step4', action: 'Start rotation', duration: 50 },
      { id: 'step5', action: 'Sample at intervals', duration: 60 },
      { id: 'step6', action: 'Analyze by UV spectroscopy' }
    ]
  }
};
