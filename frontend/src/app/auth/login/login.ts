import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
 
  // PROPIEDAD para controlar la visibilidad de la contraseña
  passwordVisible: boolean = false; 

  // Datos del formulario vinculados por ngModel
  loginData = {
    email: '',
    password: ''
  };

  errorLogin: string = '';

  API_LOGIN_URL = 'http://localhost:8000/api/auth/token/'; 

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Limpieza inicial para evitar problemas de caché (bfcache)
    this.loginData.email = '';
   this.loginData.password = '';
 }

  ngOnDestroy(): void {
    this.loginData.email = '';
    this.loginData.password = '';
  }

// ------------------------------------------------------------------
// LÓGICA DE NAVEGACIÓN AÑADIDA (RESUELVE EL ERROR TS2339)
// ------------------------------------------------------------------

  /**
   * Función llamada por el botón "Registrarse". Navega programáticamente.
   */
  goToRegister() {
    // Limpia el formulario antes de navegar
    if (this.loginForm) {
        this.loginForm.resetForm();
    }
    this.router.navigate(['/register']); // <--- Redirige a la ruta /registro
  }

// ------------------------------------------------------------------
// LÓGICA DE MOSTRAR/OCULTAR CONTRASEÑA
// ------------------------------------------------------------------

  /**
   * Cambia el estado de la visibilidad de la contraseña.
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
 }

  /**
   * Devuelve el tipo de input ('text' o 'password') basado en el estado.
   */
  getPasswordInputType(): string {
   return this.passwordVisible ? 'text' : 'password';
  }

// ------------------------------------------------------------------
// LÓGICA DE AUTENTICACIÓN
// ------------------------------------------------------------------

  onSubmit() {
    this.errorLogin = ''; 

    const credentials = {
        correo: this.loginData.email, 
        password: this.loginData.password 
    };

    this.http.post<any>(this.API_LOGIN_URL, credentials).subscribe({
      next: (response) => {
        // ÉXITO DEL LOGIN
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        // Limpieza del formulario
        this.loginData.email = '';
        this.loginData.password = ''; 

        console.log('Login exitoso. Token obtenido.');
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        // MANEJO DE ERRORES (400, 401, etc.)
        console.error('Error de autenticación:', err);
        this.errorLogin = 'Correo o contraseña incorrectos. Intente de nuevo.';
      }
    });
  }
}