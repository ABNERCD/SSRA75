import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home'; // <-- Corregido
import { LoginComponent } from './auth/login/login';   // <-- Corregido

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];