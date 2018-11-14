import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgInputHighlighterComponent } from './ng-input-highlighter.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [NgInputHighlighterComponent],
  exports: [NgInputHighlighterComponent]
})
export class NgInputHighlighterModule { }
