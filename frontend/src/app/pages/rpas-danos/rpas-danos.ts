import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';


@Component({
  selector: 'app-rpas-danos', 
  standalone: true, 
  templateUrl: './rpas-danos.html', 
  styleUrls: ['./rpas-danos.css'], 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class RpasDanosComponent implements OnInit {

  reportForm!: FormGroup;
  selectedImages: any[] = [];

  constructor(
  private fb: FormBuilder, 
  private router: Router,
  private reporteService: ReporteService // Inyectar servicio
) { } 

  ngOnInit(): void {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000;
    const localDate = new Date(hoy.getTime() - offset).toISOString().split('T')[0];

    this.reportForm = this.fb.group({
      // ----------------------------------------------------
      // SECCIÓN: Información Personal y del Evento
      // ----------------------------------------------------
      reportDate: [localDate, Validators.required],
      reportNumber: ['', Validators.required],
      name: [''],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      localTime: ['', Validators.required], 
      eventDate: ['', Validators.required], 
      
      // ✅ DESCRIPCIÓN DETALLADA (Narración)
      hazardDetailDescription: ['', Validators.required], 
      consequences: ['', Validators.required],
      correctiveActionsProposal: ['', Validators.required],
      riskManagement: ['', Validators.required],

      // ----------------------------------------------------
      // NUEVA SECCIÓN: Análisis y Evaluación
      // ----------------------------------------------------
      similarFailures: [''],             // Fallas de hardware o software similares
      hasAntecedents: [''],              // Antecedentes de pérdida de enlace (C2)
      staffCount: [0],                   // Horas de vuelo del operador involucrado
      usagePercentage: [''],             // Porcentaje de daños en la estructura/batería
      passengerThreat: [''],             // Riesgo a terceras personas en superficie
      livesAtRisk: [''],                 // Gravedad del impacto potencial

      // ----------------------------------------------------
      // NUEVA SECCIÓN: Estrategias de Mitigación
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
      const formValue = this.reportForm.value;

      const payload = {
        // Datos para la tabla principal 'reportes'
        numero_reporte_manual: formValue.reportNumber,
        fecha_elaboracion: formValue.reportDate,
        tipo_reporte: 'Daños por RPAS',
        subtipo: 'Obligatorio', // Reporte mandatorio por daños estructurales

        // Datos para 'reportes_generados'
        detalles: {
          nombre_reportante: formValue.name,
          correo_reportante: formValue.email,
          lugar: formValue.location,
          hora_local: formValue.localTime,
          fecha_evento: formValue.eventDate,
          probabilidad: formValue.eventProbability,
          severidad: formValue.eventSeverity,

          // Datos técnicos específicos guardados en JSON
          detalles_completos_json: JSON.stringify({
            identificacion_rpas: {
              pista_id: formValue.pistaId,
              rwycc: formValue.rwycc
            },
            analisis_evaluacion: {
              fallas_similares: formValue.similarFailures,
              antecedentes: formValue.hasAntecedents,
              conteo_vuelos: formValue.staffCount,
              porcentaje_dano: formValue.usagePercentage,
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
              hardware_software: formValue.mitigationReviewDesign,
              mantenimiento: formValue.mitigationModOpProcedures,
              supervision: formValue.mitigationOrgChanges,
              adiestramiento: formValue.mitigationStaffTraining,
              contingencia: formValue.mitigationEmergencyPlans,
              suspension: formValue.mitigationCessation
            }
          })
        }
      };

      // Llamada al servicio para guardar en la BD de Aeronacional
      this.reporteService.guardarReporteVoluntario(payload).subscribe({
        next: (res) => {
          console.log('✅ Reporte de Daños guardado:', res);
          alert('Reporte de Daños RPAS enviado con éxito.');
          this.reportForm.reset();
          this.selectedImages = [];
        },
        error: (err) => {
          console.error('❌ Error al guardar:', err.error);
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