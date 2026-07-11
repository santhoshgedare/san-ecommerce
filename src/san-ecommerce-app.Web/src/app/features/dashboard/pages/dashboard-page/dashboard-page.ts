import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, DoughnutController, ArcElement, BarController, BarElement, CategoryScale, Legend, LinearScale, Tooltip } from 'chart.js';

import { PageHeader } from '@shared/components/page-header/page-header';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

Chart.register(DoughnutController, ArcElement, BarController, BarElement, CategoryScale, Legend, LinearScale, Tooltip);

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, PageHeader, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements AfterViewInit {
  @ViewChild('salesChart') private salesChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') private trafficChart?: ElementRef<HTMLCanvasElement>;

  readonly cards = [
    { label: 'Revenue', value: '$286K', change: '+12.4%' },
    { label: 'Orders', value: '1,284', change: '+8.1%' },
    { label: 'Customers', value: '7,502', change: '+5.2%' },
    { label: 'Refund rate', value: '1.4%', change: '-0.3%' },
  ];
  readonly activities = [
    'Administrator invited 3 new users to the platform.',
    'Inventory sync finished with 98.7% success.',
    'Finance exported monthly reconciliation workbook.',
  ];
  readonly quickActions = [
    { label: 'Create user', route: '/users/new', icon: 'person_add' },
    { label: 'Manage roles', route: '/roles', icon: 'shield' },
    { label: 'Review permissions', route: '/permissions', icon: 'gpp_good' },
  ];

  ngAfterViewInit(): void {
    if (this.salesChart) {
      new Chart(this.salesChart.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ label: 'Sales', data: [42, 58, 55, 79, 64, 82, 91], backgroundColor: '#2563eb' }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    if (this.trafficChart) {
      new Chart(this.trafficChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Direct', 'Search', 'Email'],
          datasets: [{ data: [46, 34, 20], backgroundColor: ['#2563eb', '#7c3aed', '#22c55e'] }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }
  }
}
