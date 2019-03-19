import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[libTextHost]',
})
export class TextDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

