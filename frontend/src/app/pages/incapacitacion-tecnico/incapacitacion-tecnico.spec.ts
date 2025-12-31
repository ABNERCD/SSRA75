import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; 
import { IncapacitacionTecnicoComponent } from './incapacitacion-tecnico'; 

describe('IncapacitacionTecnicoComponent', () => {
  let component: IncapacitacionTecnicoComponent;
  let fixture: ComponentFixture<IncapacitacionTecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        ReactiveFormsModule, 
        IncapacitacionTecnicoComponent 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapacitacionTecnicoComponent);
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
    
    control?.setValue('Descripción de prueba de incapacitación técnica');
    expect(control?.valid).toBeTruthy();
  });
});