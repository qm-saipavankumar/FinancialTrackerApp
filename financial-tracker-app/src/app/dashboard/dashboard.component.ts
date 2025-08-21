
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { BudgetService } from '../services/budget.service'; 
import { TransactionService } from '../services/transaction.service'; 
import { DashboardSummary } from '../models/dashboard-summary.model';
import { MonthlySummary } from '../models/monthly_summary.model';
import { MonthlyFinancialSummary } from '../models/monthly_financial_summary.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
    summary: DashboardSummary | null = null;
    loading = true;
    error = '';

    // Pie Chart properties (existing)
    public pieChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        }
    };
    public pieChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
        }]
    };
    public pieChartType: ChartType = 'pie';
    private expensesByCategory: any[] = [];

    // Bar Chart properties (existing)
    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            x: {},
            y: {
                min: 0
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        }
    };
    public barChartType: ChartType = 'bar';
    public barChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };
    private monthlySummaryData: MonthlySummary[] = [];

    // New: Current Month Donut Chart properties
    public currentMonthSummary: MonthlyFinancialSummary | null = null;
    public currentMonthDoughnutChartData: ChartData<'doughnut'> = {
        labels: ['Income', 'Expenses'],
        datasets: [{ data: [], backgroundColor: ['#28a745', '#dc3545'] }] // Green for income, Red for expenses
    };
    public currentMonthDoughnutChartType: ChartType = 'doughnut';
    public currentMonthDoughnutOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // No legend for mini charts
            },
            tooltip: {
                enabled: true // Enable tooltips on hover
            }
        }
    };

    // New: Last Month Donut Chart properties
    public lastMonthSummary: MonthlyFinancialSummary | null = null;
    public lastMonthDoughnutChartData: ChartData<'doughnut'> = {
        labels: ['Income', 'Expenses'],
        datasets: [{ data: [], backgroundColor: ['#28a745', '#dc3545'] }]
    };
    public lastMonthDoughnutChartType: ChartType = 'doughnut';
    public lastMonthDoughnutOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true
            }
        }
    };

  // Budgets and Recent Transactions for dashboard display
  budgets: any[] = [];
  recentTransactions: any[] = []; // FIX: Added this missing property declaration

  constructor(
    private dashboardService: DashboardService,
    private budgetService: BudgetService, // Inject BudgetService
    private transactionService: TransactionService // Inject TransactionService
  ) { }

    ngOnInit(): void {
        this.loadDashboardSummary();
        this.loadExpensesByCategory();
        this.loadMonthlySummary();
        this.loadCurrentMonthFinancialSummary();
      this.loadLastMonthFinancialSummary();
      this.loadBudgetsForDashboard();
        this.loadRecentTransactions();
    }

    loadDashboardSummary(): void {
        this.loading = true;
        this.dashboardService.getSummary().subscribe({
            next: (data) => {
                this.summary = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load dashboard summary', err);
                this.error = 'Failed to load summary data.';
                this.loading = false;
            }
        });
    }

    loadExpensesByCategory(): void {
        this.dashboardService.getExpensesByCategory().subscribe({
            next: (data) => {
                this.expensesByCategory = data;
                this.updatePieChart();
            },
            error: (err) => {
                console.error('Failed to load expenses by category', err);
            }
        });
    }

    loadMonthlySummary(): void {
        this.dashboardService.getMonthlySummary().subscribe({
            next: (data) => {
                this.monthlySummaryData = data;
                this.updateBarChart();
            },
            error: (err) => {
                console.error('Failed to load monthly summary', err);
            }
        });
    }

    private updatePieChart(): void {
        const labels = this.expensesByCategory.map(item => item.categoryName);
        const data = this.expensesByCategory.map(item => item.totalAmount);
        const colors = this.expensesByCategory.map(item => item.categoryColor);

        this.pieChartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
            }]
        };
    }

    private updateBarChart(): void {
        const labels = this.monthlySummaryData.map(item => item.monthYear);
        const incomeData = this.monthlySummaryData.map(item => item.totalIncome);
        const expensesData = this.monthlySummaryData.map(item => item.totalExpenses);

        this.barChartData = {
            labels: labels,
            datasets: [
                { data: incomeData, label: 'Income', backgroundColor: 'rgba(40, 167, 69, 0.7)' },
                { data: expensesData, label: 'Expenses', backgroundColor: 'rgba(220, 53, 69, 0.7)' } // Red
            ]
        };
    }

    loadCurrentMonthFinancialSummary(): void {
        this.dashboardService.getCurrentMonthFinancialSummary().subscribe({
            next: (data) => {
                this.currentMonthSummary = data;
                this.currentMonthDoughnutChartData.datasets[0].data = [data.totalIncome, data.totalExpenses];
            },
            error: (err) => {
                console.error('Failed to load current month financial summary', err);
            }
        });
    }

    loadLastMonthFinancialSummary(): void {
        this.dashboardService.getLastMonthFinancialSummary().subscribe({
            next: (data) => {
                this.lastMonthSummary = data;
                this.lastMonthDoughnutChartData.datasets[0].data = [data.totalIncome, data.totalExpenses];
            },
            error: (err) => {
                console.error('Failed to load last month financial summary', err);
            }
        });
    }

  // New: Load budgets (using the same method from BudgetsListComponent)
  loadBudgetsForDashboard(): void {
    this.budgetService.getBudgetsWithUsage().subscribe({
      next: (data) => {
        this.budgets = data;
      },
      error: (err) => {
        console.error('Failed to load budgets for dashboard', err);
      }
    });
  }

  // New: Load recent transactions
  loadRecentTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        // Sort by date descending and take the top 5
        this.recentTransactions = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
        //this.recentTransactions = data;
      },
      error: (err) => {
        console.error('Failed to load recent transactions', err);
      }
    });
  }

    // Helper methods for budget progress bar (copy from BudgetsListComponent)
    getProgressPercentage(budget: any): number {
        // Ensure budget.amount is not zero to prevent division by zero
        return budget.amount > 0 ? (budget.currentSpend / budget.amount) * 100 : 0;
    }

    getProgressBarClass(budget: any): string {
        const percentage = this.getProgressPercentage(budget);
        if (percentage >= 100) {
            return 'bg-danger';
        } else if (percentage >= 75) {
            return 'bg-warning';
        } else {
            return 'bg-success';
        }
    }
}
