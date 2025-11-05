import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home'; // <-- Corregido
import { LoginComponent } from './auth/login/login';   // <-- Corregido
import { RegisterComponent } from './authe/register/register';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];