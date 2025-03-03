import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJobApplicationComponent } from './user-job-application.component';

describe('UserJobApplicationComponent', () => {
  let component: UserJobApplicationComponent;
  let fixture: ComponentFixture<UserJobApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserJobApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJobApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
