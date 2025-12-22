// frontend/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 

import { routes } from './app.routes';

// 🛑 CORRECCIÓN: NO SE USA LA EXTENSIÓN .TS y USAMOS EL NOMBRE DE FUNCIÓN CORRECTO
import { authTokenInterceptor } from './auth/auth-token-interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Configuración del Interceptor
    provideHttpClient(
      withInterceptors([
        // Usamos el nombre de la función exportada del archivo
        authTokenInterceptor 
      ])
    ),
  ]
};