// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home'; 
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './authe/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard'; // ¡Asegúrate de importar el Dashboard!
import { authGuard } from './auth/auth.guard'; // Importa tu guardia funcional

export const routes: Routes = [
    // RUTA DE LOGIN
    { 
        path: 'login', 
        component: LoginComponent 
    },
    
    // RUTA DE REGISTRO
    { 
        path: 'register', 
        component: RegisterComponent 
    },
    
    // RUTA DEL DASHBOARD (PROTEGIDA)
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [authGuard] 
    },

    // RUTA RAÍZ O INICIO (Si el usuario va a '/', el guarda lo evalúa)
    { 
        path: '', 
        component: HomeComponent,
        canActivate: [authGuard] // 👈 Aplicamos el guarda aquí
        // Nota: Dentro del authGuard, debes implementar la lógica para
        // redirigir a '/dashboard' si hay un token válido.
    },
    
    // RUTA COMODÍN (redirige al login por defecto o a donde quieras)
    { 
        path: '**', 
        redirectTo: 'login', // Redirige a la página de login si la URL no existe
        pathMatch: 'full' 
    }
];