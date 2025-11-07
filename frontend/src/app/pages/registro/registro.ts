import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
      id_tipo: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const contrasena = form.get('contrasena');
    const confirmar = form.get('confirmarContrasena');
    
    if (contrasena && confirmar && contrasena.value !== confirmar.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        nombre: this.registroForm.value.nombre,
        correo: this.registroForm.value.correo,
        contrasena: this.registroForm.value.contrasena,
        id_tipo: parseInt(this.registroForm.value.id_tipo),
        id_rol: 2 // Rol por defecto: usuario normal (ajusta según tu lógica)
      };

      this.http.post(`${this.apiUrl}/usuarios/registro`, formData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Registro exitoso. Redirigiendo al login...';
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en el registro:', error);
          
          if (error.status === 409) {
            this.errorMessage = 'El correo electrónico ya está registrado';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error al registrar usuario. Intenta nuevamente.';
          }
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.registroForm.controls).forEach(key => {
        this.registroForm.get(key)?.markAsTouched();
      });
    }
  }
}