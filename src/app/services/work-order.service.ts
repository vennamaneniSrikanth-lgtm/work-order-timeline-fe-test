import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.models';
import { WORK_CENTERS, WORK_ORDERS } from '../data/sample-data';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private workCentersSubject = new BehaviorSubject<WorkCenterDocument[]>(WORK_CENTERS);
  private workOrdersSubject = new BehaviorSubject<WorkOrderDocument[]>(WORK_ORDERS);

  workCenters$: Observable<WorkCenterDocument[]> = this.workCentersSubject.asObservable();
  workOrders$: Observable<WorkOrderDocument[]> = this.workOrdersSubject.asObservable();

  getWorkCenters(): WorkCenterDocument[] {
    return this.workCentersSubject.value;
  }

  getWorkOrders(): WorkOrderDocument[] {
    return this.workOrdersSubject.value;
  }

  getWorkOrdersByWorkCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrdersSubject.value.filter(
      (wo) => wo.data.workCenterId === workCenterId
    );
  }

  createWorkOrder(workOrder: Omit<WorkOrderDocument, 'docId'>): void {
    const newWorkOrder: WorkOrderDocument = {
      ...workOrder,
      docId: `wo-${Date.now()}`,
    };
    const currentOrders = this.workOrdersSubject.value;
    this.workOrdersSubject.next([...currentOrders, newWorkOrder]);
  }

  updateWorkOrder(docId: string, updates: Partial<WorkOrderDocument['data']>): void {
    const currentOrders = this.workOrdersSubject.value;
    const updatedOrders = currentOrders.map((wo) =>
      wo.docId === docId
        ? { ...wo, data: { ...wo.data, ...updates } }
        : wo
    );
    this.workOrdersSubject.next(updatedOrders);
  }

  deleteWorkOrder(docId: string): void {
    const currentOrders = this.workOrdersSubject.value;
    const filteredOrders = currentOrders.filter((wo) => wo.docId !== docId);
    this.workOrdersSubject.next(filteredOrders);
  }

  /**
   * Check if a work order would overlap with existing orders on the same work center
   * @param workCenterId - The work center to check
   * @param startDate - Start date in ISO format
   * @param endDate - End date in ISO format
   * @param excludeId - Optional work order ID to exclude from check (for editing)
   * @returns true if there's an overlap, false otherwise
   */
  hasOverlap(
    workCenterId: string,
    startDate: string,
    endDate: string,
    excludeId?: string
  ): boolean {
    const ordersOnSameCenter = this.workOrdersSubject.value.filter(
      (wo) => wo.data.workCenterId === workCenterId && wo.docId !== excludeId
    );

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    return ordersOnSameCenter.some((wo) => {
      const existingStart = new Date(wo.data.startDate);
      const existingEnd = new Date(wo.data.endDate);

      // Check for overlap: new order starts before existing ends AND new order ends after existing starts
      return newStart < existingEnd && newEnd > existingStart;
    });
  }
}
