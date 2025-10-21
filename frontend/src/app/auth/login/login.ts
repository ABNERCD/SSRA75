import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // <-- Declara que es standalone
  imports: [
    FormsModule,  // <-- Añade FormsModule a los imports
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  
  loginData = {
    email: '',
    password: ''
  };

  onSubmit() {
    console.log('Intentando iniciar sesión con:', this.loginData);
  }
}