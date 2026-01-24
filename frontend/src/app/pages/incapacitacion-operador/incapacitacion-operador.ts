import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service'; // Inyectar el servicio

@Component({
  selector: 'app-incapacitacion-operador', 
  standalone: true, 
  templateUrl: './incapacitacion-operador.html', 
  styleUrls: ['./incapacitacion-operador.css'], 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class IncapacitacionOperadorComponent implements OnInit {

  reportForm!: FormGroup;
  selectedImages: any[] = [];

  // Inyectamos el servicio en el constructor
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private reporteService: ReporteService 
  ) { } 

  ngOnInit(): void {
    // Ajuste de fecha local para evitar errores de zona horaria
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
      
      // NOTA: Si estos no están en el HTML, quita Validators.required para que el botón se active
      pistaId: [''], 
      rwycc: [''], 

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
        // Datos para la tabla principal 'reportes'
        numero_reporte_manual: formValue.reportNumber,
        fecha_elaboracion: formValue.reportDate,
        tipo_reporte: 'Incapacitación de Operador',
        subtipo: 'Obligatorio', // Evento crítico para la seguridad aérea

        // Datos para 'reportes_generados'
        detalles: {
          nombre_reportante: formValue.name,
          correo_reportante: formValue.email,
          lugar: formValue.location,
          hora_local: formValue.localTime,
          fecha_evento: formValue.eventDate,
          probabilidad: formValue.eventProbability,
          severidad: formValue.eventSeverity,

          // Empaquetado de datos específicos en formato JSON
          detalles_completos_json: JSON.stringify({
            identificacion: {
              pista_id: formValue.pistaId,
              rwycc: formValue.rwycc
            },
            narrativa: {
              peligro: formValue.hazardDetailDescription,
              consecuencias: formValue.consequences,
              propuesta: formValue.correctiveActionsProposal,
              gestion_riesgo: formValue.riskManagement
            },
            analisis: {
              incidentes_similares: formValue.similarFailures,
              antecedentes: formValue.hasAntecedents,
              staff_involucrado: formValue.staffCount,
              afectacion_operativa: formValue.usagePercentage,
              amenaza_pasajeros: formValue.passengerThreat,
              vidas_riesgo: formValue.livesAtRisk
            },
            mitigacion: {
              revision_puesto: formValue.mitigationReviewDesign,
              fraseologia_flujos: formValue.mitigationModOpProcedures,
              monitoreo_mutuo: formValue.mitigationOrgChanges,
              manejo_fatiga: formValue.mitigationStaffTraining,
              procedimiento_relevo: formValue.mitigationEmergencyPlans,
              incapacidad_sector: formValue.mitigationCessation
            }
          })
        }
      };

      this.reporteService.guardarReporteVoluntario(payload).subscribe({
        next: (res) => {
          console.log('✅ Éxito:', res);
          alert('Reporte de Incapacitación enviado con éxito.');
          this.reportForm.reset();
          this.selectedImages = [];
        },
        error: (err) => {
          console.error('❌ Error:', err.error);
          alert('Error al enviar el reporte. Verifique la consola.');
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