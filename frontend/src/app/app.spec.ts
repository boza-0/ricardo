import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

describe('App', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the registration form', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Register');
    expect(compiled.querySelector('button')?.textContent).toContain('Register');
  });

  it('should post registration when the register button is clicked', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const usernameInput = compiled.querySelector<HTMLInputElement>('input[type="text"]');
    const passwordInput = compiled.querySelector<HTMLInputElement>('input[type="password"]');
    const registerButton = compiled.querySelector<HTMLButtonElement>('button[type="button"]');

    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(registerButton).toBeTruthy();

    usernameInput!.value = 'ricardo';
    passwordInput!.value = 'secret1';
    registerButton!.click();

    const req = httpTesting.expectOne('http://localhost:3000/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'ricardo',
      password: 'secret1',
    });

    req.flush({ message: 'User registered successfully' });
    fixture.detectChanges();

    expect(compiled.textContent).toContain('User registered successfully');
  });

  it('should show validation errors without calling the backend', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('button[type="button"]')!.click();
    fixture.detectChanges();

    httpTesting.expectNone('http://localhost:3000/register');
    expect(compiled.textContent).toContain('Username and password are required');
  });
});
