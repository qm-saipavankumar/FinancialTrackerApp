import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category, { headers: this.getHeaders() });
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category, { headers: this.getHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
