import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = '/api/budget'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    // Ensure token exists before setting header
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders(); // Return empty headers if no token
  }

  //getBudgets(): Observable<any[]> {
  //  return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  //}

  createBudget(budget: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, budget, { headers: this.getHeaders() });
  }

  updateBudget(id: number, budget: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, budget, { headers: this.getHeaders() });
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getBudgetsWithUsage(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

}
