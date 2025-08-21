import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { email: '', password: '' };
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! You can now log in.';
        this.errorMessage = '';
        // Optional: Automatically navigate to login page
        // this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error(err);
      }
    });
  }
}
