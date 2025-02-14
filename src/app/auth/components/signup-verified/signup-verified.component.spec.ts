import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupVerifiedComponent } from './signup-verified.component';

describe('SignupVerifiedComponent', () => {
  let component: SignupVerifiedComponent;
  let fixture: ComponentFixture<SignupVerifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupVerifiedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
