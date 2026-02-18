import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkOrderService } from '../../services/work-order.service';
import { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.models';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss'],
})
export class WorkOrderPanelComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() workCenterId!: string;
  @Input() workOrder: WorkOrderDocument | null = null;
  @Input() initialDate: Date | null = null;
  @Output() close = new EventEmitter<void>();

  workOrderForm!: FormGroup;
  errorMessage: string | null = null;

  statusOptions: { value: WorkOrderStatus; label: string }[] = [
    { value: 'open',        label: 'Open'        },
    { value: 'in-progress', label: 'In Progress'  },
    { value: 'complete',    label: 'Complete'     },
    { value: 'blocked',     label: 'Blocked'      },
  ];

  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit(): void {
    // ngOnInit fires AFTER inputs are set when created via *ngIf,
    // so this.mode and this.workOrder are already correct here.
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only re-initialize if mode or workOrder actually changed,
    // AND the form already exists
    if (!this.workOrderForm) return;

    const modeChanged      = changes['mode']      && !changes['mode'].firstChange;
    const workOrderChanged = changes['workOrder']  && !changes['workOrder'].firstChange;

    if (modeChanged || workOrderChanged) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    this.errorMessage = null;

    if (this.mode === 'edit' && this.workOrder) {
      // ── EDIT MODE: pre-fill with existing work order data ─────────────────
      this.workOrderForm = new FormGroup({
        name:      new FormControl(this.workOrder.data.name,      [Validators.required]),
        status:    new FormControl(this.workOrder.data.status,    [Validators.required]),
        startDate: new FormControl(this.workOrder.data.startDate, [Validators.required]),
        endDate:   new FormControl(this.workOrder.data.endDate,   [Validators.required]),
      });

    } else {
      // ── CREATE MODE: blank form, dates pre-filled from click position ─────
      const startDate = this.initialDate ?? new Date();
      const endDate   = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      this.workOrderForm = new FormGroup({
        name:      new FormControl('',                         [Validators.required]),
        status:    new FormControl('open' as WorkOrderStatus,  [Validators.required]),
        startDate: new FormControl(this.dateToString(startDate), [Validators.required]),
        endDate:   new FormControl(this.dateToString(endDate),   [Validators.required]),
      });
    }
  }

  openDatePicker(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input?.showPicker) {
      input.showPicker();
    }
  }

  onSubmit(): void {
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const { name, status, startDate, endDate } = this.workOrderForm.value;

    if (new Date(endDate) <= new Date(startDate)) {
      this.errorMessage = 'End date must be after start date.';
      return;
    }

    // Exclude the current order's id from overlap check when editing
    const excludeId = this.mode === 'edit' && this.workOrder
      ? this.workOrder.docId
      : undefined;

    const hasOverlap = this.workOrderService.hasOverlap(
      this.workCenterId,
      startDate,
      endDate,
      excludeId
    );

    if (hasOverlap) {
      this.errorMessage =
        'This work order overlaps with an existing order on the same work center. Please adjust the dates.';
      return;
    }

    if (this.mode === 'create') {
      this.workOrderService.createWorkOrder({
        docType: 'workOrder',
        data: { name, workCenterId: this.workCenterId, status, startDate, endDate },
      });
    } else if (this.mode === 'edit' && this.workOrder) {
      this.workOrderService.updateWorkOrder(this.workOrder.docId, {
        name, status, startDate, endDate,
      });
    }

    this.close.emit();
  }

  onCancel(): void {
    this.close.emit();
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  private dateToString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
