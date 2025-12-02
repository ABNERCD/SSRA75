import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Necesario para probar formularios reactivos
import { VoluntaryReportComponent } from './voluntary-report'; // Se importa el componente

describe('VoluntaryReportComponent', () => {
  let component: VoluntaryReportComponent;
  let fixture: ComponentFixture<VoluntaryReportComponent>;

  beforeEach(async () => {
    // Configura el entorno de prueba
    await TestBed.configureTestingModule({
      declarations: [ VoluntaryReportComponent ],
      imports: [ ReactiveFormsModule ] // Declara el módulo de formularios reactivos
    })
    .compileComponents();
  });

  beforeEach(() => {
    // Crea una instancia del componente
    fixture = TestBed.createComponent(VoluntaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta la detección inicial de cambios
  });

  it('should create the component', () => {
    // Verifica que el componente se haya instanciado correctamente
    expect(component).toBeTruthy();
  });

  it('should initialize the reportForm with 11 controls', () => {
    // Cuenta el número de FormControls que definimos en el .ts (11 en total)
    const formControlsCount = Object.keys(component.reportForm.controls).length;
    expect(formControlsCount).toBe(11);
  });

  it('should make the hazardDescription control required', () => {
    // Obtiene el control específico y prueba la validación 'required'
    const hazardDescriptionControl = component.reportForm.get('hazardDescription');
    hazardDescriptionControl?.setValue(''); // Valor vacío
    expect(hazardDescriptionControl?.valid).toBeFalsy();
    
    hazardDescriptionControl?.setValue('Descripción de prueba'); // Valor con datos
    expect(hazardDescriptionControl?.valid).toBeTruthy();
  });
  
  // Puedes añadir más pruebas aquí, por ejemplo:
  // it('should invalidate the form when required fields are empty', () => { ... });
  // it('should validate email format', () => { ... });
});