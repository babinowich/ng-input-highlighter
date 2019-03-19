/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgInputHighlighterComponent } from './ng-input-highlighter.component';
import { TextDirective } from './textComponents/text.directive';
import { HighlightedComponent } from './textComponents/text-highlight.component';
import { RegularComponent } from './textComponents/text-regular.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
export class NgInputHighlighterModule {
}
NgInputHighlighterModule.decorators = [
    { type: NgModule, args: [{
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
                entryComponents: [HighlightedComponent, RegularComponent],
                exports: [NgInputHighlighterComponent]
            },] }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUE7QUFDL0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUE7QUFDaEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0seUNBQXlDLENBQUE7QUFDMUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQWtCbEUsTUFBTTs7O1lBaEJMLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsYUFBYTtvQkFDYixhQUFhO29CQUNiLGVBQWU7b0JBQ2Ysa0JBQWtCO2lCQUNuQjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osMkJBQTJCO29CQUMzQixhQUFhO29CQUNiLG9CQUFvQjtvQkFDcEIsZ0JBQWdCO2lCQUNqQjtnQkFDRCxlQUFlLEVBQUUsQ0FBRSxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDMUQsT0FBTyxFQUFFLENBQUMsMkJBQTJCLENBQUM7YUFDdkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IH0gZnJvbSAnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGV4dERpcmVjdGl2ZSB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC5kaXJlY3RpdmUnXG5pbXBvcnQgeyBIaWdobGlnaHRlZENvbXBvbmVudCB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC1oaWdobGlnaHQuY29tcG9uZW50J1xuaW1wb3J0IHsgUmVndWxhckNvbXBvbmVudCB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC1yZWd1bGFyLmNvbXBvbmVudCdcbmltcG9ydCB7IE1hdE1lbnVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcbmltcG9ydCB7IE1hdFNlbGVjdE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdCc7XG5pbXBvcnQgeyBNYXRGb3JtRmllbGRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgTWF0TWVudU1vZHVsZSxcbiAgICBNYXRTZWxlY3RNb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCxcbiAgICBUZXh0RGlyZWN0aXZlLFxuICAgIEhpZ2hsaWdodGVkQ29tcG9uZW50LFxuICAgIFJlZ3VsYXJDb21wb25lbnRcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbIEhpZ2hsaWdodGVkQ29tcG9uZW50LCBSZWd1bGFyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyTW9kdWxlIHsgfVxuIl19