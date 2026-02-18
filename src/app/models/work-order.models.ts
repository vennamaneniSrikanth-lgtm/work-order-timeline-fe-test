export interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string; // ISO format (YYYY-MM-DD)
    endDate: string;   // ISO format (YYYY-MM-DD)
  };
}

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export type ZoomLevel = 'day' | 'week' | 'month';

export interface WorkOrderFormData {
  name: string;
  status: WorkOrderStatus;
  startDate: Date;
  endDate: Date;
}
