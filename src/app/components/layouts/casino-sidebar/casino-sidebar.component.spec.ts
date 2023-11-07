import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoSidebarComponent } from './casino-sidebar.component';

describe('CasinoSidebarComponent', () => {
  let component: CasinoSidebarComponent;
  let fixture: ComponentFixture<CasinoSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinoSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
