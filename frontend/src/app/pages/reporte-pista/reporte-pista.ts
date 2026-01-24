import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service'; //

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

  // Inyectamos el servicio para la conexión con el backend
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private reporteService: ReporteService 
  ) { } 

  ngOnInit(): void {
    // Ajuste de fecha local para evitar desfases de horario en México
    const hoy = new Date();
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
        // Datos para la tabla 'reportes'
        numero_reporte_manual: formValue.reportNumber,
        fecha_elaboracion: formValue.reportDate,
        tipo_reporte: 'Condiciones GRF',
        subtipo: 'Obligatorio',

        // Datos para 'reportes_generados'
        detalles: {
          nombre_reportante: formValue.name,
          correo_reportante: formValue.email,
          lugar: formValue.location,
          hora_local: formValue.localTime,
          fecha_evento: formValue.eventDate,
          probabilidad: formValue.eventProbability,
          severidad: formValue.eventSeverity,

          // Empaquetado técnico en JSON
          detalles_completos_json: JSON.stringify({
            identificacion_pista: {
              pista_id: formValue.pistaId,
              rwycc: formValue.rwycc
            },
            narrativa: {
              descripcion: formValue.hazardDetailDescription,
              consecuencias: formValue.consequences,
              propuesta: formValue.correctiveActionsProposal,
              gestion: formValue.riskManagement
            },
            analisis_riesgo: {
              condiciones_similares: formValue.similarFailures,
              antecedentes: formValue.hasAntecedents,
              inspecciones_realizadas: formValue.staffCount,
              porcentaje_contaminante: formValue.usagePercentage,
              amenaza_pasajeros: formValue.passengerThreat,
              vidas_riesgo: formValue.livesAtRisk
            },
            mitigacion: {
              diseno_drenaje: formValue.mitigationReviewDesign,
              limpieza_pista: formValue.mitigationModOpProcedures,
              turnos_inspeccion: formValue.mitigationOrgChanges,
              capacitacion_rcam: formValue.mitigationStaffTraining,
              protocolos_notam: formValue.mitigationEmergencyPlans,
              cierre_pista: formValue.mitigationCessation
            }
          })
        }
      };

      this.reporteService.guardarReporteVoluntario(payload).subscribe({
        next: (res) => {
          console.log('✅ Éxito:', res);
          alert('Reporte de Condiciones GRF enviado con éxito.');
          this.reportForm.reset();
          this.selectedImages = [];
        },
        error: (err) => {
          console.error('❌ Error:', err.error);
          alert('Error al enviar el reporte. Verifique los campos obligatorios.');
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