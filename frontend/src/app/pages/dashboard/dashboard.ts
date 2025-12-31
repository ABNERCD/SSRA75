import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule, HttpClientModule], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  nombreUsuario: string = 'Usuario'; 
  rolUsuario: string = 'Invitado'; 
  menuAbierto: boolean = false; 
  fechaActual: Date = new Date();

  API_USUARIO_INFO = 'http://localhost:8000/api/v1/usuarios/me/'; 

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    const storedName = this.authService.getUserName();
    if(storedName) this.nombreUsuario = storedName;
    this.cargarDatosUsuario();
  }

  toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }
  cerrarMenu(): void { this.menuAbierto = false; }

  cargarDatosUsuario(): void {
    const token = localStorage.getItem('access_token');
    if (!token) { this.logout(); return; }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any>(this.API_USUARIO_INFO, { headers: headers }).subscribe({
      next: (data) => {
        this.rolUsuario = data.tipo_usuario?.nombre || 'Miembro';
        if (data.nombre) this.nombreUsuario = data.nombre;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) this.logout();
      }
    });
  }

  goToReporteVoluntario(): void {
    this.cerrarMenu();
    this.router.navigate(['/reporte-voluntario']);
  }

  goToReport(tipo: string): void {
    this.cerrarMenu();
    console.log(`Navegando a reporte: ${tipo}`);
    switch(tipo) {
      case 'rpas-avistamiento': 
      this.router.navigate(['/rpas-avistamiento'])
      break;
      case 'rpas-danos': 
        this.router.navigate(['rpas-danos'])
        break;
      case 'incapacitacion-operador': 
        this.router.navigate(['/incapacitacion-operador'])
        break;
      case 'incapacitacion-tecnico': 
        this.router.navigate(['/incapacitacion-tecnico'])
        break;
      case 'reporte-pista':
        this.router.navigate(['/reporte-pista']); 
        break;
    }
  }

  logout(): void {
    this.authService.logout(); 
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']); 
  }
}