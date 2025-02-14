import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerificationPendingComponent } from './signup-verification-pending.component';

describe('SignupVerificationPendingComponent', () => {
  let component: SignupVerificationPendingComponent;
  let fixture: ComponentFixture<SignupVerificationPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupVerificationPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupVerificationPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
