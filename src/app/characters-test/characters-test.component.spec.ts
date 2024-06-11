import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersTestComponent } from './characters-test.component';

describe('CharactersTestComponent', () => {
  let component: CharactersTestComponent;
  let fixture: ComponentFixture<CharactersTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharactersTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharactersTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
