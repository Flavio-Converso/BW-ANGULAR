import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreazionePgComponent } from './creazione-pg.component';

describe('CreazionePgComponent', () => {
  let component: CreazionePgComponent;
  let fixture: ComponentFixture<CreazionePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreazionePgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreazionePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
