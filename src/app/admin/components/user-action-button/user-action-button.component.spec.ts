import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionButtonComponent } from './user-action-button.component';

describe('UserActionButtonComponent', () => {
  let component: UserActionButtonComponent;
  let fixture: ComponentFixture<UserActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserActionButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
