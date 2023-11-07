import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoGameComponent } from './casino-game.component';

describe('CasinoGameComponent', () => {
  let component: CasinoGameComponent;
  let fixture: ComponentFixture<CasinoGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinoGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
