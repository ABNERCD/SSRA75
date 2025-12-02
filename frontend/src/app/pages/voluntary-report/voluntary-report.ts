// voluntary-report.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 👈 IMPORTACIÓN NECESARIA PARA EL BOTÓN REGRESAR

@Component({
  selector: 'app-voluntary-report', 
  standalone: true, 
  templateUrl: './voluntary-report.html', 
  styleUrls: ['./voluntary-report.css'], 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class VoluntaryReportComponent implements OnInit {

  reportForm!: FormGroup;

  // 👈 INYECTAR EL ROUTER
  constructor(private fb: FormBuilder, private router: Router) { } 

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      // ----------------------------------------------------
      // SECCIÓN: Información Personal y del Evento
      // ----------------------------------------------------
      name: [''],
      email: ['', [Validators.email]],
      
      // ❌ ELIMINADO: Se elimina 'hazardDescription' para consolidar la descripción
      
      // ✅ CAMPOS REQUERIDOS PARA LA "DESCRIPCIÓN GENERAL DEL PELIGRO"
      location: ['', Validators.required],
      localTime: ['', Validators.required], 
      eventDate: ['', Validators.required], 
      
      // ✅ DESCRIPCIÓN DETALLADA (Narración)
      hazardDetailDescription: ['', Validators.required], 
      consequences: ['', Validators.required],
      
      correctiveActionsProposal: ['', Validators.required],
      riskManagement: ['', Validators.required],

      // ----------------------------------------------------
      // SECCIÓN: Matrices de Riesgo
      // ----------------------------------------------------
      eventProbability: ['', Validators.required], 
      eventSeverity: ['', Validators.required] 
    });
  }

  // 👈 FUNCIÓN PARA EL BOTÓN "REGRESAR AL DASHBOARD"
  onGoBack(): void {
    // Navega a la ruta principal de tu dashboard
    this.router.navigate(['/dashboard']); 
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      console.log('✅ Formulario enviado con éxito. Datos:', this.reportForm.value);
      
      // ⚠️ AQUÍ DEBE IR LA LLAMADA A TU SERVICIO PARA ENVIAR AL BACKEND
      
      alert('Reporte Voluntario enviado. ¡Gracias por contribuir a la seguridad!');
      this.reportForm.reset();
    } else {
      console.error('❌ Formulario inválido. Revise los campos requeridos.');
      this.reportForm.markAllAsTouched();
    }
  }
}