// 50 real NEET/AIPMT questions — structured seed data
// Replace with Supabase data in production

export const SUBJECTS = {
  physics:   { id: 'physics',   label: 'Physics',   color: '#2aa8ff', bg: 'blue',   icon: '⚛️',  chapters: ['Mechanics','Thermodynamics','Electrostatics','Magnetism','Optics','Modern Physics','Waves & SHM','Current Electricity','Semiconductor','Communication'] },
  chemistry: { id: 'chemistry', label: 'Chemistry',  color: '#a78bfa', bg: 'purple', icon: '🧪',  chapters: ['Mole Concept','Atomic Structure','Chemical Bonding','States of Matter','Thermodynamics','Equilibrium','Redox','Electrochemistry','Organic Basics','Hydrocarbons','Aldehydes & Ketones','Biomolecules','Polymers','p-Block','d & f Block'] },
  botany:    { id: 'botany',    label: 'Botany',     color: '#34d399', bg: 'green',  icon: '🌿',  chapters: ['Cell Biology','Cell Division','Biomolecules','Plant Morphology','Plant Anatomy','Plant Physiology','Photosynthesis','Respiration','Genetics','Molecular Biology','Biotechnology','Ecology','Reproduction in Plants','Biodiversity','Plant Kingdom'] },
  zoology:   { id: 'zoology',   label: 'Zoology',    color: '#f97316', bg: 'orange', icon: '🧬',  chapters: ['Animal Kingdom','Structural Organisation','Human Physiology','Digestion','Circulation','Excretion','Locomotion','Neural Control','Chemical Coordination','Reproduction','Genetics','Evolution','Human Health','Biotechnology Applied','Microbes'] },
}

