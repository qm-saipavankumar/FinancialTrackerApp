import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { CategoryService } from '../../services/category.service'; // To get categories for dropdown

@Component({
  selector: 'app-budgets-list',
  templateUrl: './budgets-list.component.html',
  styleUrls: ['./budgets-list.component.css']
})
export class BudgetsListComponent implements OnInit {
  budgets: any[] = [];
  categories: any[] = []; // To populate the category dropdown
  newBudget: any = { amount: 0, categoryId: null, startDate: '', endDate: '' };
  editingBudgetId: number | null = null;

  constructor(
    private budgetService: BudgetService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadBudgets();
    this.loadCategories();
  }

  loadBudgets(): void {
    this.budgetService.getBudgetsWithUsage().subscribe({
      next: (data) => {
        this.budgets = data;
      },
      error: (err) => {
        console.error('Failed to load budgets', err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories for budget form', err);
      }
    });
  }

  createBudget(): void {
    // Ensure dates are in correct format for backend (e.g., ISO string)
    this.newBudget.startDate = new Date(this.newBudget.startDate).toISOString();
    this.newBudget.endDate = new Date(this.newBudget.endDate).toISOString();

    this.budgetService.createBudget(this.newBudget).subscribe({
      next: () => {
        this.loadBudgets();
        this.newBudget = { amount: 0, categoryId: null, startDate: '', endDate: '' };
      },
      error: (err) => {
        console.error('Failed to create budget', err);
      }
    });
  }

  editBudget(budget: any): void {
    this.editingBudgetId = budget.id;
    // Ensure dates are formatted for input type="date" (YYYY-MM-DD)
    this.newBudget = {
      ...budget,
      startDate: new Date(budget.startDate).toISOString().split('T')[0],
      endDate: new Date(budget.endDate).toISOString().split('T')[0]
    };
  }

  updateBudget(): void {
    if (this.editingBudgetId) {
      // Ensure dates are in correct format for backend (e.g., ISO string)
      this.newBudget.startDate = new Date(this.newBudget.startDate).toISOString();
      this.newBudget.endDate = new Date(this.newBudget.endDate).toISOString();

      this.budgetService.updateBudget(this.editingBudgetId, this.newBudget).subscribe({
        next: () => {
          this.loadBudgets();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Failed to update budget', err);
        }
      });
    }
  }

  deleteBudget(id: number): void {
    this.budgetService.deleteBudget(id).subscribe({
      next: () => {
        this.loadBudgets();
      },
      error: (err) => {
        console.error('Failed to delete budget', err);
      }
    });
  }

  cancelEdit(): void {
    this.editingBudgetId = null;
    this.newBudget = { amount: 0, categoryId: null, startDate: '', endDate: '' };
  }

  getProgressPercentage(budget: any): number {
    return (budget.currentSpend / budget.amount) * 100;
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
