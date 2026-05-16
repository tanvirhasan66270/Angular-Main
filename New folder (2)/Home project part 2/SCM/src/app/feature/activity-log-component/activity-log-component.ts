import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivityLog,
  User
} from '../../shared/model';

import { ActivityLogService } from '../../core/service/activity-log-service';
import { UserService } from '../../core/service/user-service';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-activity-log-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-log-component.html',
  styleUrls: ['./activity-log-component.css'],
})
export class ActivityLogComponent implements OnInit {

  // ================= DATA =================
  logs: ActivityLog[] = [];
  users: User[] = [];

  // ================= FORM =================
  log: ActivityLog = this.initForm();

  isEditMode = false;

  // ================= FILTERS & SEARCH =================
  searchText = '';
  selectedAction = '';
  selectedModule = '';

  // ================= PAGINATION =================
  currentPage = 1;
  pageSize = 10;

  constructor(
    private activityLogService: ActivityLogService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // ================= LOAD =================
  loadAll(): void {

    this.activityLogService.getAll().subscribe({
      next: (res) => {
        this.logs = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= CREATE =================
  add(): void {

    this.log.performedAt = new Date().toISOString();

    this.activityLogService.create(this.log).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(data: ActivityLog): void {
    this.log = { ...data };
    this.isEditMode = true;
    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.log.id) return;

    this.activityLogService.update(this.log.id, this.log).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    if (!confirm('Delete this log?')) return;

    this.activityLogService.delete(id).subscribe({
      next: () => {
        this.loadAll();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= HELPERS =================
  getUserName(id: string): string {
    return this.users.find(u => u.id === id)?.name || 'N/A';
  }

  // ================= RESET =================
  reset(): void {

    this.log = this.initForm();
    this.isEditMode = false;
    this.cdr.detectChanges();
  }

  // ================= INIT FORM =================
  initForm(): ActivityLog {

    return {
      userId: '',
      action: '',
      module: '',
      referenceId: '',
      description: '',
      ipAddress: '',
      performedAt: '',
    };
  }

  // ================= HELPERS =================
  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // ================= FILTER LOGS =================
  filteredLogs(): ActivityLog[] {
    return this.logs.filter(log => {
      const matchesSearch = log.description?.toLowerCase().includes(this.searchText.toLowerCase()) || 
                            log.referenceId?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesAction = this.selectedAction ? log.action === this.selectedAction : true;
      const matchesModule = this.selectedModule ? log.module === this.selectedModule : true;
      
      return matchesSearch && matchesAction && matchesModule;
    });
  }

  // ================= PAGINATION METHODS =================
  get paginatedLogs(): ActivityLog[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredLogs().slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs().length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ================= EXPORT METHODS =================
  exportToExcel(): void {
    const exportData = this.filteredLogs().map(log => ({
      User: this.getUserName(log.userId),
      Action: log.action,
      Module: log.module,
      Reference: log.referenceId,
      Description: log.description,
      'IP Address': log.ipAddress,
      'Date Performed': new Date(log.performedAt).toLocaleString()
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ActivityLogs');
    
    XLSX.writeFile(wb, 'ActivityLogs.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    
    doc.text('Activity Logs Report', 14, 15);
    
    const head = [['User', 'Action', 'Module', 'Reference', 'Description', 'IP Address', 'Date']];
    const data = this.filteredLogs().map(log => [
      this.getUserName(log.userId),
      log.action,
      log.module,
      log.referenceId,
      log.description,
      log.ipAddress,
      new Date(log.performedAt).toLocaleString()
    ]);
    
    autoTable(doc, {
      head: head,
      body: data,
      startY: 20,
      styles: { fontSize: 8 }
    });
    
    doc.save('ActivityLogs.pdf');
  }
}
