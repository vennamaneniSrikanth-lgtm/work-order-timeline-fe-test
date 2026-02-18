import { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.models';

export const WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Genesis Hardware' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'Rodriques Electrics' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Konsulting Inc' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'McMarrow Distribution' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Spartan Manufacturing' } },
  { docId: 'wc-6', docType: 'workCenter', data: { name: 'Velocity Logistics' } },
  { docId: 'wc-7', docType: 'workCenter', data: { name: 'Titan Assembly Works' } },
  { docId: 'wc-8', docType: 'workCenter', data: { name: 'Precision Tool & Die' } },
  { docId: 'wc-9', docType: 'workCenter', data: { name: 'Apex Polymer Lab' } },
  { docId: 'wc-10', docType: 'workCenter', data: { name: 'Zenith Casting Foundry' } },
  { docId: 'wc-11', docType: 'workCenter', data: { name: 'Nexus Quality Control' } },
  { docId: 'wc-12', docType: 'workCenter', data: { name: 'Quantum Laser Cutting' } },
  { docId: 'wc-13', docType: 'workCenter', data: { name: 'Stellar CNC Machining' } },
  { docId: 'wc-14', docType: 'workCenter', data: { name: 'Omega Packaging Systems' } },
  { docId: 'wc-15', docType: 'workCenter', data: { name: 'IronClad Heavy Forging' } },
  { docId: 'wc-16', docType: 'workCenter', data: { name: 'Blueprints Design Studio' } },
  { docId: 'wc-17', docType: 'workCenter', data: { name: 'Vector Prototyping' } },
  { docId: 'wc-18', docType: 'workCenter', data: { name: 'Lumina Finishing Works' } },
  { docId: 'wc-19', docType: 'workCenter', data: { name: 'Global Freight Terminal' } },
  { docId: 'wc-20', docType: 'workCenter', data: { name: 'Heritage Woodworking' } }
];


const addDays = (date: Date, days: number): string => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

const addMonths = (date: Date, months: number): string => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString().split('T')[0];
};

const today = new Date();

export const WORK_ORDERS: WorkOrderDocument[] = [
  // Genesis Hardware - Complete work order
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Dintrix Ltd',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: addMonths(today, -2),
      endDate: addMonths(today, -1),
    },
  },

  // Konsulting Inc - First In Progress
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Konsulting Inc',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: addDays(today, -15),
      endDate: addDays(today, 5),
    },
  },

  // Konsulting Inc - Second In Progress (Compleks Systems)
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Compleks Systems',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: addMonths(today, 1),
      endDate: addMonths(today, 2),
    },
  },

  // McMarrow Distribution - Blocked
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'McMarrow Distribution',
      workCenterId: 'wc-4',
      status: 'blocked',
      startDate: addDays(today, 10),
      endDate: addMonths(today, 1),
    },
  },


  {
    docId: 'wo-27',
    docType: 'workOrder',
    data: {
      name: 'Custom Alloy Pour',
      workCenterId: 'wc-10', // Zenith Casting Foundry
      status: 'open',
      startDate: addMonths(today, -2),
      endDate: addMonths(today, -1),
    }
  },
  {
    docId: 'wo-28',
    docType: 'workOrder',
    data: {
      name: 'Precision Bracket Cut',
      workCenterId: 'wc-12', // Quantum Laser Cutting
      status: 'in-progress',
      startDate: addDays(today, -5),
      endDate: addDays(today, 10),
    }
  },
  {
    docId: 'wo-29',
    docType: 'workOrder',
    data: {
      name: 'Engine Block Milling',
      workCenterId: 'wc-13', // Stellar CNC Machining
      status: 'blocked',
      startDate: addDays(today, 2),
      endDate: addDays(today, 20),
    }
  },
  {
    docId: 'wo-30',
    docType: 'workOrder',
    data: {
      name: 'Bulk Pharma Labeling',
      workCenterId: 'wc-14', // Omega Packaging Systems
      status: 'open',
      startDate: addDays(today, 15),
      endDate: addMonths(today, 1),
    }
  },
  {
    docId: 'wo-31',
    docType: 'workOrder',
    data: {
      name: 'Structural Beam Forging',
      workCenterId: 'wc-15', // IronClad Heavy Forging
      status: 'in-progress',
      startDate: addMonths(today, 0),
      endDate: addMonths(today, 3),
    }
  },
  {
    docId: 'wo-32',
    docType: 'workOrder',
    data: {
      name: 'Surface Coating Alpha',
      workCenterId: 'wc-18', // Lumina Finishing Works
      status: 'open',
      startDate: addDays(today, -10),
      endDate: addDays(today, -2),
    }
  },
  {
    docId: 'wo-33',
    docType: 'workOrder',
    data: {
      name: 'Turbine Prototype V2',
      workCenterId: 'wc-17', // Vector Prototyping
      status: 'blocked',
      startDate: addDays(today, -20),
      endDate: addDays(today, 5),
    }
  },
  {
    docId: 'wo-34',
    docType: 'workOrder',
    data: {
      name: 'High-Stress Tooling',
      workCenterId: 'wc-13', // Stellar CNC Machining (Second order for same WC)
      status: 'open',
      startDate: addDays(today, 25),
      endDate: addMonths(today, 2),
    }
  },


  { docId: 'wo-22', docType: 'workOrder', data: { name: 'Srikanth Vennamaneni', workCenterId: 'wc-6', status: 'open', startDate: addMonths(today, -3), endDate: addMonths(today, -2), }, },

