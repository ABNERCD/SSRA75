// src/app/app.routes.ts

import { Routes } from '@angular/router';

// CORRECTO: Tus archivos se llaman .ts, NO .component.ts
import { HomeComponent } from './pages/home/home';           // home.ts
import { LoginComponent } from './auth/login/login';         // login.ts
import { RegistroComponent } from './pages/registro/registro'; // registro.ts // registro.component.ts

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Aeronacional SSRA75 | Escuela de Vuelo'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión | SSRA75'
  },
  {
    path: 'registro',
    component: RegistroComponent,
    title: 'Registro | SSRA75'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];