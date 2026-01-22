// voluntary-report.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service'; //

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
  selectedImages: any[] = [];

  // Inyectamos el servicio en el constructor
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private reporteService: ReporteService 
  ) { } 

  ngOnInit(): void {
    // Obtenemos la fecha actual
  const hoy = new Date();
  
  // Ajustamos la fecha restando el desfase de la zona horaria (en minutos)
  // Esto asegura que 'hoy' refleje la hora de México para el string final
  const offset = hoy.getTimezoneOffset() * 60000;
  const localDate = new Date(hoy.getTime() - offset).toISOString().split('T')[0];
    this.reportForm = this.fb.group({
      reportDate: [localDate, Validators.required],
      reportNumber: ['', Validators.required],
      name: [''],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      localTime: ['', Validators.required], 
      eventDate: ['', Validators.required], 
      hazardDetailDescription: ['', Validators.required], 
      consequences: ['', Validators.required],
      correctiveActionsProposal: ['', Validators.required],
      riskManagement: ['', Validators.required],
      similarFailures: [''],
      hasAntecedents: [''],
      staffCount: [0],
      usagePercentage: [''],
      passengerThreat: [''],
      livesAtRisk: [''],
      mitigationReviewDesign: [false],
      mitigationModOpProcedures: [false],
      mitigationOrgChanges: [false],
      mitigationStaffTraining: [false],
      mitigationEmergencyPlans: [false],
      mitigationCessation: [false],
      eventProbability: ['', Validators.required], 
      eventSeverity: ['', Validators.required] 
    });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard']); 
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      const formValue = this.reportForm.value;

      const payload = {
        numero_reporte_manual: formValue.reportNumber,
        fecha_elaboracion: formValue.reportDate,
        tipo_reporte: 'Voluntario',
        subtipo: 'Voluntario',

        detalles: {
          nombre_reportante: formValue.name,
          correo_reportante: formValue.email,
          lugar: formValue.location,
          hora_local: formValue.localTime, // Mapeo correcto para Postgres
          fecha_evento: formValue.eventDate,
          probabilidad: formValue.eventProbability,
          severidad: formValue.eventSeverity,
          
          detalles_completos_json: JSON.stringify({
            descripcion_peligro: formValue.hazardDetailDescription,
            consecuencias: formValue.consequences,
            propuesta_acciones: formValue.correctiveActionsProposal,
            gestion_riesgo: formValue.riskManagement,
            analisis: {
              fallas_similares: formValue.similarFailures,
              antecedentes: formValue.hasAntecedents,
              personal_mantenimiento: formValue.staffCount,
              porcentaje_uso: formValue.usagePercentage,
              amenaza_pasajeros: formValue.passengerThreat,
              vidas_riesgo: formValue.livesAtRisk
            },
            mitigacion: {
              revisar_diseno: formValue.mitigationReviewDesign,
              modificar_procedimientos: formValue.mitigationModOpProcedures,
              cambios_organizacion: formValue.mitigationOrgChanges,
              entrenamiento: formValue.mitigationStaffTraining,
              planes_emergencia: formValue.mitigationEmergencyPlans,
              cese_operaciones: formValue.mitigationCessation
            }
          })
        }
      };

      this.reporteService.guardarReporteVoluntario(payload).subscribe({
        next: (res) => {
          console.log('✅ Reporte guardado:', res);
          alert('Reporte Voluntario enviado con éxito.');
          this.reportForm.reset();
          this.selectedImages = [];
        },
        error: (err) => {
          console.error('❌ Error del servidor:', err.error);
          alert('Error al enviar. Revise los datos e intente de nuevo.');
        }
      });

    } else {
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