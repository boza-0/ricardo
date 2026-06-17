import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  message = signal('');
  error = signal('');

  constructor(private http: HttpClient) { }

  register(username: string, password: string): void {
    this.message.set('');
    this.error.set('');

    if (!username || !password) {
      this.error.set('Username and password are required');
      return;
    }

    this.http.post<{ message: string }>('http://localhost:3000/register', {
      username,
      password
    }).subscribe({
      next: response => {
        this.message.set(response.message);
      },
      error: err => {
        this.error.set(err.error?.error || 'Registration failed');
      }
    });
  }
}
