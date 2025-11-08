// frontend/src/app/pages/dashboard/dashboard.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  
  // Variables para mostrar información del usuario
  nombreUsuario: string = 'Cargando...';
  rolUsuario: string = 'Cargando...';
  
  // Endpoint de ejemplo para obtener datos seguros de la API
  API_USUARIO_INFO = 'http://localhost:8000/api/v1/usuarios/me/'; // Necesitarás crear este endpoint en Django

  // Inyectar el Router y HttpClient
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // Aquí se cargan los datos del usuario después de que el componente se inicializa.
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    // NOTA IMPORTANTE: Esta petición FALLARÁ hasta que se implemente el Interceptor
    // ya que no incluirá el token JWT.
    this.http.get<any>(this.API_USUARIO_INFO).subscribe({
      next: (data) => {
        // Asumiendo que tu API devuelve un objeto con nombre y rol
        this.nombreUsuario = data.nombre;
        this.rolUsuario = data.rol.nombre; // Ajusta según la estructura real de tu API
      },
      error: (err) => {
        console.error('No se pudieron cargar los datos del usuario:', err);
        // Si el token es inválido o expiró, forzamos el cierre de sesión
        if (err.status === 401 || err.status === 403) {
            this.logout();
        }
      }
    });
  }

  logout(): void {
    // 1. Limpiar todos los tokens y datos de sesión del almacenamiento local
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Si guardaste el nombre o rol directamente:
    localStorage.removeItem('user_name'); 
    localStorage.removeItem('user_role'); 

    // 2. Redirigir al usuario a la página de login
    console.log('Sesión cerrada. Redirigiendo a login.');
    this.router.navigate(['/auth/login']);
  }
}