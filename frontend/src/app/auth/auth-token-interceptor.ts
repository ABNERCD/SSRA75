import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token de acceso del almacenamiento local
  const accessToken = localStorage.getItem('access_token');

  // 2. Si el token existe, clonar la petición y añadir la cabecera 'Authorization'
  if (accessToken) {
    // Clonamos la petición para modificar sus cabeceras
    const cloned = req.clone({
      setHeaders: {
        // Formato estándar para JWT: Bearer <token>
        Authorization: `Bearer ${accessToken}`
      }
    });
    // Enviamos la petición modificada
    return next(cloned);
  }

  // 3. Si no hay token (ej. estamos en la página de login), continuar con la petición original
  return next(req);
};