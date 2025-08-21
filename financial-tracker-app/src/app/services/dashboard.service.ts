import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DashboardSummary } from '../models/dashboard-summary.model';
import { MonthlySummary } from '../models/monthly_summary.model';
import { MonthlyFinancialSummary } from '../models/monthly_financial_summary.model'; 


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`, { headers: this.getHeaders() });
  }

  getExpensesByCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/expenses-by-category`, { headers: this.getHeaders() });
  }

  getMonthlySummary(): Observable<MonthlySummary[]> {
    return this.http.get<MonthlySummary[]>(`${this.apiUrl}/monthly-summary`, { headers: this.getHeaders() });
  }

  // New methods for current and last month summaries
  getCurrentMonthFinancialSummary(): Observable<MonthlyFinancialSummary> {
    return this.http.get<MonthlyFinancialSummary>(`${this.apiUrl}/current-month-summary`, { headers: this.getHeaders() });
  }

  getLastMonthFinancialSummary(): Observable<MonthlyFinancialSummary> {
    return this.http.get<MonthlyFinancialSummary>(`${this.apiUrl}/last-month-summary`, { headers: this.getHeaders() });
  }
}
