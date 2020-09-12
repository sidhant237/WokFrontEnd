import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHazraComponent } from './order-hazra.component';

describe('OrderHazraComponent', () => {
  let component: OrderHazraComponent;
  let fixture: ComponentFixture<OrderHazraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHazraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHazraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
