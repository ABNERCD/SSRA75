// dashboard.component.ts (VERSION CORREGIDA - STANDALONE)

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // <-- ¡1. NUEVA IMPORTACIÓN!
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // <-- ¡2. DEBE ESTAR EN TRUE!
  imports: [CommonModule], // <-- ¡3. AÑADIR CommonModule aquí!
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // Variables para mostrar información del usuario
  nombreUsuario: string = 'Cargando...'; 
  rolUsuario: string = 'Cargando...'; // Esta variable controlará las opciones del menú
  
  // Endpoint para obtener datos seguros de la API
  API_USUARIO_INFO = 'http://localhost:8000/api/v1/usuarios/me/'; 

  // Inyectar los servicios necesarios
  constructor(
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService // Servicio de Autenticación
  ) { }

  ngOnInit(): void {
    // 1. OBTENER EL NOMBRE DEL USUARIO DEL SERVICIO (Carga rápida)
    const storedName = this.authService.getUserName();
    if (storedName) {
      this.nombreUsuario = storedName;
    } else {
        this.nombreUsuario = 'Usuario';
    }

    // 2. Cargar el resto de los datos (Rol, etc.) mediante petición HTTP
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    // NOTA: Esta petición requiere que el token JWT sea enviado (usando el Interceptor).
    this.http.get<any>(this.API_USUARIO_INFO).subscribe({
      next: (data) => {
 
        // 🛑 CAMBIO CLAVE: Leer el rol anidado desde 'tipo_usuario'
        // Asume que el backend devuelve: { tipo_usuario: { nombre: "ADMINISTRADOR" } }
        this.rolUsuario = data.tipo_usuario?.nombre || 'LECTOR'; 
 
        // Opcional: Si el nombre retornado aquí es más preciso, actualiza el valor:
        // this.nombreUsuario = data.nombre || this.nombreUsuario;
      },
      error: (err) => {
        console.error('No se pudieron cargar los datos del usuario:', err);
        // Si el token es inválido, forzamos el cierre de sesión
        if (err.status === 401 || err.status === 403) {
           this.logout();
        }
      }
    });
  }

  logout(): void {
    // Limpia el estado de la sesión en el servicio y en localStorage (currentUser)
    this.authService.logout(); 

    // Limpia los tokens JWT (access_token, refresh_token)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Redirigir al usuario a la página de login
    console.log('Sesión cerrada. Redirigiendo a login.');
    this.router.navigate(['/auth/login']);
  }
}