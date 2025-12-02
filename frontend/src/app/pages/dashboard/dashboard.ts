// dashboard.component.ts (VERSIÓN CORREGIDA - STANDALONE)

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // <-- YA ESTÁ INYECTADO
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // Variables para mostrar información del usuario
  nombreUsuario: string = 'Cargando...'; 
  rolUsuario: string = 'Cargando...'; 
  
  API_USUARIO_INFO = 'http://localhost:8000/api/v1/usuarios/me/'; 

  // Inyectar los servicios necesarios
  constructor(
    private router: Router, // <-- Servicio Router ya inyectado
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    const storedName = this.authService.getUserName();
    if (storedName) {
      this.nombreUsuario = storedName;
    } else {
      this.nombreUsuario = 'Usuario';
    }
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.http.get<any>(this.API_USUARIO_INFO).subscribe({
      next: (data) => {
        this.rolUsuario = data.tipo_usuario?.nombre || 'LECTOR'; 
      },
      error: (err) => {
        console.error('No se pudieron cargar los datos del usuario:', err);
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
      }
    });
  }

  // ==========================================================
  // 🚨 FUNCIÓN AÑADIDA PARA NAVEGACIÓN PROGRAMÁTICA
  // ==========================================================
  goToReporteVoluntario(): void {
    console.log('Intentando navegación a Reporte Voluntario...');
    
    // Usamos el servicio Router para navegar a la ruta definida en app.routes.ts
    this.router.navigate(['/reporte-voluntario'])
      .then(success => {
        if (success) {
          console.log('Navegación a Reporte Voluntario exitosa.');
        } else {
          // Esto puede ocurrir si el guard redirige y el router devuelve 'false'
          console.log('Navegación bloqueada o redirigida (probablemente por el Guard).');
        }
      })
      .catch(err => {
        // Captura errores de URL o de la promesa de navegación
        console.error('Error al intentar navegar al reporte:', err);
      });
  }
  
  // ==========================================================
  
  logout(): void {
    this.authService.logout(); 
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('Sesión cerrada. Redirigiendo a login.');
    // Nota: Deberías usar ['/login'] o ['/auth/login'] según tu ruta
    this.router.navigate(['/login']); 
  }
}