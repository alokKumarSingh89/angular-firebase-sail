import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatItemComponent } from './group-chat-item.component';

describe('GroupChatItemComponent', () => {
  let component: GroupChatItemComponent;
  let fixture: ComponentFixture<GroupChatItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
