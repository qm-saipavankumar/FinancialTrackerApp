import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService


@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
  transactions: any[] = [];
  categories: any[] = [];
  newTransaction: any = { description: '', amount: 0, date: new Date(), isExpense: true, categoryId: null };
  editingTransactionId: number | null = null;

  // Original list of all transactions
  allTransactions: any[] = [];
  // The list displayed to the user after filtering/searching/sorting
  filteredTransactions: any[] = [];

  // Filtering and searching properties
  searchQuery: string = '';
  selectedCategoryId: number | null = null;
  startDate: string = '';
  endDate: string = '';

  // Sorting properties
  sortKey: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadCategories();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        // Store the original list
        this.allTransactions = data;
        // CRITICAL FIX: Call applyFilters() to populate the displayed list
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  applyFilters(): void {
    let tempTransactions = [...this.allTransactions];

    // 1. Filter by category
    if (this.selectedCategoryId !== null) {
      tempTransactions = tempTransactions.filter(t => t.categoryId === this.selectedCategoryId);
    }

    // 2. Filter by date range
    if (this.startDate) {
      const start = new Date(this.startDate);
      tempTransactions = tempTransactions.filter(t => new Date(t.date) >= start);
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      tempTransactions = tempTransactions.filter(t => new Date(t.date) <= end);
    }

    // 3. Search by description
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tempTransactions = tempTransactions.filter(t => t.description.toLowerCase().includes(query));
    }

    // 4. Sort the filtered results
    this.filteredTransactions = this.sortTransactions(tempTransactions);
  }


  // Helper method to perform the sorting
  sortTransactions(transactions: any[]): any[] {
    return transactions.sort((a, b) => {
      const aVal = a[this.sortKey];
      const bVal = b[this.sortKey];

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = aVal - bVal;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Method to toggle the sort direction
  toggleSortDirection(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  // Helper method to reset all filters
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }


  createTransaction(): void {
    this.transactionService.createTransaction(this.newTransaction).subscribe({
      next: () => {
        this.loadTransactions();
        this.newTransaction = { description: '', amount: 0, date: new Date(), isExpense: true, categoryId: null };
        this.toastr.success('Transaction created successfully!', 'Success'); // Add success notification
      },
      error: (err) => {
        console.error('Failed to create transaction', err);
      }
    });
  }

  editTransaction(transaction: any): void {
    this.editingTransactionId = transaction.id;
    this.newTransaction = { ...transaction, date: new Date(transaction.date) };
  }

  updateTransaction(): void {
    if (this.editingTransactionId) {
      this.transactionService.updateTransaction(this.editingTransactionId, this.newTransaction).subscribe({
        next: () => {
          this.loadTransactions();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Failed to update transaction', err);
        }
      });
    }
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        console.error('Failed to delete transaction', err);
      }
    });
  }

  cancelEdit(): void {
    this.editingTransactionId = null;
    this.newTransaction = { description: '', amount: 0, date: new Date(), isExpense: true, categoryId: null };
  }
}
