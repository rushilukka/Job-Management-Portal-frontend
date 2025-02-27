import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgButtonComponent } from './ag-button.component';

describe('AgButtonComponent', () => {
  let component: AgButtonComponent;
  let fixture: ComponentFixture<AgButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
