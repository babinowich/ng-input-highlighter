import { TestBed } from '@angular/core/testing';

import { NgInputHighlighterService } from './ng-input-highlighter.service';

describe('NgInputHighlighterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgInputHighlighterService = TestBed.get(NgInputHighlighterService);
    expect(service).toBeTruthy();
  });
});
