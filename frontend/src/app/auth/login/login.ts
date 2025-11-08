// frontend/src/app/auth/login/login.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // <-- Importa Router
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Importa HttpClient y HttpClientModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    HttpClientModule // Necesario para HttpClient en un componente standalone
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  
  // Datos del formulario vinculados por ngModel
  loginData = {
    email: '',
    password: ''
  };
  
  errorLogin: string = '';
  
  // Endpoint de Django para obtener el token JWT
  API_LOGIN_URL = 'http://localhost:8000/api/auth/token/'; 

  // Inyectamos los servicios en el constructor
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {}

  // Función ejecutada al enviar el formulario
  onSubmit() {
    this.errorLogin = ''; // Limpia cualquier error previo

    // 1. Prepara las credenciales (Django JWT espera 'correo' y 'password')
    const credentials = {
        // Mapeamos el campo del formulario 'email' al campo de Django 'correo'
        correo: this.loginData.email, 
        password: this.loginData.password 
    };

    // 2. Petición HTTP POST a la API de Django
    this.http.post<any>(this.API_LOGIN_URL, credentials).subscribe({
      next: (response) => {
        // --- ÉXITO DEL LOGIN ---
        
        // 3. Almacenar los tokens JWT
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        // Opcional: Si el backend devuelve nombre/rol, guárdalos aquí.

        // 4. Redirigir al Dashboard
        console.log('Login exitoso. Token obtenido.');
        this.router.navigate(['/dashboard']); // <-- Redirecciona a la ruta del dashboard
      },
      error: (err) => {
        // --- FALLO DEL LOGIN ---
        console.error('Error de autenticación:', err);
        this.errorLogin = 'Correo o contraseña incorrectos. Intente de nuevo.';
      }
    });
  }
}