import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryButtonsComponent } from './history-buttons.component';

describe('HistoryButtonsComponent', () => {
  let component: HistoryButtonsComponent;
  let fixture: ComponentFixture<HistoryButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
