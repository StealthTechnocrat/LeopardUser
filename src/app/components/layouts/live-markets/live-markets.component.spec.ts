import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMarketsComponent } from './live-markets.component';

describe('LiveMarketsComponent', () => {
  let component: LiveMarketsComponent;
  let fixture: ComponentFixture<LiveMarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveMarketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
