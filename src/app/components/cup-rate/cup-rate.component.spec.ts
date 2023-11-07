import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CupRateComponent } from './cup-rate.component';

describe('CupRateComponent', () => {
  let component: CupRateComponent;
  let fixture: ComponentFixture<CupRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CupRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CupRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
