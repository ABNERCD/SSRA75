import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) { } 

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      // ----------------------------------------------------
      // SECCIÓN: Información Personal y del Evento
      // ----------------------------------------------------
      name: [''],
      email: ['', [Validators.email]],
      location: ['', Validators.required],
      localTime: ['', Validators.required], 
      eventDate: ['', Validators.required], 
      
      // CAMPOS ESPECÍFICOS: RPAS Y DAÑOS
      pistaId: ['', Validators.required],      // ID de la aeronave/Drone (Matrícula o Serial)
      rwycc: ['', Validators.required],        // Nivel de daño o categoría del suceso

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
      console.log('✅ Reporte de RPAS-Daños enviado con éxito. Datos:', this.reportForm.value);
      alert('Reporte de Daños RPAS enviado. ¡Gracias por contribuir a la seguridad operacional!');
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