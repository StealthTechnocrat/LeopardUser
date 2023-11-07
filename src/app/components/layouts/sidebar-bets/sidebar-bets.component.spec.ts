import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBetsComponent } from './sidebar-bets.component';

describe('SidebarBetsComponent', () => {
  let component: SidebarBetsComponent;
  let fixture: ComponentFixture<SidebarBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
