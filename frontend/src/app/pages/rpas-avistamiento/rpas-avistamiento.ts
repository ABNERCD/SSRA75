import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';


@Component({
  selector: 'app-rpas-avistamiento', 
  standalone: true, 
  templateUrl: './rpas-avistamiento.html', 
  styleUrls: ['./rpas-avistamiento.css'], 
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})

export class RpasAvistamientoComponent implements OnInit {

  reportForm!: FormGroup;
  selectedImages: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private reporteService: ReporteService 
  ) { }

  ngOnInit(): void {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000;
    const localDate = new Date(hoy.getTime() - offset).toISOString().split('T')[0];

    this.reportForm = this.fb.group({
      // 1. Información General (Estos sí están en tu HTML)
      reportDate: [localDate, Validators.required],
      reportNumber: ['', Validators.required],
      name: [''],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      localTime: ['', Validators.required], 
      eventDate: ['', Validators.required], 

      // 2. Detalles del Dron (CAMBIO: Quitamos Validators.required porque no están en tu HTML)
      droneType: [''],
      estimatedAltitude: [''],
      estimatedDistance: [''],
      direction: [''],
      droneColor: [''],

      // 3. Descripción Operacional (Estos sí están en tu HTML)
      hazardDetailDescription: ['', Validators.required],
      consequences: ['', Validators.required],
      correctiveActionsProposal: ['', Validators.required],
      riskManagement: ['', Validators.required],

      // 4. Análisis y Evaluación
      similarFailures: [''],
      hasAntecedents: [''],
      staffCount: [0],
      usagePercentage: [''],
      passengerThreat: [''],
      livesAtRisk: [''],

      // 5. Estrategias de Mitigación
      mitigationReviewDesign: [false],
      mitigationModOpProcedures: [false],
      mitigationOrgChanges: [false],
      mitigationStaffTraining: [false],
      mitigationEmergencyPlans: [false],
      mitigationCessation: [false],

      // 6. Matriz de Riesgo (Estos sí están en tu HTML)
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
        tipo_reporte: 'Avistamiento RPAS', // Identificador en la BD
        subtipo: 'Obligatorio',

        detalles: {
          nombre_reportante: formValue.name,
          correo_reportante: formValue.email,
          lugar: formValue.location,
          hora_local: formValue.localTime,
          fecha_evento: formValue.eventDate,
          probabilidad: formValue.eventProbability,
          severidad: formValue.eventSeverity,

          // Empaquetamos todo lo específico de RPAS en el JSON para 'reportes_generados'
          detalles_completos_json: JSON.stringify({
            datos_drone: {
              tipo: formValue.droneType,
              altitud: formValue.estimatedAltitude,
              distancia: formValue.estimatedDistance,
              rumbo: formValue.direction,
              color: formValue.droneColor
            },
            analisis: {
              interferencia: formValue.interferedWithAircraft,
              zona_restringida: formValue.isRestrictedArea,
              clima: formValue.weatherConditions
            },
            mitigacion: {
              policia: formValue.mitigationPoliceNotified,
              atc: formValue.mitigationATCNotified,
              cierre_operaciones: formValue.mitigationSuspensionOps
            },
            narrativa: {
              peligro: formValue.hazardDetailDescription,
              consecuencias: formValue.consequences,
              propuesta: formValue.correctiveActionsProposal,
              gestion: formValue.riskManagement
            }
          })
        }
      };

      this.reporteService.guardarReporteVoluntario(payload).subscribe({
        next: (res) => {
          console.log('✅ Éxito:', res);
          alert('Reporte de Avistamiento RPAS enviado con éxito.');
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