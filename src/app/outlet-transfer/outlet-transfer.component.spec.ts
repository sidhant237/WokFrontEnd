import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletTransferComponent } from './outlet-transfer.component';

describe('OutletTransferComponent', () => {
  let component: OutletTransferComponent;
  let fixture: ComponentFixture<OutletTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
