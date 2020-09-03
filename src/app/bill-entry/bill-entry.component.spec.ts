import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEntryComponent } from './bill-entry.component';

describe('BillEntryComponent', () => {
  let component: BillEntryComponent;
  let fixture: ComponentFixture<BillEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
