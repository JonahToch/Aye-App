import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameSelectionComponent } from './username-selection.component';

describe('UsernameSelectionComponent', () => {
  let component: UsernameSelectionComponent;
  let fixture: ComponentFixture<UsernameSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsernameSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
