import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RegisterPage } from './register-page';

describe('RegisterPage', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
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

  it('should render the registration form', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Register');
    expect(compiled.querySelector<HTMLInputElement>('input[type="text"]')).toBeTruthy();
    expect(compiled.querySelector<HTMLInputElement>('input[type="password"]')).toBeTruthy();
    expect(compiled.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent).toContain('Register');
  });

  it('should show validation errors without calling the backend', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();

    submitForm(fixture.nativeElement);
    fixture.detectChanges();

    httpTesting.expectNone('http://localhost:3000/register');
    expect(fixture.nativeElement.textContent).toContain('Username and password are required');
  });

  it('should post registration credentials when the form is submitted', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();

    fillCredentials(fixture.nativeElement, 'ricardo', 'secret1');
    submitForm(fixture.nativeElement);

    const req = httpTesting.expectOne('http://localhost:3000/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'ricardo',
      password: 'secret1',
    });

    req.flush({ message: 'User registered successfully' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('User registered successfully');
  });

  it('should show backend registration errors', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();

    fillCredentials(fixture.nativeElement, 'ricardo', 'secret1');
    submitForm(fixture.nativeElement);

    const req = httpTesting.expectOne('http://localhost:3000/register');
    req.flush(
      { error: 'Username already exists' },
      { status: 409, statusText: 'Conflict' }
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Username already exists');
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
