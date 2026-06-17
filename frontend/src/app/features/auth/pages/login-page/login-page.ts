import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthApiService } from '../../data-access/auth-api.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink],
  templateUrl: './login-page.html',
  styleUrl: '../auth-page.css'
})
export class LoginPage {
  message = signal('');
  error = signal('');

  constructor(private readonly authApi: AuthApiService) { }

  login(username: string, password: string): void {
    this.message.set('');
    this.error.set('');

    if (!username || !password) {
      this.error.set('Username and password are required');
      return;
    }

    this.authApi.login({ username, password }).subscribe({
      next: response => {
        this.message.set(response.message);
      },
      error: err => {
        this.error.set(err.error?.error || 'Login failed');
      }
    });
  }
}
