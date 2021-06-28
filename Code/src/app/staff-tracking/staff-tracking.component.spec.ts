import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTrackingComponent } from './staff-tracking.component';

describe('StaffTrackingComponent', () => {
  let component: StaffTrackingComponent;
  let fixture: ComponentFixture<StaffTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
