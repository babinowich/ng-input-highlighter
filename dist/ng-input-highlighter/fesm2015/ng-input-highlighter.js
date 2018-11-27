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
        this.targetItems = [];
        this.localAnalysis = true;
        this.boxHeight = 'M';
        // @Input() highContrast = true
        this.fontClass = 'regularText';
        this.boxClass = 'none';
        this.boxFocus = 'focused';
        this.initFocus = true;
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
        if (this.boxHeight === 'XS') {
            this.boxSize = 'xsmall';
        }
        else if (this.boxHeight === 'S') {
            this.boxSize = 'small';
        }
        else if (this.boxHeight === 'L') {
            this.boxSize = 'large';
        }
        else if (this.boxHeight === 'XL') {
            this.boxSize = 'xlarge';
        }
        else {
            this.boxSize = 'medium';
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ((this.targetItems.length > 0) && (!this.localAnalysis)) {
            if (changes["targetItems"]) {
                this.constructExternally();
                setTimeout(() => {
                    this.responsePending = false;
                    this.focusInput();
                }, 500);
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // Add event listeners to the DOM elements after rendered, allowing for box-border
        this.renderer.listen(this.lastInput.nativeElement, 'focus', () => {
            this.renderer.addClass(this.inputBox.nativeElement, this.boxFocus);
        });
        this.renderer.listen(this.lastInput.nativeElement, 'blur', () => {
            this.renderer.removeClass(this.inputBox.nativeElement, this.boxFocus);
        });
        // Focus the caret at the end of the box
        if (this.initFocus) {
            this.focusInput();
        }
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
        const beginning = '<span class="' + this.fontClass + '">';
        /** @type {?} */
        const analysisOutput = localAnalysis(this.targetItems, this.tempString, this.caseSensitive);
        this.textHTMLstring = beginning + analysisOutput + ' </span>';
    }
    /**
     * @return {?}
     */
    constructExternally() {
        /** @type {?} */
        const beginning = '<span class="' + this.fontClass + '">';
        /** @type {?} */
        let locationChecker = true;
        /** @type {?} */
        const erroredItems = [];
        if (this.targetItems.length === 0) {
            this.textHTMLstring = beginning + this.tempString + ' </span>';
        }
        else {
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
    /**
     * @return {?}
     */
    selectAll() {
        document.execCommand('selectAll', false, null);
    }
}
NgInputHighlighterComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-ng-input-highlighter',
                template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"[boxSize, boxClass]\">\n  <div class=\"text-area\" [ngClass]=\"{'pending': responsePending}\">\n    <span \n      #lastInput\n      autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n      id=\"input-span\" \n      contenteditable\n      [innerHTML]=\"textHTMLstring\"\n      [ngClass]=\"fontClass\"\n      (input)=\"textChange($event.target.textContent)\">\n    </span>\n    <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n    <span (click)=\"focusInput()\"  (dblclick)=\"selectAll()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                styles: ["#input-area{color:#000;margin-top:10px;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.none{background-color:#f3f6fa}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3;color:gray!important}"]
            }] }
];
/** @nocollapse */
NgInputHighlighterComponent.ctorParameters = () => [
    { type: Renderer2 }
];
NgInputHighlighterComponent.propDecorators = {
    targetItems: [{ type: Input }],
    localAnalysis: [{ type: Input }],
    boxHeight: [{ type: Input }],
    fontClass: [{ type: Input }],
    boxClass: [{ type: Input }],
    boxFocus: [{ type: Input }],
    initFocus: [{ type: Input }],
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
        /** @type {?} */
        let searchingString;
        /** @type {?} */
        let searchingText;
        if (!caseSensitive) {
            searchingString = str.toLowerCase();
            searchingText = item.text.toLowerCase();
        }
        else {
            searchingString = str;
            searchingText = item.text;
        }
        while ((index = searchingString.indexOf(searchingText, startIndex)) > -1) {
            /** @type {?} */
            const indexItem = {
                text: str.substring(index, index + searchStrLen),
                location: [index, index + searchStrLen],
                css: item.css
            };
            output.push(indexItem);
            startIndex = index + searchStrLen;
        }
    }
    if (output.length === 0) {
        return str;
    }
    else {
        return makeString(output, str);
    }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctaW5wdXQtaGlnaGxpZ2h0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHRhcmdldEl0ZW1zOiBBcnJheTxUYXJnZXRJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBpbnNpZGUgY29tcG9uZW50OiBhcnJheSBvZiBpdGVtcyB0byBmaW5kXG4gIEBJbnB1dCgpIGxvY2FsQW5hbHlzaXMgPSB0cnVlXG4gIEBJbnB1dCgpIGJveEhlaWdodCA9ICdNJ1xuICAvLyBASW5wdXQoKSBoaWdoQ29udHJhc3QgPSB0cnVlXG4gIEBJbnB1dCgpIGZvbnRDbGFzcyA9ICdyZWd1bGFyVGV4dCcgLy8gb3B0aW9uYWwgY2xhc3MgZm9yIGlucHV0IG9mIHN0eWxlIGZvciByZWd1bGFyIHRleHQgaW4gYm94XG4gIEBJbnB1dCgpIGJveENsYXNzID0gJ25vbmUnXG4gIEBJbnB1dCgpIGJveEZvY3VzID0gJ2ZvY3VzZWQnXG4gIEBJbnB1dCgpIGluaXRGb2N1cyA9IHRydWUgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBmb2N1cyBvbiBjb21wb25lbnQgdGV4dCBib3ggaW5pdGlhbGx5LCByZWNvbW1lbmRlZCBmb3IgYWNjZXNzaWJpbGl0eVxuICBASW5wdXQoKSBjYXNlU2Vuc2l0aXZlID0gZmFsc2U7IC8vIGFsbG93IGZvciBvcHRpb24gdG8gc2VsZWN0IGNhc2Ugc2Vuc2l0aXZpdHktIGRlZmF1bHQgdG8gb2ZmXG4gIEBPdXRwdXQoKSBjdXJyZW50VGV4dCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpOyAvLyBjdXJyZW50IHRleHQgc3RyaW5nLCB3aWxsIG91dHB1dCBmb3IgYW5hbHlzaXMgb3Igb3RoZXIgd29yayBvdXRzaWRlXG5cbiAgQFZpZXdDaGlsZCgnbGFzdElucHV0JykgbGFzdElucHV0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdpbnB1dEJveCcpIGlucHV0Qm94OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgdGV4dFN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KClcbiAgcHVibGljIHJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gIHB1YmxpYyB0ZXh0QXJyYXk6IEFycmF5PFRhcmdldEFycmF5SXRlbT4gPSBbXVxuICBwdWJsaWMgdGV4dEhUTUxzdHJpbmc6IHN0cmluZ1xuICBwdWJsaWMgdGVtcFN0cmluZyA9ICcnXG4gIHB1YmxpYyBib3hTaXplOiBTdHJpbmdcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAvLyBUaW1lciB0byBjaGVjayB3aGVuIHRvIHNlbmQgcmVxdWVzdCB0byB0ZXh0IGFuYWx5c2lzXG4gICAgdGhpcy50ZXh0U3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDIwMDApXG4gICAgKS5zdWJzY3JpYmUodGV4dCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdCh0aGlzLnRlbXBTdHJpbmcpO1xuICAgICAgLy8gSWYgd2UncmUgZG9pbmcgbG9jYWwgYW5hbHlzaXMsIGJlZ2luIHRoZSBwcm9jZXNzLCBvdGhlcndpc2UtIHdhaXQgZm9yIHJlc3BvbnNlIGZyb20gc2VydmljZVxuICAgICAgaWYgKHRoaXMubG9jYWxBbmFseXNpcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdExvY2FsbHkoKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4c21hbGwnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1MnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnc21hbGwnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ0wnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbGFyZ2UnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1hMJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3hsYXJnZSdcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ21lZGl1bSdcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RFeHRlcm5hbGx5KClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCB0aGlzLmJveEZvY3VzKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCB0aGlzLmJveEZvY3VzKTtcbiAgICB9KTtcbiAgICAvLyBGb2N1cyB0aGUgY2FyZXQgYXQgdGhlIGVuZCBvZiB0aGUgYm94XG4gICAgaWYgKHRoaXMuaW5pdEZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ3RhcmdldEl0ZW1zJywgdGhpcy50YXJnZXRJdGVtcyk7XG4gIH1cbiAgLy8gTWV0aG9kIGNhbGxlZCB1cG9uIGEga2V5c3Ryb2tlIHRvIGJlZ2luIHRoZSBwcm9jZXNzIG9mIHdhaXRpbmcgZm9yIGEgMiBzZWNvbmQgcGF1c2UgaW4ga2V5c3Ryb2tlc1xuICB0ZXh0Q2hhbmdlKGUpIHtcbiAgICB0aGlzLnRlbXBTdHJpbmcgPSBlO1xuICAgIHRoaXMudGV4dFN1YmplY3QubmV4dChlKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRob3V0IGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RMb2NhbGx5KCkge1xuICAgIC8vIGNvbnN0IHJlZ3VsYXJUZXh0Q2xhc3MgPSB0aGlzLnJlZ3VsYXJDbGFzcyA/IHRoaXMucmVndWxhckNsYXNzIDogJ3JlZ1R4dCc7XG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHRoaXMuZm9udENsYXNzICsgJ1wiPic7XG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZywgdGhpcy5jYXNlU2Vuc2l0aXZlKTtcbiAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkoKSB7XG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHRoaXMuZm9udENsYXNzICsgJ1wiPic7XG4gICAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWVcbiAgICBjb25zdCBlcnJvcmVkSXRlbXMgPSBbXVxuICAgIGlmICh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIHRoaXMudGVtcFN0cmluZyArICcgPC9zcGFuPidcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgaWYgKCFpdGVtLmxvY2F0aW9uKSB7XG4gICAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSlcbiAgICAgICAgICBsb2NhdGlvbkNoZWNrZXIgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobG9jYXRpb25DaGVja2VyKSB7XG4gICAgICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbWFrZVN0cmluZyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcpXG4gICAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyBhbmFseXNpc091dHB1dCArICcgPC9zcGFuPidcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBlcnJvcmVkSXRlbXNUZXh0ID0gJydcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICAgIGVycm9yZWRJdGVtc1RleHQgPSBlcnJvcmVkSXRlbXNUZXh0ICsgaXRlbS50ZXh0ICsgJyAgJ1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPVxuICAgICAgICAgICdBbiBlcnJvciBvY2N1cmVkLiAgVGhlIGZvbGxvd2luZyBpdGVtcyBkaWQgbm90IGhhdmUgYSB2YWxpZCBpZGVudGlmaWVkIGluZGV4IGxvY2F0aW9uOiAnICsgZXJyb3JlZEl0ZW1zVGV4dFxuICAgICAgICAgICsgJ0VpdGhlciBwcm92aWRlIHByb3BlciBpbmRleCBsb2NhdGlvbnMgb2YgZWFjaCBpdGVtIHRvIGJlIGhpZ2hsaWdodGVkIG9yIHNldCBsb2NhbEFuYWx5c2lzIHRvIHRydWUuJ1xuICAgICAgfVxuICAgIH1cblxuXG4gIH1cblxuXG5cbiAgLy8gQUNDRVNTSUJJTElUWVxuICAvLyBNZXRob2QgdG8gZGlyZWN0IHRoZSBmb2N1cyBvZiBhbnkgY2xpY2sgdG8gdGhlIGRlc2lyZWQgbG9jYXRpb25cbiAgZm9jdXNJbnB1dCgpIHtcbiAgICBjb25zb2xlLmxvZygnZm9jdXMnKTtcbiAgICBpZiAodGhpcy5sYXN0SW5wdXQpIHtcbiAgICAgIHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBwbGFjZSB0aGUgY2FyZXQgZm9jdXMgYXQgdGhlIGVuZCBvZiB0aGUgbGFzdCBpdGVtIG9mIHRoZSB0ZXh0IGFycmF5XG4gIHBsYWNlQ2FyZXRBdEVuZChlbCkge1xuICAgIGVsLmZvY3VzKClcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5nZXRTZWxlY3Rpb24gIT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKClcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbClcbiAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpXG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICB9XG4gIH1cblxuICBzZWxlY3RBbGwoKSB7XG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ3NlbGVjdEFsbCcsIGZhbHNlLCBudWxsKVxuICB9XG59XG5cblxuZnVuY3Rpb24gbG9jYWxBbmFseXNpcyhzZWFyY2hUYXJnZXRzLCBzdHIsIGNhc2VTZW5zaXRpdmUpIHtcbiAgY29uc3Qgb3V0cHV0ID0gW11cbiAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDBcbiAgICBsZXQgaW5kZXhcbiAgICBjb25zdCBzZWFyY2hTdHJMZW4gPSBpdGVtLnRleHQubGVuZ3RoO1xuICAgIGlmIChzZWFyY2hTdHJMZW4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdBbiBlcnJvciBvY2N1cnJlZC4gVGhlcmUgYXBwZWFycyB0byBiZSBubyBpbnB1dCBzZWFyY2ggc3RyaW5nLidcbiAgICB9XG4gICAgbGV0IHNlYXJjaGluZ1N0cmluZ1xuICAgIGxldCBzZWFyY2hpbmdUZXh0XG4gICAgaWYgKCFjYXNlU2Vuc2l0aXZlKSB7XG4gICAgICBzZWFyY2hpbmdTdHJpbmcgPSBzdHIudG9Mb3dlckNhc2UoKVxuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0clxuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dFxuICAgIH1cbiAgICB3aGlsZSAoKGluZGV4ID0gc2VhcmNoaW5nU3RyaW5nLmluZGV4T2Yoc2VhcmNoaW5nVGV4dCwgc3RhcnRJbmRleCkpID4gLTEpIHtcbiAgICAgIGNvbnN0IGluZGV4SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc3RyLnN1YnN0cmluZyhpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW4pLFxuICAgICAgICBsb2NhdGlvbjogW2luZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbl0sXG4gICAgICAgIGNzczogaXRlbS5jc3NcbiAgICAgIH1cbiAgICAgIG91dHB1dC5wdXNoKGluZGV4SXRlbSlcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgaWYgKG91dHB1dC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gc3RyXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1ha2VTdHJpbmcob3V0cHV0LCBzdHIpXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZVN0cmluZyhzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIH0pXG4gIGxldCBmaW5hbFRleHQgPSAnJ1xuICBsZXQgc3RhcnQgPSAwXG4gIGxldCBlbmQgPSBzZWFyY2hSZXN1bHRzWzBdLmxvY2F0aW9uWzBdXG4gIGxldCBtaWRkbGUgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSlcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG1pZGRsZVxuICAgICAgc3RhcnQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXVxuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMV1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKGZpbmFsVGV4dClcbiAgcmV0dXJuIGZpbmFsVGV4dFxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCB9IGZyb20gJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0lBT0UsaUJBQWlCOzs7WUFMbEIsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7Ozs7Ozs7O0FDSkQ7Ozs7SUF1Q0UsWUFBb0IsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVzsyQkFyQkcsRUFBRTs2QkFDbkIsSUFBSTt5QkFDUixHQUFHOzt5QkFFSCxhQUFhO3dCQUNkLE1BQU07d0JBQ04sU0FBUzt5QkFDUixJQUFJOzZCQUNBLEtBQUs7MkJBQ04sSUFBSSxZQUFZLEVBQVU7MkJBS1gsSUFBSSxPQUFPLEVBQUU7K0JBQzNCLEtBQUs7eUJBQ2EsRUFBRTswQkFFekIsRUFBRTtLQUlyQjs7OztJQUVELFFBQVE7O1FBRU4sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FDbkIsQ0FBQyxTQUFTLENBQUMsSUFBSTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztZQUV2QyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2dCQUN2QixVQUFVLENBQUM7b0JBQ1QsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUE7b0JBQzVCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtpQkFDbEIsRUFBRSxHQUFHLENBQUMsQ0FBQTthQUNSO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUMzQixJQUFJ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