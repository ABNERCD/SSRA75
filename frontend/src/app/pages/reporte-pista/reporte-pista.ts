// reporte-pista.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-pista', 
  standalone: true, 
  templateUrl: './reporte-pista.html', 
  styleUrls: ['./reporte-pista.css'], 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class ReportePistaComponent implements OnInit {

  reportForm!: FormGroup;
  selectedImages: any[] = [];

  constructor(private fb: FormBuilder, private router: Router) { } 

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.reportForm = this.fb.group({
      // ----------------------------------------------------
      // SECCIÓN: Información Personal y del Evento
      // ----------------------------------------------------

      reportDate: [today, Validators.required],
      reportNumber: ['', Validators.required],
      name: [''],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      localTime: ['', Validators.required], 
      eventDate: ['', Validators.required], 
      
      // CAMPOS ESPECÍFICOS DE PISTA (Insertados en la lógica del reporte)
      pistaId: ['', Validators.required],      // Identificador de pista
      rwycc: ['', Validators.required],        // Runway Condition Code

      // ✅ DESCRIPCIÓN DETALLADA (Narración)
      hazardDetailDescription: ['', Validators.required], 
      consequences: ['', Validators.required],
      correctiveActionsProposal: ['', Validators.required],
      riskManagement: ['', Validators.required],

      // ----------------------------------------------------
      // NUEVA SECCIÓN: Análisis y Evaluación (Página 2 del Doc)
      // ----------------------------------------------------
      similarFailures: [''],             // Equipo/componente con fallas similares
      hasAntecedents: [''],              // Antecedentes de sucesos similares
      staffCount: [0],                   // Miembros de mantenimiento
      usagePercentage: [''],             // Porcentaje de tiempo de uso
      passengerThreat: [''],             // Amenaza para los pasajeros
      livesAtRisk: [''],                 // Vidas que podrían peligrar

      // ----------------------------------------------------
      // NUEVA SECCIÓN: Estrategias de Mitigación (Página 3 del Doc)
      // ----------------------------------------------------
      mitigationReviewDesign: [false],
      mitigationModOpProcedures: [false],
      mitigationOrgChanges: [false],
      mitigationStaffTraining: [false],
      mitigationEmergencyPlans: [false],
      mitigationCessation: [false],

      // ----------------------------------------------------
      // SECCIÓN: Matrices de Riesgo
      // ----------------------------------------------------
      eventProbability: ['', Validators.required], 
      eventSeverity: ['', Validators.required] 
    });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard']); 
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      console.log('✅ Reporte de Pista enviado con éxito. Datos:', this.reportForm.value);
      alert('Reporte de Pista enviado. ¡Gracias por contribuir a la seguridad!');
      this.reportForm.reset();
      this.selectedImages = [];
    } else {
      console.error('❌ Formulario inválido. Revise los campos requeridos.');
      this.reportForm.markAllAsTouched();
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push({
            name: file.name,
            url: e.target.result,
            file: file
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }
}