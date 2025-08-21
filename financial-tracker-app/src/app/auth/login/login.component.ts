import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = { email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.user).subscribe({
      next: (response) => {
        // Navigate to the dashboard or home page on successful login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid login credentials.';
        console.error(err);
      }
    });
  }

}
