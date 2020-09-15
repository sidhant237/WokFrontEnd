import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransferComponent } from './cash-transfer.component';

describe('CashTransferComponent', () => {
  let component: CashTransferComponent;
  let fixture: ComponentFixture<CashTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
