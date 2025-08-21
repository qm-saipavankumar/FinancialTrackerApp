import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { TransactionsListComponent } from './transactions/transactions-list/transactions-list.component';
import { BudgetsListComponent } from './budgets/budgets-list/budgets-list.component';
import { NgChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for toastr
import { ToastrModule } from 'ngx-toastr'; // Toastr for notifications


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    CategoriesListComponent,
    TransactionsListComponent,
    BudgetsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
