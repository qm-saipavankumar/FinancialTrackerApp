import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { AuthGuard } from './auth/auth.guard';
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { TransactionsListComponent } from './transactions/transactions-list/transactions-list.component';
import { BudgetsListComponent } from './budgets/budgets-list/budgets-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesListComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsListComponent, canActivate: [AuthGuard] },
  { path: 'budgets', component: BudgetsListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
