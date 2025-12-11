import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  // 1. Obtener el token de acceso del almacenamiento local
  // Es buena práctica verificar si 'localStorage' está definido (para evitar errores en entornos no-navegador)
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;

  // Lista de rutas que NO necesitan token (opcional, pero recomendado)
  // Si tu backend maneja esto ignorando el token, puedes omitir este bloque.
  // const publicUrls = ['/api/v1/login/', '/api/v1/registro/'];
  // if (publicUrls.some(url => req.url.includes(url))) {
  //   return next(req);
  // }

  // 2. Si el token existe, clonar la petición y añadir la cabecera 'Authorization'
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Enviamos la petición modificada
    return next(cloned);
  }

  // 3. Si no hay token, continuar con la petición original
  return next(req);
};