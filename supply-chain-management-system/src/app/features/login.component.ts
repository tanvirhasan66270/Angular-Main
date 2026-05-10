import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/ims.models';
import { MockDbService } from '../services/mock-db.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      <!-- Left side: Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white border-r border-slate-200">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          
          <div class="flex flex-col items-start mb-8">
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <mat-icon class="text-emerald-600">all_inclusive</mat-icon>
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
              {{ isForgotPassword() ? 'Reset password' : isRegister() ? 'Create an account' : 'Welcome back' }}
            </h2>
            <p class="mt-2 text-sm text-slate-500">
              {{ isForgotPassword() ? 'Enter your email to receive a password reset link.' : isRegister() ? 'Fill in the details to get started with IMS.' : 'Please enter your credentials to access the system.' }}
            </p>
          </div>

          <div class="mt-8">
            <!-- Tabs -->
            @if (!isForgotPassword()) {
              <div class="flex p-1 bg-slate-100 rounded-lg mb-6">
                <button (click)="isRegister.set(false)" [class.bg-white]="!isRegister()" [class.shadow]="!isRegister()" [class.text-slate-900]="!isRegister()" class="flex-1 text-sm font-medium text-slate-500 py-2 rounded-md transition-all outline-none">Log In</button>
                <button (click)="isRegister.set(true)" [class.bg-white]="isRegister()" [class.shadow]="isRegister()" [class.text-slate-900]="isRegister()" class="flex-1 text-sm font-medium text-slate-500 py-2 rounded-md transition-all outline-none">Register</button>
              </div>
            }

            @if (isForgotPassword()) {
              <form [formGroup]="forgotPasswordForm" (ngSubmit)="onForgotPassword()" class="space-y-5">
                @if (forgotPasswordMsg()) {
                   <div [class.bg-emerald-50]="forgotPasswordSuccess()" [class.text-emerald-700]="forgotPasswordSuccess()" [class.border-emerald-200]="forgotPasswordSuccess()"
                        [class.bg-red-50]="!forgotPasswordSuccess()" [class.text-red-600]="!forgotPasswordSuccess()" [class.border-red-200]="!forgotPasswordSuccess()"
                        class="border px-4 py-3 rounded-xl text-sm flex items-center">
                     <mat-icon class="mr-2 text-[20px]">{{ forgotPasswordSuccess() ? 'check_circle' : 'error_outline' }}</mat-icon>
                     {{ forgotPasswordMsg() }}
                   </div>
                }

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Email address <span class="text-red-500">*</span></label>
                  <input type="email" formControlName="email" class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all" placeholder="name@company.com">
                </div>

                @if (confirmResetStep()) {
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Confirm Password to proceed <span class="text-red-500">*</span></label>
                    <input type="password" formControlName="password" class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all" placeholder="••••••••">
                    <p class="text-xs text-slate-500 mt-1">Please re-enter your password to confirm this action.</p>
                  </div>
                }

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <a (click)="resetForgotPasswordState()" class="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer">
                      <mat-icon class="mr-1 text-[16px]">arrow_back</mat-icon> Back to login
                    </a>
                  </div>
                </div>

                <button type="submit" [disabled]="!forgotPasswordForm.get('email')?.valid || (confirmResetStep() && forgotPasswordForm.invalid)" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {{ confirmResetStep() ? 'Confirm & Send Link' : 'Continue' }}
                </button>
              </form>
            } @else if (!isRegister()) {
              <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-5">
                @if (loginError()) {
                  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                    <mat-icon class="mr-2 text-[20px]">error_outline</mat-icon>
                    {{ loginError() }}
                  </div>
                }
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Email <span class="text-red-500">*</span></label>
                  <input type="email" formControlName="email" class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all" placeholder="name@company.com">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Password <span class="text-red-500">*</span></label>
                  <input type="password" formControlName="password" class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all" placeholder="••••••••">
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input id="remember-me" type="checkbox" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer">
                    <label for="remember-me" class="ml-2 block text-sm text-slate-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <div class="text-sm">
                    <a (click)="isForgotPassword.set(true)" class="font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button type="submit" [disabled]="loginForm.invalid" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  Sign In
                </button>
              </form>
            } @else {
              <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-4">
                @if (registerError()) {
                  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                    <mat-icon class="mr-2 text-[20px]">error_outline</mat-icon>
                    {{ registerError() }}
                  </div>
                }

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Full Name <span class="text-red-500">*</span></label>
                  <input type="text" formControlName="name" class="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Email <span class="text-red-500">*</span></label>
                  <input type="email" formControlName="email" class="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Password <span class="text-red-500">*</span></label>
                  <input type="password" formControlName="password" class="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Select Role <span class="text-red-500">*</span></label>
                  <select formControlName="role" class="block w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all bg-white">
                    @for (role of availableRoles; track role) {
                       <option [value]="role">{{ role.replace('_', ' ') }}</option>
                    }
                  </select>
                </div>

                <button type="submit" [disabled]="registerForm.invalid" class="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  Create Account
                </button>
              </form>
            }
          </div>
        </div>
      </div>

      <!-- Right side: Content / Hints -->
      <div class="hidden lg:flex flex-1 flex-col justify-center items-center p-8 bg-slate-50 relative overflow-hidden">
        <!-- Abstract Decoration -->
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div class="absolute top-40 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div class="relative z-10 max-w-lg w-full bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-3xl shadow-2xl">
          <h3 class="text-xl font-bold text-slate-800 mb-2 flex items-center">
            <mat-icon class="mr-2 text-emerald-600">info</mat-icon> Demo Credentials
          </h3>
          <p class="text-sm text-slate-500 mb-6">Use these credentials to test different roles. The password is <strong>password123</strong> for all demo accounts.</p>
          
          <div class="space-y-3">
            @for (demo of demoAccounts; track demo.email) {
              <div (click)="applyDemo(demo.email)" class="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all bg-white">
                <div class="flex items-center space-x-3">
                   <div class="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                     <mat-icon class="text-[20px]">{{ demo.icon }}</mat-icon>
                   </div>
                   <div>
                     <p class="text-sm font-bold text-slate-800">{{ demo.name }}</p>
                     <p class="text-xs text-slate-500 font-mono mt-0.5">{{ demo.email }}</p>
                   </div>
                </div>
                <div class="flex items-center text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="text-xs font-semibold mr-1">Use</span>
                  <mat-icon class="text-[16px]">arrow_forward</mat-icon>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  db = inject(MockDbService);
  fb = inject(FormBuilder);

  isRegister = signal(false);
  isForgotPassword = signal(false);
  confirmResetStep = signal(false);
  loginError = signal('');
  registerError = signal('');
  forgotPasswordMsg = signal('');
  forgotPasswordSuccess = signal(false);

  availableRoles = Object.values(UserRole);

  demoAccounts = [
    { email: 'admin@ims.com', name: 'System Admin', icon: 'admin_panel_settings' },
    { email: 'manager@ims.com', name: 'SCM Manager', icon: 'dashboard' },
    { email: 'procurement@ims.com', name: 'Procurement', icon: 'shopping_cart' },
    { email: 'store@ims.com', name: 'Inventory Manager', icon: 'inventory_2' },
    { email: 'commercial@ims.com', name: 'Accounts Officer', icon: 'account_balance' },
    { email: 'driver@ims.com', name: 'Driver', icon: 'directions_car' },
    { email: 'hasan@customer.com', name: 'Customer', icon: 'person' },
  ];

  loginForm = this.fb.group({
    email: ['manager@ims.com', [Validators.required, Validators.email]],
    password: ['password123', Validators.required]
  });

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: [UserRole.CUSTOMER, Validators.required]
  });

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  applyDemo(email: string) {
    this.isRegister.set(false);
    this.isForgotPassword.set(false);
    this.resetForgotPasswordState();
    this.loginForm.patchValue({ email, password: 'password123' });
    this.loginError.set('');
  }

  resetForgotPasswordState() {
    this.isForgotPassword.set(false);
    this.confirmResetStep.set(false);
    this.forgotPasswordMsg.set('');
    this.forgotPasswordForm.reset();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = this.auth.loginWithCredentials(email!, password!);
      if (!success) {
        this.loginError.set('Invalid email or password.');
      } else {
        this.loginError.set('');
      }
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.value;
      const success = this.auth.register(name!, email!, password!, role as UserRole);
      if (!success) {
        this.registerError.set('Email already in use.');
      } else {
        this.registerError.set('');
      }
    }
  }

  onForgotPassword() {
    if (!this.confirmResetStep()) {
      if (this.forgotPasswordForm.get('email')?.valid) {
        this.confirmResetStep.set(true);
      }
      return;
    }

    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      const success = this.auth.forgotPassword(email!);
      this.forgotPasswordMsg.set(success ? 'A password reset link has been sent to your email.' : 'No account found with this email.');
      this.forgotPasswordSuccess.set(success);
      this.confirmResetStep.set(false);
      this.forgotPasswordForm.get('password')?.reset();
    }
  }
}
