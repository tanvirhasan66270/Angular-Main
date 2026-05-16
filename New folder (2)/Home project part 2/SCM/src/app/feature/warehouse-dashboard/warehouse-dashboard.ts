import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warehouse-dashboard.html',
  styleUrl: './warehouse-dashboard.css',
})
export class WarehouseDashboard implements OnInit, OnDestroy {
  currentWarehouse = 'Central Distribution Center (CDC-1)';
  temperature = 18.5;
  humidity = 42;
  selectedRack: string | null = null;
  private sensorInterval: any;

  ngOnInit() {
    this.sensorInterval = setInterval(() => {
      // Simulate live sensor jitter
      this.temperature = +(18.5 + (Math.random() * 0.4 - 0.2)).toFixed(1);
      this.humidity = Math.floor(42 + (Math.random() * 4 - 2));
    }, 3000);
  }

  ngOnDestroy() {
    if (this.sensorInterval) clearInterval(this.sensorInterval);
  }

  changeWarehouse(name: string) {
    this.currentWarehouse = name;
    alert(`Connecting to ${name} Digital Twin sensors...`);
  }

  getRackClass(row: number, col: number): string {
    const seed = (row * col) / 48;
    if (seed > 0.8) return 'bg-danger shadow-sm border border-danger border-opacity-50';
    if (seed > 0.4) return 'bg-warning shadow-sm border border-warning border-opacity-50';
    return 'bg-success shadow-sm border border-success border-opacity-50';
  }

  selectRack(row: number, col: number) {
    this.selectedRack = `R${row}-C${col}`;
    alert(`Rack Slot ${this.selectedRack} Details:
    - Status: ${row * col > 20 ? 'Occupied' : 'Reserved'}
    - SKU: PROD-${1000 + row * col}
    - Temperature Zone: Stable
    - Last Movement: 2h ago`);
  }
}
