import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthApiService } from '../../data-access/auth-api.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink],
  templateUrl: './register-page.html',
  styleUrl: '../auth-page.css'
})
export class RegisterPage {
  message = signal('');
  error = signal('');

  constructor(private readonly authApi: AuthApiService) { }

  register(username: string, password: string): void {
    this.message.set('');
    this.error.set('');

    if (!username || !password) {
      this.error.set('Username and password are required');
      return;
    }

    this.authApi.register({ username, password }).subscribe({
      next: response => {
        this.message.set(response.message);
      },
      error: err => {
        this.error.set(err.error?.error || 'Registration failed');
      }
    });
  }
}
