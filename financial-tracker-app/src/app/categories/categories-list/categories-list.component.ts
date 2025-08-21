import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  categories: any[] = [];
  newCategory = { name: '', color: '' };
  editingCategoryId: number | null = null;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
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

  createCategory(): void {
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.loadCategories();
        this.newCategory = { name: '', color: '' };
      },
      error: (err) => {
        console.error('Failed to create category', err);
      }
    });
  }

  editCategory(category: any): void {
    this.editingCategoryId = category.id;
    this.newCategory = { ...category };
  }

  updateCategory(): void {
    if (this.editingCategoryId) {
      this.categoryService.updateCategory(this.editingCategoryId, this.newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Failed to update category', err);
        }
      });
    }
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err) => {
        console.error('Failed to delete category', err);
      }
    });
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.newCategory = { name: '', color: '' };
  }
}
