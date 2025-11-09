import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

// Importaciones cruciales para Formularios Reactivos (soluciona NG8002)
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms'; 

// -----------------------------------------------------------------------
// FUNCIÓN DE VALIDACIÓN CRUZADA: Verifica que ambas contraseñas coincidan
// -----------------------------------------------------------------------
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Obtenemos los controles 'contrasena' y 'confirmarContrasena'
  const password = control.get('contrasena');
  const confirmPassword = control.get('confirmarContrasena');

  // Si los controles no existen o los valores son nulos, no validamos
  if (!password || !confirmPassword || password.value === null || confirmPassword.value === null) {
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
    ReactiveFormsModule // <-- ¡Esta importación elimina el error NG8002!
  ],
  templateUrl: './register.html', 
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
    
  // La propiedad principal del formulario reactivo, vinculada en el HTML con [formGroup]="registroForm"
  registroForm!: FormGroup; 

  // Propiedades de estado para la plantilla (uso en *ngIf y [disabled])
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
      // Puedes añadir aquí otros campos que necesites (ej: matricula, edad, carrera)
    }, { validators: passwordMatchValidator }); // Aplica la validación de coincidencia
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    // Si la validación de Angular detecta errores
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.registroForm.markAllAsTouched(); // Muestra todos los errores en el HTML
      return;
    }
    
    this.isLoading = true;

    // Obtener los datos válidos del formulario
    const data = this.registroForm.value;
    console.log('Datos de registro listos para enviar:', data);
    
    // --- LÓGICA DE REGISTRO HTTP (POST a Django) AQUÍ ---
    
    // SIMULACIÓN DE LLAMADA HTTP
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = '¡Registro exitoso! Redirigiendo a Iniciar Sesión.';
      
      this.registroForm.reset(); 
      this.router.navigate(['/login']); 
    }, 1500);
  }
}