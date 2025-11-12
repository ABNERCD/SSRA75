import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
 selector: 'app-login',
 standalone: true,
 imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    HttpClientModule
   ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('loginForm') loginForm!: NgForm;
 
  passwordVisible: boolean = false; 
  loginData = { email: '', password: '' };
  errorLogin: string = '';

  API_LOGIN_URL = 'http://localhost:8000/api/auth/token/'; 
  // 🛑 CORREGIDO: Usamos el endpoint correcto del ViewSet de Django
  API_USER_URL = 'http://localhost:8000/api/v1/usuarios/me/'; 

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginData.email = '';
    this.loginData.password = '';
 }

  ngOnDestroy(): void {
    this.loginData.email = '';
    this.loginData.password = '';
  }

// ------------------------------------------------------------------
// LÓGICA DE NAVEGACIÓN Y CONTRASEÑA (Sin Cambios)
// ------------------------------------------------------------------

  goToRegister() {
    if (this.loginForm) { this.loginForm.resetForm(); }
    this.router.navigate(['/register']); 
  }

  togglePasswordVisibility() { this.passwordVisible = !this.passwordVisible; }

  getPasswordInputType(): string { return this.passwordVisible ? 'text' : 'password'; }

// ------------------------------------------------------------------
// LÓGICA DE AUTENTICACIÓN Y OBTENCIÓN DE DATOS (Ajustada)
// ------------------------------------------------------------------

  onSubmit() {
    this.errorLogin = ''; 
    const credentials = { correo: this.loginData.email, password: this.loginData.password };

    // 1. PETICIÓN: Obtener Token
    this.http.post<any>(this.API_LOGIN_URL, credentials).subscribe({
      next: (tokenResponse) => {
        // Guardar tokens
        const accessToken = tokenResponse.access;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', tokenResponse.refresh);
 
        console.log('Login exitoso. Token obtenido.');

        // 2. LLAMAR A LA FUNCIÓN para obtener los detalles del usuario
        this.getUserDetails(accessToken);
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.errorLogin = 'Correo o contraseña incorrectos. Intente de nuevo.';
      }
    });
  }


  /**
   * Función que usa el token para obtener el nombre del usuario (petición al endpoint /usuarios/me/).
   */
  getUserDetails(accessToken: string): void {
    // Adjuntar el token manualmente para esta petición
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}` 
    });

    // 3. PETICIÓN: Obtener Datos del Usuario (usa API_USER_URL corregida)
    this.http.get<any>(this.API_USER_URL, { headers: headers }).subscribe({
      next: (userResponse) => {
        // 🛑 AJUSTE DE CAMPO: Usar 'nombre' (si existe en UsuarioMeSerializer) o 'username'
        const userName = userResponse.nombre || userResponse.username || 'Usuario'; 
 
        // 4. GUARDAR NOMBRE Y REDIRIGIR
        this.authService.login(userName); 
 
        // Limpieza y Redirección
        this.loginData.email = '';
        this.loginData.password = '';

        console.log('Datos del usuario obtenidos exitosamente. Redirigiendo...');
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        // Si falla la obtención de datos, limpiar la sesión
        console.error('Error al obtener los datos del usuario:', err);
        this.errorLogin = 'Error de sesión. Intente de nuevo.';
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    });
  }
}