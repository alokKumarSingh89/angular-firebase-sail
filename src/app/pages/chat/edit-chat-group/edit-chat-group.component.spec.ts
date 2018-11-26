import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChatGroupComponent } from './edit-chat-group.component';

describe('EditChatGroupComponent', () => {
  let component: EditChatGroupComponent;
  let fixture: ComponentFixture<EditChatGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChatGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChatGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
