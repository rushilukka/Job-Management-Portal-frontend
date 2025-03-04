import { Component, OnInit } from '@angular/core'; 
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  totalJobs = 0;
  totalApplications = 0;

  chartData: any;
  chartOptions: any;
  pieChartData: any;
  pieChartOptions: any;

  originalLabels: string[] = [];
  originalCounts: number[] = [];
  selectedStatuses: string[] = ['Pending', 'Approved', 'Rejected']; // Default: All Selected

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadChartData();
    this.loadPieChartData();
  }

  loadChartData() {
    this.adminService.fetchBarChartData().subscribe(
      (response) => {
        const jobData = response.body?.data;
        if (jobData) {
          this.totalJobs = jobData.jobCounts.reduce((a, b) => a + b, 0); 

          this.adminService.fetchLineChartData().subscribe(
            (response) => {
              const applicationData = response.body?.data;
              if (applicationData) {
                this.totalApplications = applicationData.jobApplicationCounts.reduce((a, b) => a + b, 0); 

                this.chartData = {
                  labels: jobData.months,
                  datasets: [
                    {
                      type: 'bar',
                      label: 'Jobs Posted',
                      backgroundColor: '#6d28d9',
                      data: jobData.jobCounts
                    },
                    {
                      type: 'line',
                      label: 'Total Applications',
                      borderColor: '#facc15',
                      borderWidth: 2,
                      fill: false,
                      data: applicationData.jobApplicationCounts
                    }
                  ]
                };
              }
            },
            (error) => console.error('Error fetching line chart data:', error)
          );
        }
      },
      (error) => console.error('Error fetching bar chart data:', error)
    );

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    };
  }

  loadPieChartData() {
    this.adminService.fetchPieChartData().subscribe(
      (response) => {
        const pieData = response.body?.data;
        if (pieData) {
          this.originalLabels = ['Pending', 'Approved', 'Rejected'];
          this.originalCounts = [pieData.pending, pieData.approved, pieData.rejected]; 

          this.updatePieChart(); // Initialize Pie Chart with all statuses
        }
      },
      (error) => console.error('Error fetching pie chart data:', error)
    );

    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            generateLabels: (chart: { data: { labels: any[]; datasets: { backgroundColor: { [x: string]: any; }; }[]; }; }) => {
              return chart.data.labels.map((label, index) => ({
                text: label,
                fillStyle: chart.data.datasets[0].backgroundColor[index],
                hidden: false, // Ensures legend items are always visible
                lineWidth: 0, // Prevents selection toggling
              }));
            }
          }
        },
        tooltip: {
          enabled: true // Keep tooltips enabled
        }
      },
      onClick: (event: { stopPropagation: () => void; }) => {
        event.stopPropagation(); // Prevent clicking on the chart from toggling selection
      }
    };
  }

  updatePieChart() {
    const colorMap: { Pending: string; Approved: string; Rejected: string } = {
      'Pending': '#facc15',  // Yellow
      'Approved': '#34d399', // Green
      'Rejected': '#ef4444'  // Red
    };
  
    const filteredIndexes = this.originalLabels
      .map((label, index) => (this.selectedStatuses.includes(label) ? index : -1))
      .filter(index => index !== -1);
  
    const filteredTotal = filteredIndexes.reduce((sum, index) => sum + this.originalCounts[index], 0);
  
    const recalculatedPercentages = filteredIndexes.map(index =>
      filteredTotal > 0 ? ((this.originalCounts[index] / filteredTotal) * 100).toFixed(2) : '0'
    );
  
    this.pieChartData = {
      labels: filteredIndexes.map(index => this.originalLabels[index]),
      datasets: [
        {
          data: recalculatedPercentages,
          backgroundColor: filteredIndexes.map(index => colorMap[this.originalLabels[index] as keyof typeof colorMap]) // Assign fixed colors
        }
      ]
    };
  
    this.totalApplications = filteredTotal; 
  }
  
  

  toggleStatus(status: string) {
    if (this.selectedStatuses.includes(status)) {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    } else {
      this.selectedStatuses.push(status);
    }

    this.updatePieChart(); 
  }
}
