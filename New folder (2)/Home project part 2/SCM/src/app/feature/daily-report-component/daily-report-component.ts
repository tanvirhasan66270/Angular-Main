import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  DailyReport,
  User,
} from '../../shared/model';

import {
  DailyReportService,
} from '../../core/service/daily-report-service';

import {
  UserService,
} from '../../core/service/user-service';

@Component({
  selector: 'app-daily-report-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './daily-report-component.html',
  styleUrl: './daily-report-component.css',
})
export class DailyReportComponent
implements OnInit {

  // ================= LIST =================
  reports: DailyReport[] = [];

  managers: User[] = [];

  // ================= MODEL =================
  report: DailyReport = {
    userId: '',
    reportDate: '',
    totalTasksDone: 0,
    summary: '',
    generatedAt: '',
  };

  // ================= MODE =================
  isEditMode = false;

  constructor(

    private reportService:
      DailyReportService,

    private userService:
      UserService,

    private cdr:
      ChangeDetectorRef

  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    this.loadReports();

    this.loadManagers();

  }

  // ================= LOAD REPORTS =================
  loadReports(): void {

    this.reportService.getAll()
      .subscribe({

        next: (res) => {

          this.reports = res;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        },

      });

  }

  // ================= LOAD MANAGERS =================
  loadManagers(): void {

    this.userService.getUsers()
      .subscribe({

        next: (res) => {

          // ONLY MANAGER ROLE
          this.managers = res.filter(
            u => u.role === 'MANAGER'
          );

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        },

      });

  }

  // ================= CREATE =================
  add(): void {

    this.report.generatedAt =
      new Date().toISOString();

    this.reportService.create(this.report)
      .subscribe({

        next: () => {

          this.loadReports();

          this.reset();

        },

        error: (err) => {

          console.error(err);

        },

      });

  }

  // ================= EDIT =================
  edit(item: DailyReport): void {

    this.report = {

      ...item,

      reportDate:
        item.reportDate?.split('T')[0] || '',

      generatedAt:
        item.generatedAt?.split('T')[0] || '',

    };

    this.isEditMode = true;

    this.cdr.detectChanges();

  }

  // ================= UPDATE =================
  update(): void {

    if (!this.report.id) return;

    this.reportService.update(
      this.report.id,
      this.report
    ).subscribe({

      next: () => {

        this.loadReports();

        this.reset();

      },

      error: (err) => {

        console.error(err);

      },

    });

  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    const confirmDelete =
      confirm(
        'Are you sure to delete this report?'
      );

    if (!confirmDelete) return;

    this.reportService.delete(id)
      .subscribe({

        next: () => {

          this.loadReports();

        },

        error: (err) => {

          console.error(err);

        },

      });

  }

  // ================= GET MANAGER NAME =================
  getManagerName(id: string): string {

    return this.managers.find(
      x => x.id === id
    )?.name || 'N/A';

  }

  // ================= RESET =================
  reset(): void {

    this.report = {

      userId: '',

      reportDate: '',

      totalTasksDone: 0,

      summary: '',

      generatedAt: '',

    };

    this.isEditMode = false;

    this.cdr.detectChanges();

  }

}