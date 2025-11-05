import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register', 
  standalone: true, 
  imports: [
    FormsModule, 
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.html', // <--- Se actualizará
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  
  // Modelo de datos actualizado con todos los campos solicitados
  registerData = {
    nombreCompleto: '', // Nuevo
    matricula: '',      // Nuevo
    edad: null as number | null, // Nuevo, inicializado como null o número
    carrera: '',        // Nuevo
    // El campo de correo electrónico no fue solicitado pero es común, lo mantendré aquí si lo necesitas
    // email: '',        
    password: '',
    confirmPassword: ''
  };

  onSubmit() {
    // 1. Validación simple de contraseñas
    if (this.registerData.password !== this.registerData.confirmPassword) {
      console.error('Error: Las contraseñas no coinciden.');
      return;
    }

    // 2. Lógica de registro
    console.log('Intentando registrar nuevo usuario con:', this.registerData);
    
    // SIMULACIÓN de respuesta del servidor:
    console.log('¡Registro simulado exitoso!');
    
    // Opcionalmente, limpiar el formulario
    this.registerData = {
        nombreCompleto: '', 
        matricula: '',
        edad: null,
        carrera: '',
        password: '',
        confirmPassword: ''
    };
  }
}