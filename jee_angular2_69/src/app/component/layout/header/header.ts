import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  openDropdownId: string | null = null;

  // কোন dropdown খোলা বা বন্ধ করে
  toggle(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  // dropdown খোলা আছে কিনা চেক করে
  isOpen(id: string): boolean {
    return this.openDropdownId === id;
  }

  // navbar এর বাইরে click করলে সব বন্ধ হয়
  @HostListener('document:click')
  onDocumentClick(): void {
    this.openDropdownId = null;
  }
}
