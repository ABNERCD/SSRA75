import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

// Importaciones cruciales para Formularios Reactivos
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms'; 

// -----------------------------------------------------------------------
// FUNCIÓN DE VALIDACIÓN CRUZADA: Verifica que ambas contraseñas coincidan
// -----------------------------------------------------------------------
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Obtenemos los controles 'contrasena' y 'confirmarContrasena'
  const password = control.get('contrasena');
  const confirmPassword = control.get('confirmarContrasena');

  // Si los controles no existen o los valores son nulos, no validamos aún
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }
  
  // Retornamos el error 'passwordMismatch' si no coinciden
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

// -----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------
@Component({
  selector: 'app-register', 
  standalone: true, 
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule,
    ReactiveFormsModule // <-- ¡Crucial para que funcionen los formularios!
  ],
  templateUrl: './register.html', 
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
    
  // La propiedad principal del formulario reactivo
  registroForm!: FormGroup; 

  // Propiedades de estado para la plantilla
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
    
  constructor(
    private fb: FormBuilder, // Inyectamos FormBuilder para crear el formulario
    private http: HttpClient,
    private router: Router
  ) { } 

  ngOnInit(): void { 
    // Definición de la estructura del formulario y sus validadores
    this.registroForm = this.fb.group({
      // Los nombres DEBEN coincidir con los formControlName de tu HTML
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
      id_tipo: ['', Validators.required],
    }, { validators: passwordMatchValidator }); // Aplica la validación de coincidencia
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    // 1. Si la validación de Angular detecta errores locales
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.registroForm.markAllAsTouched(); // Muestra todos los errores en el HTML (bordes rojos)
      return;
    }
    
    this.isLoading = true;

    // 2. Preparar los datos para el Backend
    // Django espera 'password' en lugar de 'contrasena'
    // Django espera 'id_tipo' como número entero
    const formData = {
        nombre: this.registroForm.value.nombre,
        correo: this.registroForm.value.correo,
        password: this.registroForm.value.contrasena,
        id_tipo: parseInt(this.registroForm.value.id_tipo) // Convertir a número
    };

    console.log('Enviando datos al backend:', formData);
    
    // 3. Petición HTTP POST al Backend (Django)
    this.http.post('http://127.0.0.1:8000/api/v1/registro/', formData).subscribe({
        next: (response) => {
            // ÉXITO
            this.isLoading = false;
            this.successMessage = '¡Registro exitoso! Redirigiendo a Iniciar Sesión...';
            
            // Esperamos 2 segundos para que el usuario lea el mensaje y redirigimos
            setTimeout(() => {
                this.router.navigate(['/login']); 
            }, 2000);
        },
        error: (error) => {
            // ERROR
            this.isLoading = false;
            console.error('Error en el registro:', error);

            // Manejo de errores específicos del backend
            if (error.error && error.error.correo) {
                this.errorMessage = 'Este correo electrónico ya está registrado.';
            } else if (error.error && error.error.detail) {
                this.errorMessage = error.error.detail;
            } else {
                this.errorMessage = 'Ocurrió un error al registrar. Verifica tu conexión o intenta más tarde.';
            }
        }
    });
  }
}