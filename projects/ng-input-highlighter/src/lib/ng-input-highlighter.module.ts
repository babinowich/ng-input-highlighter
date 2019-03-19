import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgInputHighlighterComponent } from './ng-input-highlighter.component';
import { TextDirective } from './textComponents/text.directive'
import { HighlightedComponent } from './textComponents/text-highlight.component'
import { RegularComponent } from './textComponents/text-regular.component'
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    BrowserModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  declarations: [
    NgInputHighlighterComponent,
    TextDirective,
    HighlightedComponent,
    RegularComponent
  ],
  entryComponents: [ HighlightedComponent, RegularComponent],
  exports: [NgInputHighlighterComponent]
})
export class NgInputHighlighterModule { }
