import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-analytics-hub',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './analytics-hub.html',
  styleUrl: './analytics-hub.css',
})
export class AnalyticsHub implements OnInit {
  public chartOptions: any;
  public donutOptions: any;
  isGenerating = false;
  selectedRange = 'Last 30 Days';

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Stock Levels",
          data: [31, 40, 28, 51, 42, 109, 100]
        }
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false }
      },
      colors: ["#4f46e5"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      tooltip: { x: { format: "dd/MM/yy HH:mm" } }
    };

    this.donutOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut",
        height: 350
      },
      labels: ["Electronics", "Furniture", "Apparel", "Food", "Other"],
      colors: ["#4f46e5", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: "bottom" }
          }
        }
      ]
    };
  }

  ngOnInit(): void {}

  openDateFilter() {
    this.selectedRange = 'Refreshing...';
    setTimeout(() => {
      this.selectedRange = 'Last 30 Days';
      // Simulate data change
      this.chartOptions.series = [{
        name: "Stock Levels",
        data: Array.from({length: 7}, () => Math.floor(Math.random() * 100) + 20)
      }];
    }, 1000);
  }

  async generateAnalyticsReport() {
    this.isGenerating = true;
    
    try {
      const element = document.getElementById('analytics-content');
      if (!element) throw new Error('Content element not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Ensure the loading state is turned off
      setTimeout(() => {
        this.isGenerating = false;
      }, 500);
    }
  }
}
