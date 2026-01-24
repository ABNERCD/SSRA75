import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service'; // Inyectar servicio

@Component({
  selector: 'app-incapacitacion-tecnico', 
  standalone: true, 
  templateUrl: './incapacitacion-tecnico.html', 
  styleUrls: ['./incapacitacion-tecnico.css'], 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class IncapacitacionTecnicoComponent implements OnInit {

  reportForm!: FormGroup;
  selectedImages: any[] = [];

  // Inyectamos el servicio para la base de datos de Aeronacional
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private reporteService: ReporteService 
  ) { } 

  ngOnInit(): void {
    // Ajuste de fecha local para evitar errores de registro nocturno
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
      
      // NOTA: Si estos no existen como inputs en tu HTML, quita Validators.required
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
        tipo_reporte: 'Incapacitación Técnico',
        subtipo: 'Obligatorio', // Reporte mandatorio por seguridad técnica

        // Datos para la tabla 'reportes_generados'
        detalles: {
          nombre_reportante: formValue.name,
          correo_reportante: formValue.email,
          lugar: formValue.location,
          hora_local: formValue.localTime,
          fecha_evento: formValue.eventDate,
          probabilidad: formValue.eventProbability,
          severidad: formValue.eventSeverity,

          // Empaquetado de datos técnicos en JSON
          detalles_completos_json: JSON.stringify({
            identificacion_tecnica: {
              pista_o_id: formValue.pistaId,
              condicion: formValue.rwycc
            },
            analisis: {
              fallas_similares: formValue.similarFailures,
              antecedentes: formValue.hasAntecedents,
              miembros_mantenimiento: formValue.staffCount,
              porcentaje_uso: formValue.usagePercentage,
              amenaza_pasajeros: formValue.passengerThreat,
              vidas_riesgo: formValue.livesAtRisk
            },
            narrativa: {
              descripcion: formValue.hazardDetailDescription,
              consecuencias: formValue.consequences,
              propuesta: formValue.correctiveActionsProposal,
              gestion: formValue.riskManagement
            },
            mitigacion: {
              reingenieria: formValue.mitigationReviewDesign,
              manuales_operativos: formValue.mitigationModOpProcedures,
              redistribucion_carga: formValue.mitigationOrgChanges,
              adiestramiento: formValue.mitigationStaffTraining,
              protocolos_averia: formValue.mitigationEmergencyPlans,
              interrupcion_actividad: formValue.mitigationCessation
            }
          })
        }
      };

      // Guardado en la base de datos PostgreSQL
      this.reporteService.guardarReporteVoluntario(payload).subscribe({
        next: (res) => {
          console.log('✅ Éxito:', res);
          alert('Reporte de Incapacitación Técnico enviado con éxito.');
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