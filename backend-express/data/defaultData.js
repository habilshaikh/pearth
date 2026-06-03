const defaultHomeContent = {
  heroTitle: 'Precision CNC Machining',
  heroSubtitle: 'Engineering Excellence Since 1998',
  heroImage: 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=1920&q=80',
  aboutText: 'SAI TECH is a leading precision CNC machining company specializing in high-quality components for automotive, aerospace, and industrial applications. With over 25 years of experience and state-of-the-art machinery, we deliver excellence in every part we manufacture. Our commitment to quality, precision, and customer satisfaction has made us a trusted partner for industries worldwide.',
  aboutImage: 'https://images.pexels.com/photos/3688262/pexels-photo-3688262.jpeg?w=800&q=80',
  ctaText: 'Get Your Custom Quote Today',
};

const defaultServices = [
  {
    name: 'CNC Turning',
    description: 'High-precision turning operations for cylindrical parts with tolerances up to +/-0.005mm. We handle complex geometries and various materials including steel, aluminum, brass, and exotic alloys.',
    imageUrl: 'https://images.pexels.com/photos/8973680/pexels-photo-8973680.jpeg?w=600&q=80',
  },
  {
    name: 'CNC Milling',
    description: 'Advanced 3, 4, and 5-axis milling capabilities for complex parts. Our state-of-the-art CNC mills handle intricate designs with exceptional accuracy and surface finish.',
    imageUrl: 'https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=600&q=80',
  },
  {
    name: 'Surface Grinding',
    description: 'Precision surface grinding for flat surfaces with mirror finish quality. Achieve surface roughness as low as Ra 0.2um for critical applications.',
    imageUrl: 'https://images.unsplash.com/photo-1720036236697-018370867320?w=600&q=80',
  },
  {
    name: 'Wire EDM',
    description: 'Electrical discharge machining for intricate cuts and hardened materials. Ideal for precision dies, molds, and complex internal features.',
    imageUrl: 'https://images.unsplash.com/photo-1720036236632-fdb6211cf317?w=600&q=80',
  },
  {
    name: 'Quality Inspection',
    description: 'CMM inspection and quality assurance services ensuring every part meets exact specifications. Full dimensional reports and material certifications available.',
    imageUrl: 'https://images.pexels.com/photos/18341389/pexels-photo-18341389.jpeg?w=600&q=80',
  },
  {
    name: 'Assembly Services',
    description: 'Complete sub-assembly and assembly services for machined components. Turnkey solutions from raw material to finished assembly.',
    imageUrl: 'https://images.unsplash.com/photo-1720036236694-d0a231c52563?w=600&q=80',
  },
];

const defaultProducts = [
  {
    name: 'Precision Shaft',
    description: 'High-tolerance shaft for automotive transmission systems. Manufactured from hardened steel with precise grinding.',
    specs: 'Material: EN24 Steel | Hardness: 58-62 HRC | Tolerance: +/-0.005mm | Surface Finish: Ra 0.4um',
    applications: 'Automotive transmissions, Industrial gearboxes, Precision machinery',
    qualityNote: 'Each shaft undergoes 100% inspection with CMM verification and material certification.',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=600&q=80' },
      { imageUrl: 'https://images.pexels.com/photos/8973680/pexels-photo-8973680.jpeg?w=600&q=80' },
    ],
  },
  {
    name: 'Aerospace Bracket',
    description: 'Lightweight aluminum bracket for aerospace applications. 5-axis CNC machined with tight tolerances.',
    specs: 'Material: 7075-T6 Aluminum | Weight: 245g | Tolerance: +/-0.01mm | Finish: Anodized',
    applications: 'Aircraft structural components, Satellite systems, Aerospace assemblies',
    qualityNote: 'AS9100D certified production with full traceability and material test reports.',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=600&q=80' },
    ],
  },
  {
    name: 'Hydraulic Valve Body',
    description: 'Complex valve body with multiple internal passages. Precision bored and honed for hydraulic applications.',
    specs: 'Material: Ductile Iron | Pressure Rating: 350 bar | Surface Finish: Ra 0.8um internal',
    applications: 'Industrial hydraulics, Mobile equipment, Power transmission',
    qualityNote: 'Pressure tested to 1.5x working pressure with leak-free guarantee.',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1720036236697-018370867320?w=600&q=80' },
    ],
  },
  {
    name: 'Gear Blank',
    description: 'Precision turned gear blank ready for hobbing. Consistent quality for high-volume production.',
    specs: 'Material: 20MnCr5 | OD Tolerance: +/-0.02mm | Bore Tolerance: H7 | Face Runout: 0.01mm',
    applications: 'Automotive gears, Industrial reducers, Power transmission',
    qualityNote: 'Statistical process control ensures consistent quality across production runs.',
    images: [
      { imageUrl: 'https://images.pexels.com/photos/18341389/pexels-photo-18341389.jpeg?w=600&q=80' },
    ],
  },
];

const defaultMachines = [
  { name: 'Mazak Integrex i-200', capacity: 'Max turning dia: 658mm, Max length: 1519mm', specs: '5-axis multi-tasking, Live tooling, Y-axis' },
  { name: 'DMG MORI NLX 2500', capacity: 'Max turning dia: 366mm, Max length: 705mm', specs: 'High-speed turning, Sub-spindle, Bar feeder' },
  { name: 'Haas VF-4', capacity: 'Table: 1270x508mm, Spindle: 8100rpm', specs: '4th axis ready, 24+1 tool changer' },
  { name: 'Makino a51nx', capacity: 'Pallet: 400x400mm, Spindle: 14000rpm', specs: 'Horizontal machining, High accuracy' },
  { name: 'Sodick AG60L', capacity: 'Max workpiece: 750x550x295mm', specs: 'Wire EDM, +/-0.002mm accuracy' },
  { name: 'Zeiss Contura G2', capacity: 'Measuring range: 700x1000x600mm', specs: 'CMM, VAST XXT sensor' },
];

const defaultInspections = [
  {
    name: 'First Article Inspection',
    equipment: 'CMM + Height Master',
    capability: 'Complete dimensional layout reports for new parts, samples, and PPAP submissions.',
  },
  {
    name: 'In-Process Inspection',
    equipment: 'Micrometers, Bore Gauges, Vernier Systems',
    capability: 'Stage-wise verification of critical features during turning, milling, and grinding.',
  },
  {
    name: 'Final Inspection',
    equipment: 'CMM + Surface Plate Setup',
    capability: '100% dispatch approval checks for key dimensions with signed release records.',
  },
  {
    name: 'Surface Finish Validation',
    equipment: 'Surface Roughness Tester',
    capability: 'Ra and Rz verification for precision sealing, sliding, and bearing surfaces.',
  },
  {
    name: 'Thread & Bore Verification',
    equipment: 'GO/NO-GO Gauges + Plug Gauges',
    capability: 'Inspection for threaded, honed, and close-tolerance bore features.',
  },
  {
    name: 'Material Traceability Review',
    equipment: 'Batch Records + Hardness Testing',
    capability: 'Heat number tracking, hardness checks, and certification linkage for every batch.',
  },
];

module.exports = {
  defaultHomeContent,
  defaultInspections,
  defaultMachines,
  defaultProducts,
  defaultServices,
};
