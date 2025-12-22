// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home'; 
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './authe/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { authGuard } from './auth/auth.guard'; 

export const routes: Routes = [
    
    // 1. RUTA RAÍZ: Redirige al inicio (Home)
    // Cuando el usuario accede a '/', lo enviamos a '/home' para comenzar.
    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    }, 
    
    // 2. RUTA HOME (INICIO) - PÚBLICA
    // 🛑 ¡CORRECCIÓN CLAVE! Ya no tiene el 'canActivate: [authGuard]'.
    { 
        path: 'home', 
        component: HomeComponent 
    },
    
    // RUTA DE LOGIN (PÚBLICA)
    { 
        path: 'login', 
        component: LoginComponent 
    },
    
    // RUTA DE REGISTRO (PÚBLICA)
    { 
        path: 'register', 
        component: RegisterComponent 
    },
    
    // RUTA DEL DASHBOARD (PROTEGIDA)
    // El 'authGuard' solo se aplica aquí para asegurar que solo usuarios autenticados pasen.
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [authGuard] 
    },
    
    // RUTA COMODÍN
    // Si la URL no coincide con ninguna ruta, redirige a 'login' (o a 'home' si lo prefieres).
    { 
        path: '**', 
        redirectTo: 'login',
        pathMatch: 'full' 
    }
];