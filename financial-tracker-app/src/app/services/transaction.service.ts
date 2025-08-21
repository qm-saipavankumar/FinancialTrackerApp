import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = '/api/transactions';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getTransaction(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, transaction, { headers: this.getHeaders() });
  }

  updateTransaction(id: number, transaction: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction, { headers: this.getHeaders() });
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
