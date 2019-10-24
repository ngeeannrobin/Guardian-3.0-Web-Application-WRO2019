import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeempointComponent } from './redeempoint.component';

describe('RedeempointComponent', () => {
  let component: RedeempointComponent;
  let fixture: ComponentFixture<RedeempointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeempointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeempointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
