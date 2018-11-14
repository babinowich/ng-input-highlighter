import { Injectable, Component, ViewChild, Renderer2, Input, Output, EventEmitter, NgModule, defineInjectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgInputHighlighterService {
    constructor() { }
}
NgInputHighlighterService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgInputHighlighterService.ctorParameters = () => [];
/** @nocollapse */ NgInputHighlighterService.ngInjectableDef = defineInjectable({ factory: function NgInputHighlighterService_Factory() { return new NgInputHighlighterService(); }, token: NgInputHighlighterService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgInputHighlighterComponent {
    /**
     * @param {?} renderer
     */
    constructor(renderer) {
        this.renderer = renderer;
        this.regularClass = null;
        // @Input() targetTextArray: Array<TargetArrayItem> = []; // analysis outside component: need to define schema
        this.targetItems = [];
        this.localAnalysis = true;
        this.caseSensitive = false;
        this.currentText = new EventEmitter();
        this.textSubject = new Subject();
        this.responsePending = false;
        this.textArray = [];
        this.tempString = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Timer to check when to send request to text analysis
        this.textSubject.pipe(debounceTime(2000)).subscribe(text => {
            console.log(text);
            this.responsePending = true;
            this.currentText.emit(this.tempString);
            // If we're doing local analysis, begin the process, otherwise- wait for response from service
            if (this.localAnalysis) {
                this.constructLocally();
                setTimeout(() => {
                    this.responsePending = false;
                    this.focusInput();
                }, 500);
            }
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ((this.targetItems.length > 0) && (!this.localAnalysis)) {
            if (changes["targetItems"]) {
                console.log(changes);
                // if (changes.targetItems.isFirstChange) {
                //   console.log(changes)
                //   console.log('selected to do external analysis strategy')
                // } else {
                // Response came back from service
                this.constructExternally();
                setTimeout(() => {
                    this.responsePending = false;
                    this.focusInput();
                }, 500);
                // }
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // Add event listeners to the DOM elements after rendered, allowing for box-border
        this.renderer.listen(this.lastInput.nativeElement, 'focus', () => {
            this.renderer.addClass(this.inputBox.nativeElement, 'focused');
        });
        this.renderer.listen(this.lastInput.nativeElement, 'blur', () => {
            this.renderer.removeClass(this.inputBox.nativeElement, 'focused');
        });
        // Focus the caret at the end of the box
        this.focusInput();
        console.log('targetItems', this.targetItems);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    textChange(e) {
        this.tempString = e;
        this.textSubject.next(e);
    }
    /**
     * @return {?}
     */
    constructLocally() {
        /** @type {?} */
        const regularTextClass = this.regularClass ? this.regularClass : 'regTxt';
        /** @type {?} */
        const beginning = '<span class="' + regularTextClass + '">';
        /** @type {?} */
        const analysisOutput = localAnalysis(this.targetItems, this.tempString, this.caseSensitive);
        this.textHTMLstring = beginning + analysisOutput + ' </span>';
    }
    /**
     * @return {?}
     */
    constructExternally() {
        console.log(this.targetItems, this.tempString);
        /** @type {?} */
        const regularTextClass = this.regularClass ? this.regularClass : 'regTxt';
        /** @type {?} */
        const beginning = '<span class="' + regularTextClass + '">';
        /** @type {?} */
        let locationChecker = true;
        /** @type {?} */
        const erroredItems = [];
        for (const item of this.targetItems) {
            if (!item.location) {
                erroredItems.push(item);
                locationChecker = false;
            }
        }
        if (locationChecker) {
            /** @type {?} */
            const analysisOutput = makeString(this.targetItems, this.tempString);
            this.textHTMLstring = beginning + analysisOutput + ' </span>';
        }
        else {
            /** @type {?} */
            let erroredItemsText = '';
            for (const item of erroredItems) {
                erroredItemsText = erroredItemsText + item.text + '  ';
            }
            this.textHTMLstring =
                'An error occured.  The following items did not have a valid identified index location: ' + erroredItemsText
                    + 'Either provide proper index locations of each item to be highlighted or set localAnalysis to true.';
        }
    }
    /**
     * @return {?}
     */
    focusInput() {
        console.log('focus');
        if (this.lastInput) {
            this.lastInput.nativeElement.focus();
            this.placeCaretAtEnd(this.lastInput.nativeElement);
        }
    }
    /**
     * @param {?} el
     * @return {?}
     */
    placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection !== 'undefined'
            && typeof document.createRange !== 'undefined') {
            /** @type {?} */
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            /** @type {?} */
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}
NgInputHighlighterComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-ng-input-highlighter',
                template: "<div #inputBox id=\"input-area\" tabindex=\"0\">\n  <div class=\"text-area\">\n      <span \n        #lastInput\n        autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n        id=\"input-span\" \n        contenteditable\n        [innerHTML]=\"textHTMLstring\"\n        [ngClass]=\"{'pending': responsePending}\"\n        (input)=\"textChange($event.target.textContent)\">\n      </span>\n      <span *ngIf=\"responsePending\" style=\"margin-left:15px\" class=\"spinner spinner-inline\"></span>\n      <span (click)=\"focusInput()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" class=\"rest\"></div>\n</div>",
                styles: ["#input-area{color:#000;margin-top:10px;background-color:#f3f6fa;border-radius:5px;height:250px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3}"]
            }] }
];
/** @nocollapse */
NgInputHighlighterComponent.ctorParameters = () => [
    { type: Renderer2 }
];
NgInputHighlighterComponent.propDecorators = {
    regularClass: [{ type: Input }],
    targetItems: [{ type: Input }],
    localAnalysis: [{ type: Input }],
    caseSensitive: [{ type: Input }],
    currentText: [{ type: Output }],
    lastInput: [{ type: ViewChild, args: ['lastInput',] }],
    inputBox: [{ type: ViewChild, args: ['inputBox',] }]
};
/**
 * @param {?} searchTargets
 * @param {?} str
 * @param {?} caseSensitive
 * @return {?}
 */
function localAnalysis(searchTargets, str, caseSensitive) {
    if (caseSensitive) {
        str = str.toLowerCase();
        for (const item of searchTargets) {
            item.text = item.text.toLowerCase();
        }
    }
    /** @type {?} */
    const output = [];
    for (const item of searchTargets) {
        /** @type {?} */
        let startIndex = 0;
        /** @type {?} */
        let index;
        /** @type {?} */
        const searchStrLen = item.text.length;
        if (searchStrLen === 0) {
            return 'An error occurred. There appears to be no input search string.';
        }
        while ((index = str.indexOf(item.text, startIndex)) > -1) {
            /** @type {?} */
            let indexItem = {
                text: item.text,
                location: [index, index + searchStrLen],
                css: item.css
            };
            output.push(indexItem);
            startIndex = index + searchStrLen;
        }
    }
    // output.sort(function(a, b) {
    //   return a.location[0] - b.location[0]
    // })
    return makeString(output, str);
}
/**
 * @param {?} searchResults
 * @param {?} original_text
 * @return {?}
 */
function makeString(searchResults, original_text) {
    searchResults.sort(function (a, b) {
        return a.location[0] - b.location[0];
    });
    /** @type {?} */
    let finalText = '';
    /** @type {?} */
    let start = 0;
    /** @type {?} */
    let end = searchResults[0].location[0];
    /** @type {?} */
    let middle = '';
    for (let i = 0; i < searchResults.length; i++) {
        if (start === 0) {
            finalText = finalText + original_text.substring(start, end) +
                '<span class="' + searchResults[i].css + '">' + searchResults[i].text + '</span>';
            end = searchResults[i].location[1];
        }
        else {
            finalText = finalText + '<span class="' + searchResults[i].css + '">' + searchResults[i].text + '</span>';
        }
        if (searchResults[i + 1]) {
            middle = original_text.substring(searchResults[i].location[1], searchResults[i + 1].location[0]);
            finalText = finalText + middle;
            start = searchResults[i + 1].location[0];
            end = searchResults[i + 1].location[1];
        }
        if (i === (searchResults.length - 1)) {
            finalText = finalText + original_text.substring(end, original_text.length);
        }
    }
    console.log(finalText);
    return finalText;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgInputHighlighterModule {
}
NgInputHighlighterModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BrowserModule
                ],
                declarations: [NgInputHighlighterComponent],
                exports: [NgInputHighlighterComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgInputHighlighterService, NgInputHighlighterComponent, NgInputHighlighterModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctaW5wdXQtaGlnaGxpZ2h0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHJlZ3VsYXJDbGFzczogc3RyaW5nID0gbnVsbCAvLyBvcHRpb25hbCBjbGFzcyBmb3IgaW5wdXQgb2Ygc3R5bGUgZm9yIHJlZ3VsYXIgdGV4dCBpbiBib3hcbiAgLy8gQElucHV0KCkgdGFyZ2V0VGV4dEFycmF5OiBBcnJheTxUYXJnZXRBcnJheUl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIG91dHNpZGUgY29tcG9uZW50OiBuZWVkIHRvIGRlZmluZSBzY2hlbWFcbiAgQElucHV0KCkgdGFyZ2V0SXRlbXM6IEFycmF5PFRhcmdldEl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIGluc2lkZSBjb21wb25lbnQ6IGFycmF5IG9mIGl0ZW1zIHRvIGZpbmRcbiAgQElucHV0KCkgbG9jYWxBbmFseXNpcyA9IHRydWVcbiAgQElucHV0KCkgY2FzZVNlbnNpdGl2ZSA9IGZhbHNlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIHNlbGVjdCBjYXNlIHNlbnNpdGl2aXR5LSBkZWZhdWx0IHRvIG9mZlxuICBAT3V0cHV0KCkgY3VycmVudFRleHQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTsgLy8gY3VycmVudCB0ZXh0IHN0cmluZywgd2lsbCBvdXRwdXQgZm9yIGFuYWx5c2lzIG9yIG90aGVyIHdvcmsgb3V0c2lkZVxuXG4gIEBWaWV3Q2hpbGQoJ2xhc3RJbnB1dCcpIGxhc3RJbnB1dDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRCb3gnKSBpbnB1dEJveDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHRleHRTdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpXG4gIHB1YmxpYyByZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICBwdWJsaWMgdGV4dEFycmF5OiBBcnJheTxUYXJnZXRBcnJheUl0ZW0+ID0gW11cbiAgcHVibGljIHRleHRIVE1Mc3RyaW5nOiBzdHJpbmdcbiAgcHVibGljIHRlbXBTdHJpbmcgPSAnJ1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIC8vIFRpbWVyIHRvIGNoZWNrIHdoZW4gdG8gc2VuZCByZXF1ZXN0IHRvIHRleHQgYW5hbHlzaXNcbiAgICB0aGlzLnRleHRTdWJqZWN0LnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMjAwMClcbiAgICApLnN1YnNjcmliZSh0ZXh0ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5jdXJyZW50VGV4dC5lbWl0KHRoaXMudGVtcFN0cmluZyk7XG4gICAgICAvLyBJZiB3ZSdyZSBkb2luZyBsb2NhbCBhbmFseXNpcywgYmVnaW4gdGhlIHByb2Nlc3MsIG90aGVyd2lzZS0gd2FpdCBmb3IgcmVzcG9uc2UgZnJvbSBzZXJ2aWNlXG4gICAgICBpZiAodGhpcy5sb2NhbEFuYWx5c2lzKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TG9jYWxseSgpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKVxuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMudGFyZ2V0SXRlbXMubGVuZ3RoID4gMCkgJiYgKCF0aGlzLmxvY2FsQW5hbHlzaXMpKSB7XG4gICAgICBpZiAoY2hhbmdlcy50YXJnZXRJdGVtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhjaGFuZ2VzKVxuICAgICAgICAvLyBpZiAoY2hhbmdlcy50YXJnZXRJdGVtcy5pc0ZpcnN0Q2hhbmdlKSB7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coY2hhbmdlcylcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgdG8gZG8gZXh0ZXJuYWwgYW5hbHlzaXMgc3RyYXRlZ3knKVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJlc3BvbnNlIGNhbWUgYmFjayBmcm9tIHNlcnZpY2VcbiAgICAgICAgICB0aGlzLmNvbnN0cnVjdEV4dGVybmFsbHkoKVxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgICB9LCA1MDApXG4gICAgICAgIC8vIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdibHVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsICdmb2N1c2VkJyk7XG4gICAgfSk7XG4gICAgLy8gRm9jdXMgdGhlIGNhcmV0IGF0IHRoZSBlbmQgb2YgdGhlIGJveFxuICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgIGNvbnNvbGUubG9nKCd0YXJnZXRJdGVtcycsIHRoaXMudGFyZ2V0SXRlbXMpO1xuICB9XG4gIC8vIE1ldGhvZCBjYWxsZWQgdXBvbiBhIGtleXN0cm9rZSB0byBiZWdpbiB0aGUgcHJvY2VzcyBvZiB3YWl0aW5nIGZvciBhIDIgc2Vjb25kIHBhdXNlIGluIGtleXN0cm9rZXNcbiAgdGV4dENoYW5nZShlKSB7XG4gICAgdGhpcy50ZW1wU3RyaW5nID0gZTtcbiAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoZSk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aG91dCBsb2NhdGlvbnNcbiAgY29uc3RydWN0TG9jYWxseSgpIHtcbiAgICBjb25zdCByZWd1bGFyVGV4dENsYXNzID0gdGhpcy5yZWd1bGFyQ2xhc3MgPyB0aGlzLnJlZ3VsYXJDbGFzcyA6ICdyZWdUeHQnO1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyByZWd1bGFyVGV4dENsYXNzICsgJ1wiPic7XG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZywgdGhpcy5jYXNlU2Vuc2l0aXZlKTtcbiAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy50YXJnZXRJdGVtcywgdGhpcy50ZW1wU3RyaW5nKVxuICAgIGNvbnN0IHJlZ3VsYXJUZXh0Q2xhc3MgPSB0aGlzLnJlZ3VsYXJDbGFzcyA/IHRoaXMucmVndWxhckNsYXNzIDogJ3JlZ1R4dCdcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgcmVndWxhclRleHRDbGFzcyArICdcIj4nXG4gICAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWVcbiAgICBjb25zdCBlcnJvcmVkSXRlbXMgPSBbXVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnRhcmdldEl0ZW1zKSB7XG4gICAgICBpZiAoIWl0ZW0ubG9jYXRpb24pIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSlcbiAgICAgICAgbG9jYXRpb25DaGVja2VyID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGxvY2F0aW9uQ2hlY2tlcikge1xuICAgICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBtYWtlU3RyaW5nKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZylcbiAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyBhbmFseXNpc091dHB1dCArICcgPC9zcGFuPidcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGVycm9yZWRJdGVtc1RleHQgPSAnJ1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICBlcnJvcmVkSXRlbXNUZXh0ID0gZXJyb3JlZEl0ZW1zVGV4dCArIGl0ZW0udGV4dCArICcgICdcbiAgICAgIH1cbiAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPVxuICAgICAgICAnQW4gZXJyb3Igb2NjdXJlZC4gIFRoZSBmb2xsb3dpbmcgaXRlbXMgZGlkIG5vdCBoYXZlIGEgdmFsaWQgaWRlbnRpZmllZCBpbmRleCBsb2NhdGlvbjogJyArIGVycm9yZWRJdGVtc1RleHRcbiAgICAgICAgKyAnRWl0aGVyIHByb3ZpZGUgcHJvcGVyIGluZGV4IGxvY2F0aW9ucyBvZiBlYWNoIGl0ZW0gdG8gYmUgaGlnaGxpZ2h0ZWQgb3Igc2V0IGxvY2FsQW5hbHlzaXMgdG8gdHJ1ZS4nXG4gICAgfVxuXG4gIH1cblxuXG5cbiAgLy8gQUNDRVNTSUJJTElUWVxuICAvLyBNZXRob2QgdG8gZGlyZWN0IHRoZSBmb2N1cyBvZiBhbnkgY2xpY2sgdG8gdGhlIGRlc2lyZWQgbG9jYXRpb25cbiAgZm9jdXNJbnB1dCgpIHtcbiAgICBjb25zb2xlLmxvZygnZm9jdXMnKTtcbiAgICBpZiAodGhpcy5sYXN0SW5wdXQpIHtcbiAgICAgIHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBwbGFjZSB0aGUgY2FyZXQgZm9jdXMgYXQgdGhlIGVuZCBvZiB0aGUgbGFzdCBpdGVtIG9mIHRoZSB0ZXh0IGFycmF5XG4gIHBsYWNlQ2FyZXRBdEVuZChlbCkge1xuICAgIGVsLmZvY3VzKClcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5nZXRTZWxlY3Rpb24gIT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKClcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbClcbiAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpXG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBsb2NhbEFuYWx5c2lzKHNlYXJjaFRhcmdldHMsIHN0ciwgY2FzZVNlbnNpdGl2ZSkge1xuICBpZiAoY2FzZVNlbnNpdGl2ZSkge1xuICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfVxuICB9XG4gIGNvbnN0IG91dHB1dCA9IFtdXG4gIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwXG4gICAgbGV0IGluZGV4XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nXG4gICAgfVxuICAgIHdoaWxlICgoaW5kZXggPSBzdHIuaW5kZXhPZihpdGVtLnRleHQsIHN0YXJ0SW5kZXgpKSA+IC0xKSB7XG4gICAgICBsZXQgaW5kZXhJdGVtID0ge1xuICAgICAgICB0ZXh0OiBpdGVtLnRleHQsXG4gICAgICAgIGxvY2F0aW9uOiBbaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuXSxcbiAgICAgICAgY3NzOiBpdGVtLmNzc1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goaW5kZXhJdGVtKVxuICAgICAgc3RhcnRJbmRleCA9IGluZGV4ICsgc2VhcmNoU3RyTGVuO1xuICAgIH1cbiAgfVxuICAvLyBvdXRwdXQuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gIC8vICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIC8vIH0pXG4gIHJldHVybiBtYWtlU3RyaW5nKG91dHB1dCwgc3RyKVxufVxuXG5mdW5jdGlvbiBtYWtlU3RyaW5nKHNlYXJjaFJlc3VsdHMsIG9yaWdpbmFsX3RleHQpIHtcbiAgc2VhcmNoUmVzdWx0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5sb2NhdGlvblswXSAtIGIubG9jYXRpb25bMF1cbiAgfSlcbiAgbGV0IGZpbmFsVGV4dCA9ICcnXG4gIGxldCBzdGFydCA9IDBcbiAgbGV0IGVuZCA9IHNlYXJjaFJlc3VsdHNbMF0ubG9jYXRpb25bMF1cbiAgbGV0IG1pZGRsZSA9ICcnXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhcmNoUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdGFydCA9PT0gMCkge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZCkgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiJyArIHNlYXJjaFJlc3VsdHNbaV0uY3NzICsgJ1wiPicgKyBzZWFyY2hSZXN1bHRzW2ldLnRleHQgKyAnPC9zcGFuPidcbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV1cbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgJzxzcGFuIGNsYXNzPVwiJyArIHNlYXJjaFJlc3VsdHNbaV0uY3NzICsgJ1wiPicgKyBzZWFyY2hSZXN1bHRzW2ldLnRleHQgKyAnPC9zcGFuPidcbiAgICB9XG5cbiAgICBpZiAoc2VhcmNoUmVzdWx0c1tpICsgMV0pIHtcbiAgICAgIG1pZGRsZSA9IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV0sIHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdKVxuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgbWlkZGxlXG4gICAgICBzdGFydCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblsxXVxuICAgIH1cblxuICAgIGlmIChpID09PSAoc2VhcmNoUmVzdWx0cy5sZW5ndGggLSAxKSkge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoZW5kLCBvcmlnaW5hbF90ZXh0Lmxlbmd0aClcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coZmluYWxUZXh0KVxuICByZXR1cm4gZmluYWxUZXh0XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IH0gZnJvbSAnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJNb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7SUFPRSxpQkFBaUI7OztZQUxsQixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7Ozs7Ozs7QUNKRDs7OztJQWtDRSxZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXOzRCQWhCUCxJQUFJOzsyQkFFTSxFQUFFOzZCQUNuQixJQUFJOzZCQUNKLEtBQUs7MkJBQ04sSUFBSSxZQUFZLEVBQVU7MkJBS1gsSUFBSSxPQUFPLEVBQUU7K0JBQzNCLEtBQUs7eUJBQ2EsRUFBRTswQkFFekIsRUFBRTtLQUdyQjs7OztJQUVELFFBQVE7O1FBRU4sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FDbkIsQ0FBQyxTQUFTLENBQUMsSUFBSTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxD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