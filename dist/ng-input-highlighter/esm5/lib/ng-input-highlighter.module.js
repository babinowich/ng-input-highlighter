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
var NgInputHighlighterModule = /** @class */ (function () {
    function NgInputHighlighterModule() {
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
    return NgInputHighlighterModule;
}());
export { NgInputHighlighterModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUE7QUFDL0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUE7QUFDaEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0seUNBQXlDLENBQUE7QUFDMUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7Ozs7Z0JBRWpFLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsYUFBYTt3QkFDYixhQUFhO3dCQUNiLGVBQWU7d0JBQ2Ysa0JBQWtCO3FCQUNuQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osMkJBQTJCO3dCQUMzQixhQUFhO3dCQUNiLG9CQUFvQjt3QkFDcEIsZ0JBQWdCO3FCQUNqQjtvQkFDRCxlQUFlLEVBQUUsQ0FBRSxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDMUQsT0FBTyxFQUFFLENBQUMsMkJBQTJCLENBQUM7aUJBQ3ZDOzttQ0F6QkQ7O1NBMEJhLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgfSBmcm9tICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUZXh0RGlyZWN0aXZlIH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LmRpcmVjdGl2ZSdcbmltcG9ydCB7IEhpZ2hsaWdodGVkQ29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LWhpZ2hsaWdodC5jb21wb25lbnQnXG5pbXBvcnQgeyBSZWd1bGFyQ29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LXJlZ3VsYXIuY29tcG9uZW50J1xuaW1wb3J0IHsgTWF0TWVudU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuaW1wb3J0IHsgTWF0U2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZSxcbiAgICBNYXRNZW51TW9kdWxlLFxuICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50LFxuICAgIFRleHREaXJlY3RpdmUsXG4gICAgSGlnaGxpZ2h0ZWRDb21wb25lbnQsXG4gICAgUmVndWxhckNvbXBvbmVudFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFsgSGlnaGxpZ2h0ZWRDb21wb25lbnQsIFJlZ3VsYXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJNb2R1bGUgeyB9XG4iXX0=