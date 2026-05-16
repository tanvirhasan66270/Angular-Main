import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QCChecklist, QCInspection } from '../../shared/model';
import { QCInspectionService } from '../../core/service/qcinspaction-service';
import { QCChecklistService } from '../../core/service/qccheck-list-service';

@Component({
  selector: 'app-qccheck-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qccheck-list-component.html',
  styleUrls: ['./qccheck-list-component.css'],
})
export class QCCheckListComponent implements OnInit {

  checklists: QCChecklist[] = [];
  inspections: QCInspection[] = [];

  checklist: QCChecklist = {
    inspectionId: '',
    checkpointName: '',
    isPassed: false,
    remarks: '',
  };

  isEditMode = false;

  constructor(
    private service: QCChecklistService,
    private inspectionService: QCInspectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadInspections();
  }

  // ================= LOAD =================
  loadAll(): void {
    this.service.getAll().subscribe(res => {
      this.checklists = res;
      this.cdr.markForCheck();
    });
  }

  loadInspections(): void {
    this.inspectionService.getAll().subscribe(res => {
      this.inspections = res;
      this.cdr.detectChanges();
    });
  }

  // ================= ADD =================
  add(): void {
    this.service.create(this.checklist).subscribe(() => {
      this.loadAll();
      this.reset();
    });
  }

  // ================= EDIT =================
  edit(item: QCChecklist): void {
    this.checklist = { ...item };
    this.isEditMode = true;
    this.cdr.markForCheck();
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.checklist.id) return;

    this.service.update(this.checklist.id, this.checklist).subscribe(() => {
      this.loadAll();
      this.reset();
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    this.service.delete(id).subscribe(() => {
      this.loadAll();
    });
  }

  // ================= RESET =================
  reset(): void {
    this.checklist = {
      inspectionId: '',
      checkpointName: '',
      isPassed: false,
      remarks: '',
    };

    this.isEditMode = false;
    this.cdr.markForCheck();
  }

  // ================= HELPER =================
  getInspectionName(id: string): string {
    return this.inspections.find(i => i.id === id)?.inspectionType || 'N/A';
  }
}