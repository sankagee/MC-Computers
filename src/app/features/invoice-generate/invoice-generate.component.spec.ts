import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceGenerateComponent } from './invoice-generate.component';

describe('InvoiceGenerateComponent', () => {
  let component: InvoiceGenerateComponent;
  let fixture: ComponentFixture<InvoiceGenerateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceGenerateComponent]
    });
    fixture = TestBed.createComponent(InvoiceGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
