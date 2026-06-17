import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  message = '';
  error = '';

  constructor(private http: HttpClient) { }

  register(username: string, password: string): void {
    this.message = '';
    this.error = '';

    if (!username || !password) {
      this.error = 'Username and password are required';
      return;
    }

    this.http.post<{ message: string }>('http://localhost:3000/register', {
      username,
      password
    }).subscribe({
      next: response => {
        this.message = response.message;
      },
      error: err => {
        this.error = err.error?.error || 'Registration failed';
      }
    });
  }
}
