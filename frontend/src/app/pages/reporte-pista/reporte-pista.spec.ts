import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ReportePistaComponent } from './reporte-pista'; 

describe('ReportePistaComponent', () => {
  let component: ReportePistaComponent;
  let fixture: ComponentFixture<ReportePistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // SE CORRIGE AQUÍ: Un solo bloque de imports con todo adentro
      imports: [ 
        ReactiveFormsModule, 
        ReportePistaComponent 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the reportForm with 21 controls', () => {
    const formControlsCount = Object.keys(component.reportForm.controls).length;
    expect(formControlsCount).toBe(21);
  });

  it('should make the hazardDetailDescription control required', () => {
    const control = component.reportForm.get('hazardDetailDescription');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    
    control?.setValue('Descripción de prueba de pista');
    expect(control?.valid).toBeTruthy();
  });
});