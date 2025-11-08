// frontend/src/app/auth/auth.guard.ts (El archivo que creaste)

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// 🚨 La función debe ser exportada con el nombre que importas 🚨
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verifica el token
  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    // Token existe, permitir acceso
    return true; 
  } else {
    // No hay token, redirigir al login
    return router.createUrlTree(['/login']); 
  }
};
// Nota: 'authGuard' es el nombre que se usa en el import y en canActivate