{ docId: 'wo-23', docType: 'workOrder', data: { name: 'Titan Assembly Works', workCenterId: 'wc-7', status: 'in-progress', startDate: addMonths(today, -1), endDate: addMonths(today, 1), }, },

{ docId: 'wo-24', docType: 'workOrder', data: { name: 'Precision Tool & Die', workCenterId: 'wc-8', status: 'complete', startDate: addMonths(today, -5), endDate: addMonths(today, -4), }, },


{ docId: 'wo-26', docType: 'workOrder', data: { name: 'Horizon Fabrication', workCenterId: 'wc-10', status: 'in-progress', startDate: addMonths(today, 0), endDate: addMonths(today, 2), }, },

{ docId: 'wo-27', docType: 'workOrder', data: { name: 'Sterling Components', workCenterId: 'wc-11', status: 'complete', startDate: addMonths(today, -2), endDate: addMonths(today, -1), }, },


{ docId: 'wo-29', docType: 'workOrder', data: { name: 'Cascade Engineering', workCenterId: 'wc-13', status: 'complete', startDate: addMonths(today, -4), endDate: addMonths(today, -3), }, },

{ docId: 'wo-30', docType: 'workOrder', data: { name: 'Pinnacle Metalworks', workCenterId: 'wc-14', status: 'in-progress', startDate: addMonths(today, -1), endDate: addMonths(today, 1), }, },

{ docId: 'wo-31', docType: 'workOrder', data: { name: 'Quantum Production Systems', workCenterId: 'wc-15', status: 'complete', startDate: addMonths(today, -6), endDate: addMonths(today, -5), }, },

  // Additional work orders for testing different scenarios
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Assembly Line Setup',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: addDays(today, 20),
      endDate: addMonths(today, 1),
    },
  },

  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Quality Control Batch A',
      workCenterId: 'wc-5',
      status: 'in-progress',
      startDate: addDays(today, -10),
      endDate: addDays(today, 15),
    },
  },

  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Hardware Production Run',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: addMonths(today, 2),
      endDate: addMonths(today, 3),
    },
  },

  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Electrical Wiring Phase 1',
      workCenterId: 'wc-2',
      status: 'in-progress',
      startDate: addMonths(today, -3),
      endDate: addMonths(today, -2),
    },
  },

  {
    docId: 'wo-9',
    docType: 'workOrder',
    data: {
      name: 'Distribution Planning',
      workCenterId: 'wc-4',
      status: 'open',
      startDate: addMonths(today, 3),
      endDate: addMonths(today, 4),
    },
  },

  {
    docId: 'wo-10',
    docType: 'workOrder',
    data: {
      name: 'Manufacturing Batch B',
      workCenterId: 'wc-5',
      status: 'blocked',
      startDate: addMonths(today, -4),
      endDate: addMonths(today, -3),
    },
  },
];
