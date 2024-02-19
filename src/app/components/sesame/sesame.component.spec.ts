import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesameComponent } from './sesame.component';

describe('SesameComponent', () => {
  let component: SesameComponent;
  let fixture: ComponentFixture<SesameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
