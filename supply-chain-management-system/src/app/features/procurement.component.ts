import { Component, inject, signal, computed } from '@angular/core';
import { MockDbService } from '../services/mock-db.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Supplier, POStatus, GRNStatus, UserRole } from '../models/ims.models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [MatIconModule, DatePipe, CurrencyPipe, ReactiveFormsModule, CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Procurement & Sourcing</h2>
        @if (canCreatePO()) {
          <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-sm flex items-center">
            <mat-icon class="text-[18px] mr-2">add</mat-icon> Create PO
          </button>
        }
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Active POs</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ db.purchaseOrders().length }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Pending Approvals</p>
          <p class="text-3xl font-bold text-amber-600 mt-2">2</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Vendor Network</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ db.suppliers().length }}</p>
        </div>
      </div>

      <!-- PO Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div class="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 class="font-semibold text-slate-800">Purchase Orders (PO)</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">PO Number</th>
                <th class="py-3 px-4 font-medium">Supplier ID</th>
                <th class="py-3 px-4 font-medium">Amount</th>
                <th class="py-3 px-4 font-medium">Expected Del.</th>
                <th class="py-3 px-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (po of db.purchaseOrders(); track po.poId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono text-slate-700 font-medium">{{ po.poNumber }}</td>
                  <td class="py-3 px-4 text-slate-600">{{ po.supplierId }}</td>
                  <td class="py-3 px-4 font-medium text-slate-800">{{ po.totalAmount | currency:'BDT ' }}</td>
                  <td class="py-3 px-4 text-slate-500">{{ po.expectedDeliveryDate | date }}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium"
                      [class.bg-blue-100]="po.status === 'SENT'"
                      [class.text-blue-800]="po.status === 'SENT'"
                      [class.bg-emerald-100]="po.status === 'RECEIVED'"
                      [class.text-emerald-800]="po.status === 'RECEIVED'">
                      {{ po.status }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vendor Management Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm mt-8">
        <div class="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 class="font-semibold text-slate-800">Vendor Management</h3>
          @if (canManageSuppliers()) {
            <button (click)="openAddSupplierModal()" class="px-3 py-1.5 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-xs font-medium transition shadow-sm flex items-center">
               <mat-icon class="text-[16px] mr-1">add_circle</mat-icon> Add Supplier
            </button>
          }
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">Supplier ID</th>
                <th class="py-3 px-4 font-medium">Name</th>
                <th class="py-3 px-4 font-medium">Contact Person</th>
                <th class="py-3 px-4 font-medium">Email</th>
                <th class="py-3 px-4 font-medium">Phone</th>
                <th class="py-3 px-4 font-medium">Avg Lead Time</th>
                <th class="py-3 px-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (sup of db.suppliers(); track sup.supplierId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono text-slate-700 font-medium">{{ sup.supplierId }}</td>
                  <td class="py-3 px-4 text-slate-800 font-medium">{{ sup.name }}</td>
                  <td class="py-3 px-4 text-slate-600">{{ sup.contactPerson }}</td>
                  <td class="py-3 px-4 text-slate-600">{{ sup.email }}</td>
                  <td class="py-3 px-4 text-slate-600">{{ sup.phone }}</td>
                  <td class="py-3 px-4 text-emerald-600 font-medium whitespace-nowrap">{{ getAverageLeadTime(sup.supplierId) }}</td>
                  <td class="py-3 px-4 text-center">
                    @if (canManageSuppliers()) {
                      <button (click)="openEditSupplierModal(sup)" class="w-8 h-8 rounded hover:bg-slate-200 text-slate-500 hover:text-blue-600 transition flex items-center justify-center mx-auto" title="Edit Supplier">
                        <mat-icon class="text-[18px]">edit</mat-icon>
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Supplier Performance Report -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm mt-8">
        <div class="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 class="font-semibold text-slate-800">Supplier Performance Report</h3>
          <p class="text-xs text-slate-500 mt-1">Analyze on-time delivery rate and QC pass rate for suppliers.</p>
        </div>
        <div class="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-end bg-white">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Select Supplier</label>
            <select [(ngModel)]="filterSupplierId" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
              <option value="">All Suppliers</option>
              @for (sup of db.suppliers(); track sup.supplierId) {
                <option [value]="sup.supplierId">{{ sup.name }} ({{ sup.supplierId }})</option>
              }
            </select>
          </div>
          <div class="min-w-[150px]">
            <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">From Date</label>
            <input type="date" [(ngModel)]="filterStartDate" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
          </div>
          <div class="min-w-[150px]">
            <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">To Date</label>
            <input type="date" [(ngModel)]="filterEndDate" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">Supplier</th>
                <th class="py-3 px-4 font-medium">Total POs (Range)</th>
                <th class="py-3 px-4 font-medium">On-Time Delivery %</th>
                <th class="py-3 px-4 font-medium">QC Pass %</th>
                <th class="py-3 px-4 font-medium">Overall Rating</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (perf of filteredPerformance(); track perf.supplierId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4">
                    <span class="font-medium text-slate-800">{{ perf.supplierName }}</span>
                    <span class="text-xs text-slate-500 block">{{ perf.supplierId }}</span>
                  </td>
                  <td class="py-3 px-4 font-medium text-slate-700">{{ perf.totalPOs }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center">
                      <span class="w-12 inline-block font-mono text-slate-700">{{ perf.onTimeRate | number:'1.0-0' }}%</span>
                      <div class="w-24 bg-slate-200 rounded-full h-1.5 ml-2 hidden sm:block">
                        <div class="h-1.5 rounded-full" [class.bg-emerald-500]="perf.onTimeRate >= 80" [class.bg-amber-500]="perf.onTimeRate >= 50 && perf.onTimeRate < 80" [class.bg-red-500]="perf.onTimeRate < 50" [style.width.%]="perf.onTimeRate"></div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center">
                      <span class="w-12 inline-block font-mono text-slate-700">{{ perf.qcPassRate | number:'1.0-0' }}%</span>
                      <div class="w-24 bg-slate-200 rounded-full h-1.5 ml-2 hidden sm:block">
                        <div class="h-1.5 rounded-full" [class.bg-emerald-500]="perf.qcPassRate >= 80" [class.bg-amber-500]="perf.qcPassRate >= 50 && perf.qcPassRate < 80" [class.bg-red-500]="perf.qcPassRate < 50" [style.width.%]="perf.qcPassRate"></div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider"
                      [class.bg-emerald-100]="perf.overallRating === 'Excellent'"
                      [class.text-emerald-800]="perf.overallRating === 'Excellent'"
                      [class.bg-blue-100]="perf.overallRating === 'Good'"
                      [class.text-blue-800]="perf.overallRating === 'Good'"
                      [class.bg-amber-100]="perf.overallRating === 'Fair'"
                      [class.text-amber-800]="perf.overallRating === 'Fair'"
                      [class.bg-red-100]="perf.overallRating === 'Poor'"
                      [class.text-red-800]="perf.overallRating === 'Poor'"
                      [class.bg-slate-100]="perf.overallRating === 'N/A'"
                      [class.text-slate-800]="perf.overallRating === 'N/A'">
                      {{ perf.overallRating }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-8 text-center text-slate-500">No performance data matches the filters.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Supplier Modal -->
    @if (isSupplierModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-lg font-bold text-slate-900">{{ editingSupplierId() ? 'Edit Supplier' : 'Add New Supplier' }}</h3>
            <button (click)="closeSupplierModal()" class="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition">
              <mat-icon viewBox="0 0 24 24">close</mat-icon>
            </button>
          </div>
          
          <div class="p-5 overflow-y-auto">
            <form [formGroup]="supplierForm" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
                <input type="text" formControlName="name" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                <input type="text" formControlName="contactPerson" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" formControlName="email" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="text" formControlName="phone" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea formControlName="address" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"></textarea>
              </div>
            </form>
          </div>
          
          <div class="p-5 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50">
            <button (click)="closeSupplierModal()" class="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition shadow-sm">
              Cancel
            </button>
            <button (click)="saveSupplier()" [disabled]="supplierForm.invalid" 
                    class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Save Supplier
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProcurementComponent {
  db = inject(MockDbService);
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  
  canCreatePO = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === UserRole.ADMIN || role === UserRole.SCM_MANAGER || role === UserRole.PROCUREMENT;
  });

  canManageSuppliers = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === UserRole.ADMIN || role === UserRole.SCM_MANAGER;
  });
  
  isSupplierModalOpen = signal(false);
  editingSupplierId = signal<string | null>(null);

  // Filters
  filterSupplierId = signal<string>('');
  filterStartDate = signal<string>('');
  filterEndDate = signal<string>('');
  
  supplierForm = this.fb.group({
    name: ['', Validators.required],
    contactPerson: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  filteredPerformance = computed(() => {
    let suppliersToEval = this.db.suppliers();
    if (this.filterSupplierId()) {
      suppliersToEval = suppliersToEval.filter(s => s.supplierId === this.filterSupplierId());
    }

    const pos = this.db.purchaseOrders();
    const grns = this.db.grns();
    
    return suppliersToEval.map(sup => {
      let filteredPOs = pos.filter(po => po.supplierId === sup.supplierId);
      
      if (this.filterStartDate()) {
        const start = new Date(this.filterStartDate()).getTime();
        filteredPOs = filteredPOs.filter(po => new Date(po.createdAt).getTime() >= start);
      }
      if (this.filterEndDate()) {
        const end = new Date(this.filterEndDate()).getTime();
        filteredPOs = filteredPOs.filter(po => new Date(po.createdAt).getTime() <= end);
      }

      // Calculate On-Time Delivery Rate
      const receivedPOs = filteredPOs.filter(po => po.status === POStatus.RECEIVED);
      let onTimeCount = 0;
      for (const po of receivedPOs) {
        const relatedGrn = grns.find(g => g.poId === po.poId);
        if (relatedGrn) {
          const expected = new Date(po.expectedDeliveryDate).getTime();
          const received = new Date(relatedGrn.receivedAt).getTime();
          if (received <= expected) {
            onTimeCount++;
          }
        }
      }
      const onTimeRate = receivedPOs.length > 0 ? (onTimeCount / receivedPOs.length) * 100 : 0;

      // Calculate QC Pass Rate
      let qcPassedCount = 0;
      let qcFiledCount = 0;
      for (const po of filteredPOs) {
        const relatedGrn = grns.find(g => g.poId === po.poId);
        if (relatedGrn) {
          if (relatedGrn.status === GRNStatus.QC_PASSED) qcPassedCount++;
          else if (relatedGrn.status === GRNStatus.QC_FAILED) qcFiledCount++;
        }
      }
      const totalQC = qcPassedCount + qcFiledCount;
      const qcPassRate = totalQC > 0 ? (qcPassedCount / totalQC) * 100 : 0;

      // Derive Overall Rating
      let overallRating = 'N/A';
      if (receivedPOs.length > 0) {
         const score = (onTimeRate + (totalQC > 0 ? qcPassRate : 100)) / 2;
         if (score >= 90) overallRating = 'Excellent';
         else if (score >= 75) overallRating = 'Good';
         else if (score >= 50) overallRating = 'Fair';
         else overallRating = 'Poor';
      }

      return {
        supplierId: sup.supplierId,
        supplierName: sup.name,
        totalPOs: filteredPOs.length,
        onTimeRate,
        qcPassRate,
        overallRating
      };
    });
  });

  openAddSupplierModal() {
    this.supplierForm.reset();
    this.editingSupplierId.set(null);
    this.isSupplierModalOpen.set(true);
  }

  getAverageLeadTime(supplierId: string): string {
    const receivedPOs = this.db.purchaseOrders().filter(po => po.supplierId === supplierId && po.status === POStatus.RECEIVED);
    if (receivedPOs.length === 0) return 'No Data';

    let totalDays = 0;
    let count = 0;
    for (const po of receivedPOs) {
      const grn = this.db.grns().find(g => g.poId === po.poId);
      if (grn) {
        const createdDate = new Date(po.createdAt).getTime();
        const receivedDate = new Date(grn.receivedAt).getTime();
        const diffDays = Math.max(0, Math.ceil((receivedDate - createdDate) / (1000 * 3600 * 24)));
        totalDays += diffDays;
        count++;
      }
    }
    return count > 0 ? `${(totalDays / count).toFixed(1)} Days` : 'No Data';
  }

  openEditSupplierModal(supplier: Supplier) {
    if (!this.canManageSuppliers()) return;
    this.supplierForm.patchValue({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
    this.editingSupplierId.set(supplier.supplierId);
    this.isSupplierModalOpen.set(true);
  }

  closeSupplierModal() {
    this.isSupplierModalOpen.set(false);
  }

  saveSupplier() {
    if (this.supplierForm.valid) {
      if (this.editingSupplierId()) {
        this.db.updateSupplier(this.editingSupplierId()!, this.supplierForm.value as any);
      } else {
        this.db.addSupplier(this.supplierForm.value as any);
      }
      this.closeSupplierModal();
    }
  }
}


