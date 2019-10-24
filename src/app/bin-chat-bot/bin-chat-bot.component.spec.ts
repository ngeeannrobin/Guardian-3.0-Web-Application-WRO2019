import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinChatBotComponent } from './bin-chat-bot.component';

describe('BinChatBotComponent', () => {
  let component: BinChatBotComponent;
  let fixture: ComponentFixture<BinChatBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinChatBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinChatBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
