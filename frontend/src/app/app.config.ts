// frontend/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// Asegúrate de que tu versión de Angular soporta withInterceptors. 
// Es estándar a partir de la v15.2
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 

import { routes } from './app.routes';
// 1. Importar la función con el nombre de archivo correcto (con guion)
// 2. Importar la función exportada: { tokenInterceptorFn }
import { tokenInterceptorFn } from './auth/token-interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Configuración del Interceptor
    provideHttpClient(
      withInterceptors([
        tokenInterceptorFn // <--- Usamos el nombre de la función importada
      ])
    ),
  ]
};