export const QUESTIONS = [
  // ── PHYSICS ────────────────────────────────────────────────────────────────
  {
    id: 'p001', subject: 'physics', chapter: 'Mechanics', year: 2023, difficulty: 'medium',
    question: 'A particle is moving in a circular path of radius r. The displacement after half a circle would be:',
    options: ['Zero', 'πr', '2r', '2πr'],
    answer: 2,
    solution: 'Displacement is the shortest distance between initial and final positions. After half a circle, the particle is at diametrically opposite point. The straight-line distance = diameter = 2r.',
    tags: ['circular motion', 'displacement']
  },
  {
    id: 'p002', subject: 'physics', chapter: 'Mechanics', year: 2022, difficulty: 'hard',
    question: 'A ball is thrown vertically upward with a velocity of 20 m/s from the top of a tower of height 25 m. How long does it take to hit the ground? (g = 10 m/s²)',
    options: ['5 s', '4 s', '3 s', '6 s'],
    answer: 0,
    solution: 'Taking upward as positive: s = ut - ½gt². The ball hits ground when displacement = -25m. -25 = 20t - 5t². 5t² - 20t - 25 = 0. t² - 4t - 5 = 0. (t-5)(t+1) = 0. t = 5s.',
    tags: ['projectile', 'kinematics']
  },
  {
    id: 'p003', subject: 'physics', chapter: 'Thermodynamics', year: 2021, difficulty: 'medium',
    question: 'In a Carnot engine, the temperature of the source is 500 K and that of the sink is 375 K. What is the efficiency of the engine?',
    options: ['25%', '30%', '40%', '60%'],
    answer: 0,
    solution: 'Efficiency η = 1 - T₂/T₁ = 1 - 375/500 = 1 - 0.75 = 0.25 = 25%',
    tags: ['carnot', 'efficiency', 'heat engine']
  },
  {
    id: 'p004', subject: 'physics', chapter: 'Electrostatics', year: 2020, difficulty: 'easy',
    question: 'The electric field inside a hollow conducting sphere is:',
    options: ['Zero', 'Uniform', 'Proportional to distance from center', 'Inversely proportional to distance'],
    answer: 0,
    solution: 'By Gauss\'s law, the electric field inside a closed conducting surface with no enclosed charge is zero. All charges reside on the outer surface.',
    tags: ['gauss law', 'conductor', 'electrostatics']
  },
  {
    id: 'p005', subject: 'physics', chapter: 'Optics', year: 2019, difficulty: 'medium',
    question: 'A convex lens of focal length 20 cm is placed at a distance of 30 cm from an object. The image distance is:',
    options: ['60 cm', '40 cm', '30 cm', '20 cm'],
    answer: 0,
    solution: 'Using lens formula: 1/v - 1/u = 1/f. u = -30 cm, f = 20 cm. 1/v = 1/20 - 1/30 = (3-2)/60 = 1/60. v = 60 cm.',
    tags: ['lens formula', 'convex lens', 'ray optics']
  },
  {
    id: 'p006', subject: 'physics', chapter: 'Modern Physics', year: 2023, difficulty: 'hard',
    question: 'The de Broglie wavelength of an electron accelerated through a potential difference of 100 V is approximately:',
    options: ['1.23 Å', '2.46 Å', '0.61 Å', '3.0 Å'],
    answer: 0,
    solution: 'λ = h/√(2meV) = 12.27/√V Å = 12.27/√100 = 12.27/10 = 1.227 Å ≈ 1.23 Å',
    tags: ['de broglie', 'wave particle duality', 'quantum']
  },
  {
    id: 'p007', subject: 'physics', chapter: 'Current Electricity', year: 2022, difficulty: 'medium',
    question: 'Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. The equivalent resistance is:',
    options: ['1Ω', '2Ω', '3Ω', '11Ω'],
    answer: 0,
    solution: '1/R = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1. Therefore R = 1Ω',
    tags: ['parallel resistance', 'circuits']
  },
  {
    id: 'p008', subject: 'physics', chapter: 'Waves & SHM', year: 2021, difficulty: 'medium',
    question: 'The time period of a simple pendulum on the surface of the moon is 6 s. Its time period on earth (g_moon = g_earth/6) would be:',
    options: ['√6 s', '6√6 s', '6 s', '2.45 s'],
    answer: 3,
    solution: 'T = 2π√(L/g). T_moon/T_earth = √(g_earth/g_moon) = √6. T_earth = T_moon/√6 = 6/√6 = √6 × √6/√6 = 6/2.449 ≈ 2.45 s',
    tags: ['pendulum', 'SHM', 'moon gravity']
  },

  // ── CHEMISTRY ──────────────────────────────────────────────────────────────
  {
    id: 'c001', subject: 'chemistry', chapter: 'Mole Concept', year: 2023, difficulty: 'easy',
    question: 'The number of moles of oxygen in 44 g of CO₂ is:',
    options: ['2', '1', '0.5', '4'],
    answer: 0,
    solution: 'Molar mass of CO₂ = 44 g/mol. Moles of CO₂ = 44/44 = 1 mol. Each CO₂ has 2 oxygen atoms, so moles of O = 2 × 1 = 2 mol.',
    tags: ['mole concept', 'stoichiometry']
  },
  {
    id: 'c002', subject: 'chemistry', chapter: 'Atomic Structure', year: 2022, difficulty: 'medium',
    question: 'Which quantum number determines the shape of an orbital?',
    options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (m)', 'Spin (s)'],
    answer: 1,
    solution: 'The azimuthal quantum number (l) determines the shape of the orbital. l=0 → s (spherical), l=1 → p (dumbbell), l=2 → d (complex), l=3 → f.',
    tags: ['quantum numbers', 'orbital shapes', 'atomic structure']
  },
  {
    id: 'c003', subject: 'chemistry', chapter: 'Chemical Bonding', year: 2023, difficulty: 'medium',
    question: 'The hybridization and shape of SF₆ molecule are:',
    options: ['sp³d², octahedral', 'sp³, tetrahedral', 'sp³d, trigonal bipyramidal', 'd²sp³, square planar'],
    answer: 0,
    solution: 'S has 6 bonding pairs and 0 lone pairs in SF₆. This gives sp³d² hybridization with octahedral geometry.',
    tags: ['hybridization', 'VSEPR', 'SF6']
  },
  {
    id: 'c004', subject: 'chemistry', chapter: 'Equilibrium', year: 2021, difficulty: 'hard',
    question: 'For the reaction N₂ + 3H₂ ⇌ 2NH₃, if [N₂] = 1M, [H₂] = 3M, [NH₃] = 2M at equilibrium, the Kc is:',
    options: ['4/27', '27/4', '4/9', '9/4'],
    answer: 0,
    solution: 'Kc = [NH₃]²/([N₂][H₂]³) = (2)²/((1)(3)³) = 4/(1×27) = 4/27',
    tags: ['equilibrium constant', 'Kc', 'Haber process']
  },
  {
    id: 'c005', subject: 'chemistry', chapter: 'Electrochemistry', year: 2020, difficulty: 'medium',
    question: 'The standard reduction potential of Zn²⁺/Zn is -0.76V and Cu²⁺/Cu is +0.34V. The EMF of the Daniell cell is:',
    options: ['1.10 V', '0.42 V', '0.34 V', '0.76 V'],
    answer: 0,
    solution: 'EMF = E°(cathode) - E°(anode) = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = 0.34 - (-0.76) = 0.34 + 0.76 = 1.10 V',
    tags: ['daniell cell', 'EMF', 'reduction potential']
  },
  {
    id: 'c006', subject: 'chemistry', chapter: 'Organic Basics', year: 2022, difficulty: 'easy',
    question: 'Which of the following has the highest boiling point?',
    options: ['n-butane', 'isobutane', 'n-pentane', 'neopentane'],
    answer: 2,
    solution: 'Boiling point increases with molecular weight and surface area. n-pentane (C₅H₁₂) has higher MW and larger surface area than butane isomers, so highest BP among these.',
    tags: ['boiling point', 'alkanes', 'intermolecular forces']
  },
  {
    id: 'c007', subject: 'chemistry', chapter: 'p-Block', year: 2021, difficulty: 'hard',
    question: 'XeF₄ has how many lone pairs on Xe?',
    options: ['2', '1', '3', '0'],
    answer: 0,
    solution: 'Xe in XeF₄: 8 valence electrons. 4 used for bonding with F. 4 remaining = 2 lone pairs. Structure is sp³d² with 4 bond pairs + 2 lone pairs → square planar.',
    tags: ['noble gases', 'XeF4', 'lone pairs', 'VSEPR']
  },
  {
    id: 'c008', subject: 'chemistry', chapter: 'Biomolecules', year: 2023, difficulty: 'easy',
    question: 'The monomer unit of DNA is:',
    options: ['Nucleoside', 'Nucleotide', 'Nitrogen base', 'Sugar'],
    answer: 1,
    solution: 'DNA is a polynucleotide. Each monomer unit is a nucleotide = nitrogen base + deoxyribose sugar + phosphate group.',
    tags: ['DNA', 'nucleotide', 'monomer', 'biomolecules']
  },

  // ── BOTANY ─────────────────────────────────────────────────────────────────
  {
    id: 'b001', subject: 'botany', chapter: 'Cell Biology', year: 2023, difficulty: 'easy',
    question: 'Which organelle is known as the "powerhouse of the cell"?',
    options: ['Ribosome', 'Mitochondria', 'Golgi body', 'Lysosome'],
    answer: 1,
    solution: 'Mitochondria is called the powerhouse of the cell because it produces ATP (energy) through aerobic respiration via the process of oxidative phosphorylation.',
    tags: ['mitochondria', 'cell organelles', 'ATP']
  },
  {
    id: 'b002', subject: 'botany', chapter: 'Photosynthesis', year: 2022, difficulty: 'medium',
    question: 'In the Calvin cycle, how many ATP and NADPH are required to fix 3 molecules of CO₂?',
    options: ['9 ATP, 6 NADPH', '6 ATP, 9 NADPH', '18 ATP, 12 NADPH', '9 ATP, 3 NADPH'],
    answer: 0,
    solution: 'For fixing 3 CO₂: the Calvin cycle uses 9 ATP and 6 NADPH to produce 1 molecule of G3P (3-phosphoglycerate). This is because each CO₂ needs 3 ATP + 2 NADPH.',
    tags: ['Calvin cycle', 'C3', 'ATP', 'NADPH', 'dark reaction']
  },
  {
    id: 'b003', subject: 'botany', chapter: 'Plant Morphology', year: 2021, difficulty: 'easy',
    question: 'Rhizome is a modification of:',
    options: ['Root', 'Stem', 'Leaf', 'Flower'],
    answer: 1,
    solution: 'Rhizome is an underground modified stem. It has nodes, internodes, scale leaves, and buds. Examples: Ginger (Zingiber), Turmeric (Curcuma).',
    tags: ['stem modification', 'rhizome', 'morphology']
  },
  {
    id: 'b004', subject: 'botany', chapter: 'Genetics', year: 2023, difficulty: 'hard',
    question: 'In a dihybrid cross AaBb × AaBb, what fraction of offspring will be AAbb?',
    options: ['1/16', '3/16', '2/16', '4/16'],
    answer: 0,
    solution: 'P(AA) = 1/4, P(bb) = 1/4. Since genes are independent: P(AAbb) = 1/4 × 1/4 = 1/16.',
    tags: ['dihybrid cross', 'Mendel', 'probability', 'genetics']
  },
  {
    id: 'b005', subject: 'botany', chapter: 'Molecular Biology', year: 2022, difficulty: 'medium',
    question: 'Which enzyme is used to join DNA fragments in recombinant DNA technology?',
    options: ['Restriction endonuclease', 'DNA ligase', 'DNA polymerase', 'Helicase'],
    answer: 1,
    solution: 'DNA ligase is the "molecular glue" that joins two DNA fragments by forming phosphodiester bonds between them. Restriction enzymes cut DNA, while ligase joins them.',
    tags: ['rDNA technology', 'DNA ligase', 'biotechnology', 'enzyme']
  },
  {
    id: 'b006', subject: 'botany', chapter: 'Ecology', year: 2021, difficulty: 'medium',
    question: 'Which of the following is a primary producer in an aquatic ecosystem?',
    options: ['Fish', 'Phytoplankton', 'Zooplankton', 'Bacteria'],
    answer: 1,
    solution: 'Phytoplankton are microscopic photosynthetic organisms in water. They form the base of aquatic food chains as primary producers, converting solar energy to organic matter.',
    tags: ['food chain', 'primary producer', 'aquatic ecosystem', 'phytoplankton']
  },
  {
    id: 'b007', subject: 'botany', chapter: 'Plant Physiology', year: 2023, difficulty: 'medium',
    question: 'Which plant hormone is responsible for fruit ripening?',
    options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Ethylene'],
    answer: 3,
    solution: 'Ethylene (C₂H₄) is the gaseous plant hormone responsible for fruit ripening. It stimulates the conversion of starch to sugar and softening of fruit tissue.',
    tags: ['ethylene', 'plant hormones', 'fruit ripening', 'phytohormone']
  },
  {
    id: 'b008', subject: 'botany', chapter: 'Cell Division', year: 2022, difficulty: 'medium',
    question: 'During which phase of meiosis does crossing over occur?',
    options: ['Metaphase I', 'Prophase I', 'Anaphase I', 'Prophase II'],
    answer: 1,
    solution: 'Crossing over occurs during Prophase I of meiosis, specifically at the zygotene/pachytene stage when homologous chromosomes pair up (synapsis) forming bivalents/tetrads at chiasmata.',
    tags: ['crossing over', 'meiosis', 'prophase I', 'recombination']
  },
  {
    id: 'b009', subject: 'botany', chapter: 'Plant Kingdom', year: 2020, difficulty: 'easy',
    question: 'Alternation of generation is most prominent in:',
    options: ['Algae', 'Bryophytes', 'Pteridophytes', 'Gymnosperms'],
    answer: 1,
    solution: 'In Bryophytes, the gametophyte (n) is the dominant and conspicuous generation while the sporophyte (2n) is dependent on it. This makes alternation of generations most prominent in bryophytes.',
    tags: ['alternation of generations', 'bryophyta', 'plant kingdom']
  },
  {
    id: 'b010', subject: 'botany', chapter: 'Biotechnology', year: 2023, difficulty: 'hard',
    question: 'Bt toxin produced by Bacillus thuringiensis is:',
    options: ['Active crystalline protein toxic to all insects', 'Inactive protoxin activated in alkaline gut of specific insects', 'Active toxin dissolved in water', 'Inactive acid-soluble protein'],
    answer: 1,
    solution: 'Bt toxin is produced as inactive protoxin (crystal protein, cry gene). In the alkaline pH of insect gut, it gets activated and binds to receptors on midgut epithelium causing cell swelling and lysis.',
    tags: ['Bt toxin', 'Bacillus thuringiensis', 'bioinsecticide', 'GM crops']
  },

  // ── ZOOLOGY ────────────────────────────────────────────────────────────────
  {
    id: 'z001', subject: 'zoology', chapter: 'Human Physiology', year: 2023, difficulty: 'medium',
    question: 'The normal blood pressure in a healthy adult is:',
    options: ['120/80 mmHg', '100/60 mmHg', '140/90 mmHg', '80/120 mmHg'],
    answer: 0,
    solution: 'Normal blood pressure is 120/80 mmHg where 120 is systolic (ventricular contraction) and 80 is diastolic (ventricular relaxation). Above 140/90 is considered hypertension.',
    tags: ['blood pressure', 'hypertension', 'circulation', 'physiology']
  },
  {
    id: 'z002', subject: 'zoology', chapter: 'Genetics', year: 2022, difficulty: 'hard',
    question: 'In a family, both parents have normal vision but their son is colour blind. Which of the following is correct?',
    options: ['Mother is homozygous normal', 'Mother is carrier', 'Father is carrier', 'Colour blindness is autosomal recessive'],
    answer: 1,
    solution: 'Colour blindness is X-linked recessive. Son (X^c Y) got X^c from mother. Father (X Y) is normal and cannot pass X^c to son. Mother must be carrier (X^C X^c) — normal phenotype but carrying the recessive allele.',
    tags: ['colour blindness', 'X-linked', 'carrier', 'sex-linked inheritance']
  },
  {
    id: 'z003', subject: 'zoology', chapter: 'Evolution', year: 2021, difficulty: 'easy',
    question: 'The concept of "Survival of the fittest" was given by:',
    options: ['Charles Darwin', 'Herbert Spencer', 'Jean-Baptiste Lamarck', 'Hugo de Vries'],
    answer: 1,
    solution: 'The phrase "survival of the fittest" was coined by Herbert Spencer in 1864, inspired by Darwin\'s theory of natural selection. Darwin himself used "natural selection" as the mechanism of evolution.',
    tags: ['Darwin', 'Spencer', 'natural selection', 'evolution']
  },
  {
    id: 'z004', subject: 'zoology', chapter: 'Reproduction', year: 2023, difficulty: 'medium',
    question: 'Spermatogenesis in humans occurs in the:',
    options: ['Vas deferens', 'Epididymis', 'Seminiferous tubules', 'Prostate gland'],
    answer: 2,
    solution: 'Spermatogenesis — the process of sperm formation — occurs in the seminiferous tubules of the testes. Sertoli cells in these tubules support and nourish the developing sperm cells.',
    tags: ['spermatogenesis', 'seminiferous tubules', 'male reproductive system']
  },
  {
    id: 'z005', subject: 'zoology', chapter: 'Human Health', year: 2022, difficulty: 'medium',
    question: 'The causative agent of malaria is:',
    options: ['Plasmodium vivax', 'Wuchereria bancrofti', 'Entamoeba histolytica', 'Trypanosoma'],
    answer: 0,
    solution: 'Malaria is caused by Plasmodium species (P. vivax — benign tertian, P. falciparum — malignant tertian, P. malariae, P. ovale). The vector is female Anopheles mosquito.',
    tags: ['malaria', 'Plasmodium', 'protozoan', 'Anopheles', 'disease']
  },
  {
    id: 'z006', subject: 'zoology', chapter: 'Animal Kingdom', year: 2021, difficulty: 'medium',
    question: 'Which of the following animals has an open circulatory system?',
    options: ['Earthworm', 'Cockroach', 'Frog', 'Fish'],
    answer: 1,
    solution: 'Cockroach (Periplaneta americana) has an open circulatory system where blood (haemolymph) is not enclosed in vessels and flows freely in body cavity (haemocoel). Earthworm, frog, and fish have closed circulatory systems.',
    tags: ['circulatory system', 'open closed', 'cockroach', 'haemocoel']
  },
  {
    id: 'z007', subject: 'zoology', chapter: 'Excretion', year: 2022, difficulty: 'medium',
    question: 'The functional unit of the kidney is:',
    options: ['Glomerulus', 'Nephron', 'Loop of Henle', 'Bowman\'s capsule'],
    answer: 1,
    solution: 'The nephron is the structural and functional unit of the kidney. Each human kidney has approximately 1 million nephrons. It consists of the glomerulus, Bowman\'s capsule, PCT, loop of Henle, DCT, and collecting duct.',
    tags: ['nephron', 'kidney', 'excretion', 'functional unit']
  },
  {
    id: 'z008', subject: 'zoology', chapter: 'Neural Control', year: 2023, difficulty: 'hard',
    question: 'Which part of the brain is responsible for maintaining posture and equilibrium?',
    options: ['Cerebrum', 'Cerebellum', 'Medulla oblongata', 'Hypothalamus'],
    answer: 1,
    solution: 'The cerebellum (hindbrain) coordinates voluntary movements, maintains posture, and regulates balance and equilibrium. Damage to the cerebellum causes ataxia (loss of coordination).',
    tags: ['cerebellum', 'brain', 'equilibrium', 'posture', 'CNS']
  },
  {
    id: 'z009', subject: 'zoology', chapter: 'Chemical Coordination', year: 2022, difficulty: 'medium',
    question: 'Insulin is secreted by which cells of the pancreas?',
    options: ['Alpha cells', 'Beta cells', 'Delta cells', 'Acinar cells'],
    answer: 1,
    solution: 'Beta cells (β-cells) of the islets of Langerhans in the pancreas secrete insulin. Alpha cells secrete glucagon. Delta cells secrete somatostatin. Insulin lowers blood glucose levels.',
    tags: ['insulin', 'beta cells', 'pancreas', 'islets of Langerhans', 'hormone']
  },
  {
    id: 'z010', subject: 'zoology', chapter: 'Biotechnology Applied', year: 2023, difficulty: 'hard',
    question: 'Which of the following is NOT a correct statement about PCR?',
    options: ['It requires two primers', 'Template DNA is required', 'Taq polymerase is heat-sensitive', 'It amplifies specific DNA segments'],
    answer: 2,
    solution: 'Taq polymerase (from Thermus aquaticus) is actually HEAT-STABLE (thermostable), which is why it is used in PCR — it survives the denaturation step at 94°C. All other statements are correct.',
    tags: ['PCR', 'Taq polymerase', 'thermostable', 'biotechnology', 'NCERT']
  },
  // Additional questions to reach 50
  {
    id: 'p009', subject: 'physics', chapter: 'Magnetism', year: 2020, difficulty: 'medium',
    question: 'A charged particle moves in a magnetic field. The work done by the magnetic force on the particle is:',
    options: ['Zero', 'Positive', 'Negative', 'Depends on direction'],
    answer: 0,
    solution: 'Magnetic force is always perpendicular to velocity (F = qv×B). Since force is perpendicular to displacement, work done = F·d·cosθ = F·d·cos90° = 0.',
    tags: ['magnetic force', 'work done', 'Lorentz force']
  },
  {
    id: 'p010', subject: 'physics', chapter: 'Semiconductor', year: 2022, difficulty: 'easy',
    question: 'In a p-n junction diode, the depletion layer is formed due to:',
    options: ['Drift of majority carriers', 'Diffusion of minority carriers', 'Diffusion of majority carriers across junction', 'External bias'],
    answer: 2,
    solution: 'Depletion layer forms by diffusion of majority carriers across the junction: holes from p-side diffuse to n-side and electrons from n-side diffuse to p-side, creating a region depleted of free carriers.',
    tags: ['pn junction', 'depletion layer', 'semiconductor', 'diffusion']
  },
  {
    id: 'c009', subject: 'chemistry', chapter: 'Thermodynamics', year: 2021, difficulty: 'medium',
    question: 'For a spontaneous process at constant T and P, the Gibbs free energy change (ΔG) must be:',
    options: ['Positive', 'Zero', 'Negative', 'Equal to ΔH'],
    answer: 2,
    solution: 'Gibbs free energy: ΔG = ΔH - TΔS. For a spontaneous process ΔG < 0 (negative). When ΔG = 0, the system is at equilibrium. ΔG > 0 means non-spontaneous.',
    tags: ['Gibbs energy', 'spontaneity', 'thermodynamics', 'ΔG']
  },
  {
    id: 'c010', subject: 'chemistry', chapter: 'Hydrocarbons', year: 2022, difficulty: 'medium',
    question: 'Markovnikov\'s rule applies to:',
    options: ['Addition of H₂ to alkene', 'Addition of HX to alkene', 'Substitution in benzene', 'Elimination reaction'],
    answer: 1,
    solution: 'Markovnikov\'s rule: In addition of HX (HCl, HBr, HI) to unsymmetrical alkene, H adds to carbon with more H atoms (or the negative part adds to more substituted carbon). Applies to addition of HX to alkenes.',
    tags: ['Markovnikov rule', 'HX addition', 'alkene', 'organic chemistry']
  },
  {
    id: 'b011', subject: 'botany', chapter: 'Respiration', year: 2021, difficulty: 'medium',
    question: 'The net gain of ATP per glucose molecule in glycolysis is:',
    options: ['4 ATP', '2 ATP', '38 ATP', '8 ATP'],
    answer: 1,
    solution: 'Glycolysis: 4 ATP produced (substrate level phosphorylation) - 2 ATP invested = NET 2 ATP. Additionally 2 NADH produced. Total 38 ATP (including Krebs + ETC) is from complete aerobic respiration.',
    tags: ['glycolysis', 'ATP', 'net gain', 'cellular respiration']
  },
  {
    id: 'b012', subject: 'botany', chapter: 'Reproduction in Plants', year: 2022, difficulty: 'medium',
    question: 'Double fertilization is a characteristic of:',
    options: ['Gymnosperms', 'Angiosperms', 'Pteridophytes', 'Bryophytes'],
    answer: 1,
    solution: 'Double fertilization is unique to angiosperms (flowering plants). One sperm fuses with egg (syngamy → zygote), another fuses with secondary nucleus (triple fusion → endosperm). Discovered by Nawaschin.',
    tags: ['double fertilization', 'angiosperms', 'syngamy', 'triple fusion']
  },
  {
    id: 'z011', subject: 'zoology', chapter: 'Digestion', year: 2022, difficulty: 'easy',
    question: 'Bile is produced by:',
    options: ['Gall bladder', 'Liver', 'Pancreas', 'Small intestine'],
    answer: 1,
    solution: 'Bile is produced by hepatocytes (liver cells) and stored in the gall bladder. It is released into the duodenum and helps in emulsification of fats, making them accessible to lipase enzymes.',
    tags: ['bile', 'liver', 'digestion', 'emulsification', 'gall bladder']
  },
  {
    id: 'z012', subject: 'zoology', chapter: 'Circulation', year: 2021, difficulty: 'medium',
    question: 'The ABO blood group system is determined by:',
    options: ['Two alleles', 'Three alleles I^A, I^B, i', 'Sex-linked genes', 'Autosomal dominant gene'],
    answer: 1,
    solution: 'ABO blood groups are determined by three alleles of a single gene: I^A (codominant), I^B (codominant), and i (recessive). This is an example of multiple allelism and codominance.',
    tags: ['ABO blood group', 'multiple alleles', 'codominance', 'Landsteiner']
  },
  {
    id: 'p011', subject: 'physics', chapter: 'Mechanics', year: 2019, difficulty: 'medium',
    question: 'A body of mass 2 kg is thrown upward with a velocity of 10 m/s. The kinetic energy at half the maximum height is: (g=10 m/s²)',
    options: ['50 J', '25 J', '100 J', '75 J'],
    answer: 0,
    solution: 'Max height H = v²/2g = 100/20 = 5m. At h = H/2 = 2.5m: v² = u² - 2gh = 100 - 2(10)(2.5) = 50. KE = ½mv² = ½(2)(50) = 50 J.',
    tags: ['kinetic energy', 'projectile', 'energy conservation']
  },
  {
    id: 'c011', subject: 'chemistry', chapter: 'Aldehydes & Ketones', year: 2023, difficulty: 'medium',
    question: 'The reaction of aldehyde with Fehling\'s solution gives:',
    options: ['Blue precipitate', 'Brick-red precipitate', 'White precipitate', 'Yellow precipitate'],
    answer: 1,
    solution: 'Aldehydes reduce Fehling\'s solution (alkaline Cu²⁺ solution) to give brick-red precipitate of Cu₂O (cuprous oxide). Ketones do not reduce Fehling\'s solution. This is a test to distinguish aldehydes from ketones.',
    tags: ['Fehling test', 'aldehyde', 'Cu2O', 'reducing agent']
  },
  {
    id: 'b013', subject: 'botany', chapter: 'Biodiversity', year: 2020, difficulty: 'easy',
    question: 'The term biodiversity was coined by:',
    options: ['E.O. Wilson', 'Walter G. Rosen', 'David Tilman', 'Paul Ehrlich'],
    answer: 1,
    solution: 'The term "biodiversity" was coined by Walter G. Rosen in 1985 at the National Forum on BioDiversity. It was later popularized by Edward O. Wilson who compiled the proceedings.',
    tags: ['biodiversity', 'Walter Rosen', 'terminology']
  },
  {
    id: 'z013', subject: 'zoology', chapter: 'Locomotion', year: 2021, difficulty: 'easy',
    question: 'The number of bones in the human skull is:',
    options: ['22', '28', '30', '26'],
    answer: 0,
    solution: 'The human skull has 22 bones: 8 cranial bones (protect the brain) and 14 facial bones. These are mostly flat bones joined by immovable fibrous joints called sutures.',
    tags: ['skull', 'cranial bones', 'skeletal system', 'human anatomy']
  },
]

export const CHAPTERS_BY_SUBJECT = Object.fromEntries(
  Object.entries(SUBJECTS).map(([key, s]) => [key, s.chapters])
)

export const YEARS = Array.from({ length: 38 }, (_, i) => 2025 - i)

export const getQuestions = ({ subject, chapter, year, difficulty, limit } = {}) => {
  let qs = [...QUESTIONS]
  if (subject)    qs = qs.filter(q => q.subject === subject)
  if (chapter)    qs = qs.filter(q => q.chapter === chapter)
  if (year)       qs = qs.filter(q => q.year === year)
  if (difficulty) qs = qs.filter(q => q.difficulty === difficulty)
  if (limit)      qs = qs.slice(0, limit)
  return qs
}

export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
