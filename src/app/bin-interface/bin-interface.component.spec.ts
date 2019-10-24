import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinInterfaceComponent } from './bin-interface.component';

describe('BinInterfaceComponent', () => {
  let component: BinInterfaceComponent;
  let fixture: ComponentFixture<BinInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
