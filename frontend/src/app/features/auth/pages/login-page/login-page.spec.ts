import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should render the login form', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Login');
    expect(compiled.querySelector<HTMLInputElement>('input[type="text"]')).toBeTruthy();
    expect(compiled.querySelector<HTMLInputElement>('input[type="password"]')).toBeTruthy();
    expect(compiled.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent).toContain('Login');
  });

  it('should show validation errors without calling the backend', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();

    submitForm(fixture.nativeElement);
    fixture.detectChanges();

    httpTesting.expectNone('http://localhost:3000/login');
    expect(fixture.nativeElement.textContent).toContain('Username and password are required');
  });

  it('should post login credentials when the form is submitted', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();

    fillCredentials(fixture.nativeElement, 'ricardo', 'secret1');
    submitForm(fixture.nativeElement);

    const req = httpTesting.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'ricardo',
      password: 'secret1',
    });

    req.flush({
      message: 'Login successful',
      user: {
        id: 1,
        username: 'ricardo',
      },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Login successful');
  });

  it('should show backend login errors', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();

    fillCredentials(fixture.nativeElement, 'ricardo', 'wrong-password');
    submitForm(fixture.nativeElement);

    const req = httpTesting.expectOne('http://localhost:3000/login');
    req.flush(
      { error: 'Invalid username or password' },
      { status: 401, statusText: 'Unauthorized' }
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Invalid username or password');
  });
});

function fillCredentials(element: HTMLElement, username: string, password: string): void {
  const usernameInput = element.querySelector<HTMLInputElement>('input[type="text"]');
  const passwordInput = element.querySelector<HTMLInputElement>('input[type="password"]');

  expect(usernameInput).toBeTruthy();
  expect(passwordInput).toBeTruthy();

  usernameInput!.value = username;
  passwordInput!.value = password;
}

function submitForm(element: HTMLElement): void {
  const form = element.querySelector<HTMLFormElement>('form');

  expect(form).toBeTruthy();

  form!.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}
