import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgInputHighlighterComponent } from './ng-input-highlighter.component';

describe('NgInputHighlighterComponent', () => {
  let component: NgInputHighlighterComponent;
  let fixture: ComponentFixture<NgInputHighlighterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgInputHighlighterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgInputHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
