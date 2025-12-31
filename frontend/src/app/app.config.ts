import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // Importamos withInterceptors

import { routes } from './app.routes';

// Importamos el interceptor funcional (asegúrate de que la ruta sea correcta)
// NOTA: No uses la extensión .ts en la ruta de importación
import { authTokenInterceptor } from './auth/auth-token-interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Configuración del Cliente HTTP con el Interceptor
    provideHttpClient(
      withFetch(), // Habilita fetch API (bueno para SSR y rendimiento)
      withInterceptors([
        authTokenInterceptor // Registramos el interceptor aquí
      ])
    )
  ]
};