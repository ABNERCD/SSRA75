// frontend/src/app/auth/token-interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

// Exportar la función interceptora
export const tokenInterceptorFn: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('access_token');
  
  if (accessToken) {
    // Clonar la solicitud y adjuntar el encabezado Authorization
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return next(cloned);
  }
  
  // Si no hay token, pasar la solicitud original
  return next(req);
};