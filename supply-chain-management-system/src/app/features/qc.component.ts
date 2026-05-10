import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDbService } from '../services/mock-db.service';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { GRNStatus, UserRole } from '../models/ims.models';

@Component({
  selector: 'app-qc',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Quality Control (QC) Inspector</h2>
        <p class="text-sm text-slate-500 mt-1">Review incoming batches and approve or reject.</p>
      </div>

      <!-- Quick Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Pending Inspections</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ pendingGRNs().length }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Passed Today</p>
          <p class="text-3xl font-bold text-emerald-600 mt-2">{{ passedTodayCount() }}</p>
        </div>
      </div>

      <!-- Pending Queue -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div class="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 class="font-semibold text-slate-800">Pending Inspection Queue (Incoming GRNs)</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">GRN ID</th>
                <th class="py-3 px-4 font-medium">Product</th>
                <th class="py-3 px-4 font-medium text-right">Quantity Received</th>
                <th class="py-3 px-4 font-medium text-center">Status</th>
                <th class="py-3 px-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (grn of pendingGRNs(); track grn.grnId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono text-slate-600 font-medium">{{ grn.grnId }}</td>
                  <td class="py-3 px-4">{{ getProductName(grn.productId) }}</td>
                  <td class="py-3 px-4 font-mono text-right font-medium text-slate-700">{{ grn.quantity }}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
                      PENDING QC
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <div class="flex items-center justify-center space-x-2">
                    @if (canInspect()) {
                      <button (click)="approve(grn.grnId)" class="w-8 h-8 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors flex items-center justify-center shadow-sm" title="Approve">
                        <mat-icon class="text-[18px]">check</mat-icon>
                      </button>
                      <button (click)="reject(grn.grnId)" class="w-8 h-8 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center justify-center shadow-sm" title="Reject">
                        <mat-icon class="text-[18px]">close</mat-icon>
                      </button>
                    }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-12 text-center text-slate-500 bg-slate-50">
                    <mat-icon class="text-4xl text-slate-300 mb-2">fact_check</mat-icon>
                    <p>No pending inspections in queue.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Inspection History -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div class="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 class="font-semibold text-slate-800">Inspection History</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">Date</th>
                <th class="py-3 px-4 font-medium">GRN ID / Product</th>
                <th class="py-3 px-4 font-medium">Inspector</th>
                <th class="py-3 px-4 font-medium">Result</th>
                <th class="py-3 px-4 font-medium text-center">Report</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (grn of pastInspections(); track grn.grnId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 text-slate-600">
                    {{ grn.inspectionDate | date:'mediumDate' }}<br>
                    <span class="text-xs text-slate-400">{{ grn.inspectionDate | date:'shortTime' }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-mono text-xs text-slate-500">{{ grn.grnId }}</div>
                    <div class="font-medium text-slate-800">{{ getProductName(grn.productId) }}</div>
                  </td>
                  <td class="py-3 px-4 text-slate-700">{{ getUserName(grn.inspectedBy || '') }}</td>
                  <td class="py-3 px-4">
                    @if (grn.status === 'QC_PASSED') {
                      <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">PASSED</span>
                    } @else {
                      <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-800">FAILED</span>
                    }
                  </td>
                  <td class="py-3 px-4 text-center">
                    @if (grn.inspectionReportUrl) {
                       <a [href]="grn.inspectionReportUrl" target="_blank" class="text-indigo-600 hover:text-indigo-800 flex items-center justify-center p-1" title="View Report">
                         <mat-icon class="text-[20px]">description</mat-icon>
                       </a>
                    } @else {
                       <span class="text-slate-300 text-xs">-</span>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-12 text-center text-slate-500 bg-slate-50">
                    <mat-icon class="text-4xl text-slate-300 mb-2">history</mat-icon>
                    <p>No past inspections logged.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Upload Simulation Area -->
      <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <div class="flex items-start">
          <mat-icon class="text-indigo-500 mr-3 mt-0.5">upload_file</mat-icon>
          <div>
            <h4 class="font-medium text-indigo-900">Lab Report Upload System</h4>
            <p class="text-sm text-indigo-700/70 mt-1">QC Inspectors can attach PDF reports here before marking a batch as Passed or Failed. This serves as historical verification. (In a real app, this would be a file upload tied to the Approve/Reject flow).</p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class QcComponent {
  db = inject(MockDbService);
  auth = inject(AuthService);

  canInspect = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === UserRole.ADMIN || role === UserRole.QC || role === UserRole.SCM_MANAGER;
  });

  pendingGRNs = computed(() => this.db.grns().filter(g => g.status === GRNStatus.QC_PENDING));
  
  pastInspections = computed(() => {
    return this.db.grns()
      .filter(g => g.status === GRNStatus.QC_PASSED || g.status === GRNStatus.QC_FAILED)
      .filter(g => !!g.inspectionDate) 
      .sort((a, b) => new Date(b.inspectionDate || 0).getTime() - new Date(a.inspectionDate || 0).getTime());
  });

  passedTodayCount = computed(() => {
    const today = new Date().toDateString();
    return this.pastInspections().filter(g => 
      g.status === GRNStatus.QC_PASSED && 
      g.inspectionDate && 
      new Date(g.inspectionDate).toDateString() === today
    ).length;
  });

  getProductName(productId: string): string {
    return this.db.products().find(p => p.productId === productId)?.name || productId;
  }
  
  getUserName(userId: string): string {
    if (!userId) return 'Unknown';
    return this.db.users().find(u => u.userId === userId)?.name || userId;
  }

  approve(grnId: string) {
    if (!this.canInspect()) return;
    const currentUser = this.auth.currentUser();
    this.db.updateGRNStatus(grnId, GRNStatus.QC_PASSED, {
      inspectedBy: currentUser?.userId || 'System',
      inspectionDate: new Date().toISOString(),
      inspectionReportUrl: '#lab-report-passed-' + grnId // mock url
    });
  }

  reject(grnId: string) {
    if (!this.canInspect()) return;
    const currentUser = this.auth.currentUser();
    this.db.updateGRNStatus(grnId, GRNStatus.QC_FAILED, {
      inspectedBy: currentUser?.userId || 'System',
      inspectionDate: new Date().toISOString(),
      inspectionReportUrl: '#lab-report-failed-' + grnId // mock url
    });
  }
}

