// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home'; 
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './authe/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { authGuard } from './auth/auth.guard'; 

// 1. IMPORTAR EL COMPONENTE DE REPORTE VOLUNTARIO
import { VoluntaryReportComponent } from './pages/voluntary-report/voluntary-report'; 
import { ReportePistaComponent } from './pages/reporte-pista/reporte-pista';
// Asegúrate de que esta ruta de importación sea correcta (ajústala si es necesario).

export const routes: Routes = [
    
    // 1. RUTA RAÍZ: Redirige al inicio (Home)
    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    }, 
    
    // 2. RUTA HOME (INICIO) - PÚBLICA
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
    
    // ----------------------------------------------------
    // RUTAS PROTEGIDAS (Requieren inicio de sesión)
    // ----------------------------------------------------
    
    // RUTA DEL DASHBOARD (PROTEGIDA)
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [authGuard] 
    },
    
    // 3. NUEVA RUTA: REPORTE VOLUNTARIO (PROTEGIDA)
    { 
        path: 'reporte-voluntario', 
        component: VoluntaryReportComponent,
        canActivate: [authGuard] // Protege con el mismo guardia que el dashboard
    },

    {
        path: 'reporte-pista',
        component: ReportePistaComponent,
        canActivate: [authGuard]
    },

    // RUTA COMODÍN
    { 
        path: '**', 
        redirectTo: 'login',
        pathMatch: 'full' 
    }
];