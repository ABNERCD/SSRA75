import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) { } 

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      // ----------------------------------------------------
      // SECCIÓN: Información del Informante y Ubicación
      // ----------------------------------------------------
      name: [''],
      email: ['', [Validators.email]],
      location: ['', Validators.required],       // Lugar exacto del avistamiento
      localTime: ['', Validators.required], 
      eventDate: ['', Validators.required], 
      
      // ----------------------------------------------------
      // SECCIÓN: Detalles del Avistamiento (Específicos)
      // ----------------------------------------------------
      droneType: ['', Validators.required],      // Multirrotor, Ala fija, Desconocido
      estimatedAltitude: ['', Validators.required], // Altitud estimada (ft o m)
      estimatedDistance: ['', Validators.required], // Distancia al observador o pista
      direction: ['', Validators.required],       // Rumbo o dirección de vuelo
      droneColor: [''],                          // Descripción física

      // ✅ DESCRIPCIÓN OPERACIONAL
      hazardDetailDescription: ['', Validators.required], // Descripción de la maniobra
      consequences: ['', Validators.required],            // Interrupción de operaciones, etc.
      correctiveActionsProposal: ['', Validators.required],
      riskManagement: ['', Validators.required],

      // ----------------------------------------------------
      // SECCIÓN: Análisis de la Amenaza
      // ----------------------------------------------------
      interferedWithAircraft: [false],      // ¿Hubo conflicto con aeronaves tripuladas?
      isRestrictedArea: [true],             // ¿Ocurrió en zona Prohibida/Restringida?
      operatorSpotted: [''],                // ¿Se visualizó al operador en tierra?
      weatherConditions: [''],              // Visibilidad, luz, etc.
      potentialImpact: [''],                // Evaluación cualitativa del riesgo

      // ----------------------------------------------------
      // SECCIÓN: Estrategias de Respuesta / Mitigación
      // ----------------------------------------------------
      mitigationPoliceNotified: [false],    // Notificación a autoridades
      mitigationATCNotified: [false],      // Notificación a Torre de Control
      mitigationSuspensionOps: [false],    // Suspensión de operaciones
      mitigationTracking: [false],         // Seguimiento visual o radar
      mitigationSecurityPatrol: [false],   // Despliegue de patrulla de seguridad

      // ----------------------------------------------------
      // SECCIÓN: Matriz de Riesgo
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
      console.log('✅ Reporte de Avistamiento RPAS enviado. Datos:', this.reportForm.value);
      alert('Reporte de Avistamiento enviado con éxito a Seguridad Operacional.');
      this.reportForm.reset();
      this.selectedImages = [];
    } else {
      console.error('❌ Formulario incompleto. Por favor verifique los campos obligatorios.');
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