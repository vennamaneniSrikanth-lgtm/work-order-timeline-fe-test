import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { WorkOrderService } from '../../services/work-order.service';
import { WorkCenterDocument, WorkOrderDocument, ZoomLevel } from '../../models/work-order.models';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, WorkOrderPanelComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  workCenters: WorkCenterDocument[] = [];
  workOrders:  WorkOrderDocument[]  = [];
  dropdownPosition = { top: 0, left: 0 };

  private _docClickHandler = () => { this.openDropdownId = null; };

  zoomLevel: ZoomLevel = 'month';
  zoomLevels: { value: ZoomLevel; label: string }[] = [
    { value: 'day',   label: 'Day'   },
    { value: 'week',  label: 'Week'  },
    { value: 'month', label: 'Month' },
  ];

  viewStartDate:   Date   = new Date();
  viewEndDate:     Date   = new Date();
  timelineColumns: Date[] = [];

  readonly COLUMN_WIDTH = 114;

  // Panel state
  isPanelOpen         = false;
  panelMode: 'create' | 'edit' = 'create';
  selectedWorkCenter: string | null          = null;
  selectedWorkOrder:  WorkOrderDocument | null = null;
  clickedDate:        Date | null            = null;

  // Dropdown state
  openDropdownId: string | null = null;

  // Guards onTimelineClick from firing right after onEditWorkOrder
  private _suppressNextTimelineClick = false;

  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit(): void {
    this.workOrderService.workCenters$.subscribe(c => { this.workCenters = c; });
    this.workOrderService.workOrders$.subscribe(o  => { this.workOrders  = o; });
    this.initializeTimeline();
    document.addEventListener('click', this._docClickHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this._docClickHandler);
  }

  initializeTimeline(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (this.zoomLevel) {
      case 'day':
        this.viewStartDate = this.addDays(today, -14);
        this.viewEndDate   = this.addDays(today,  14);
        break;
      case 'week':
        this.viewStartDate = this.addDays(today, -56);
        this.viewEndDate   = this.addDays(today,  56);
        break;
      case 'month':
        this.viewStartDate = this.addMonths(today, -3);
        this.viewEndDate   = this.addMonths(today,  8);
        break;
    }
    this.generateTimelineColumns();
  }

  generateTimelineColumns(): void {
    this.timelineColumns = [];
    const current = new Date(this.viewStartDate);
    while (current <= this.viewEndDate) {
      this.timelineColumns.push(new Date(current));
      switch (this.zoomLevel) {
        case 'day':   current.setDate(current.getDate() + 1);   break;
        case 'week':  current.setDate(current.getDate() + 7);   break;
        case 'month': current.setMonth(current.getMonth() + 1); break;
      }
    }
  }

  onZoomChange(): void { this.initializeTimeline(); }

  getColumnLabel(date: Date): string {
    switch (this.zoomLevel) {
      case 'day':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'week': {
        const end = this.addDays(date, 6);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  }

  isCurrentPeriod(col: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (this.zoomLevel) {
      case 'day':
        return col.toDateString() === today.toDateString();
      case 'week': {
        const end = this.addDays(col, 6);
        return today >= col && today <= end;
      }
      case 'month':
        return col.getMonth() === today.getMonth() &&
               col.getFullYear() === today.getFullYear();
    }
  }

  isTodayInView(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today >= this.viewStartDate && today <= this.viewEndDate;
  }

  getWorkOrderPosition(wo: WorkOrderDocument): { left: string; width: string } {
    const start      = new Date(wo.data.startDate + 'T00:00:00');
    const end        = new Date(wo.data.endDate   + 'T00:00:00');
    const totalWidth = this.timelineColumns.length * this.COLUMN_WIDTH;
    const totalDays  = this.getDaysBetween(this.viewStartDate, this.viewEndDate) || 1;
    const startOff   = this.getDaysBetween(this.viewStartDate, start);
    const duration   = Math.max(1, this.getDaysBetween(start, end));
    return {
      left:  `${Math.max(0,  (startOff  / totalDays) * totalWidth)}px`,
      width: `${Math.max(40, (duration  / totalDays) * totalWidth)}px`,
    };
  }

  getTodayPosition(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalWidth = this.timelineColumns.length * this.COLUMN_WIDTH;
    const totalDays  = this.getDaysBetween(this.viewStartDate, this.viewEndDate) || 1;
    return `${(this.getDaysBetween(this.viewStartDate, today) / totalDays) * totalWidth}px`;
  }

  // ── Timeline row click → CREATE ───────────────────────────────────────────

  onTimelineClick(event: MouseEvent, workCenterId: string): void {
    // If an edit/delete just fired, swallow this click to prevent overwriting mode
    if (this._suppressNextTimelineClick) {
      this._suppressNextTimelineClick = false;
      return;
    }

    const target = event.target as HTMLElement;
    if (
      target.closest('.work-order-bar')   ||
      target.closest('.actions-menu')     ||
      target.closest('.floating-dropdown')
    ) return;

    const grid   = (event.currentTarget as HTMLElement).querySelector('.timeline-grid') as HTMLElement;
    const rect   = grid.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const totalW = this.timelineColumns.length * this.COLUMN_WIDTH;
    const totalD = this.getDaysBetween(this.viewStartDate, this.viewEndDate) || 1;
    const dayOff = Math.floor((clickX / totalW) * totalD);

    this.clickedDate        = this.addDays(this.viewStartDate, dayOff);
    this.selectedWorkCenter = workCenterId;
    this.panelMode          = 'create';
    this.selectedWorkOrder  = null;
    this.isPanelOpen        = true;
  }

  // ── Edit ──────────────────────────────────────────────────────────────────

  onEditWorkOrder(workOrder: WorkOrderDocument): void {
    // Suppress the click event that will bubble up to onTimelineClick
    this._suppressNextTimelineClick = true;

    this.openDropdownId     = null;
    this.panelMode          = 'edit';          // set BEFORE isPanelOpen
    this.selectedWorkOrder  = workOrder;       // set BEFORE isPanelOpen
    this.selectedWorkCenter = workOrder.data.workCenterId;
    this.clickedDate        = null;
    this.isPanelOpen        = true;            // triggers *ngIf, reads above values
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  onDeleteWorkOrder(workOrder: WorkOrderDocument): void {
    this._suppressNextTimelineClick = true;
    this.openDropdownId = null;
    if (confirm(`Delete "${workOrder.data.name}"?`)) {
      this.workOrderService.deleteWorkOrder(workOrder.docId);
    }
  }

  // ── Panel ─────────────────────────────────────────────────────────────────

  onPanelClose(): void {
    this.isPanelOpen        = false;
    this.selectedWorkOrder  = null;
    this.selectedWorkCenter = null;
    this.clickedDate        = null;
  }

  // ── Dropdown ──────────────────────────────────────────────────────────────

  toggleDropdown(event: MouseEvent, workOrderId: string): void {
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (this.openDropdownId === workOrderId) {
      this.openDropdownId = null;
      return;
    }

    const btn  = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.dropdownPosition = { top: rect.bottom + 4, left: rect.left };
    this.openDropdownId   = workOrderId;
  }

  closeDropdown(): void { this.openDropdownId = null; }

  getStatusClass(status: string): string { return `status-${status}`; }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'open': 'Open', 'in-progress': 'In progress',
      'complete': 'Complete', 'blocked': 'Blocked',
    };
    return labels[status] ?? status;
  }

  getWorkOrdersForCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrders.filter(wo => wo.data.workCenterId === workCenterId);
  }

  private getDaysBetween(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
  private addDays(date: Date, days: number): Date {
    const d = new Date(date); d.setDate(d.getDate() + days); return d;
  }
  private addMonths(date: Date, months: number): Date {
    const d = new Date(date); d.setMonth(d.getMonth() + months); return d;
  }
}
