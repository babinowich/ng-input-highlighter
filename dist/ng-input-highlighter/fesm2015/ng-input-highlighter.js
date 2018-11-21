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
        this.regularClass = 'regularText';
        this.targetItems = [];
        this.localAnalysis = true;
        this.boxHeight = 'M';
        // @Input() highContrast = true
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
            this.renderer.addClass(this.inputBox.nativeElement, 'focused');
        });
        this.renderer.listen(this.lastInput.nativeElement, 'blur', () => {
            this.renderer.removeClass(this.inputBox.nativeElement, 'focused');
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
        const beginning = '<span class="' + this.regularClass + '">';
        /** @type {?} */
        const analysisOutput = localAnalysis(this.targetItems, this.tempString, this.caseSensitive);
        this.textHTMLstring = beginning + analysisOutput + ' </span>';
    }
    /**
     * @return {?}
     */
    constructExternally() {
        /** @type {?} */
        const beginning = '<span class="' + this.regularClass + '">';
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
                template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"boxSize\">\n  <div class=\"text-area\">\n      <span \n        #lastInput\n        autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n        id=\"input-span\" \n        contenteditable\n        [innerHTML]=\"textHTMLstring\"\n        [ngClass]=\"{'pending': responsePending}\"\n        (input)=\"textChange($event.target.textContent)\">\n      </span>\n      <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n      <span (click)=\"focusInput()\"  (dblclick)=\"selectAll()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                styles: ["#input-area{color:#000;margin-top:10px;background-color:#f3f6fa;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3}::selection{background:#444782;color:#fff}::-moz-selection{background:#444782;color:#fff}"]
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
    boxHeight: [{ type: Input }],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctaW5wdXQtaGlnaGxpZ2h0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHJlZ3VsYXJDbGFzcyA9ICdyZWd1bGFyVGV4dCcgLy8gb3B0aW9uYWwgY2xhc3MgZm9yIGlucHV0IG9mIHN0eWxlIGZvciByZWd1bGFyIHRleHQgaW4gYm94XG4gIEBJbnB1dCgpIHRhcmdldEl0ZW1zOiBBcnJheTxUYXJnZXRJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBpbnNpZGUgY29tcG9uZW50OiBhcnJheSBvZiBpdGVtcyB0byBmaW5kXG4gIEBJbnB1dCgpIGxvY2FsQW5hbHlzaXMgPSB0cnVlXG4gIEBJbnB1dCgpIGJveEhlaWdodCA9ICdNJ1xuICAvLyBASW5wdXQoKSBoaWdoQ29udHJhc3QgPSB0cnVlXG4gIEBJbnB1dCgpIGluaXRGb2N1cyA9IHRydWUgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBmb2N1cyBvbiBjb21wb25lbnQgdGV4dCBib3ggaW5pdGlhbGx5LCByZWNvbW1lbmRlZCBmb3IgYWNjZXNzaWJpbGl0eVxuICBASW5wdXQoKSBjYXNlU2Vuc2l0aXZlID0gZmFsc2U7IC8vIGFsbG93IGZvciBvcHRpb24gdG8gc2VsZWN0IGNhc2Ugc2Vuc2l0aXZpdHktIGRlZmF1bHQgdG8gb2ZmXG4gIEBPdXRwdXQoKSBjdXJyZW50VGV4dCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpOyAvLyBjdXJyZW50IHRleHQgc3RyaW5nLCB3aWxsIG91dHB1dCBmb3IgYW5hbHlzaXMgb3Igb3RoZXIgd29yayBvdXRzaWRlXG5cbiAgQFZpZXdDaGlsZCgnbGFzdElucHV0JykgbGFzdElucHV0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdpbnB1dEJveCcpIGlucHV0Qm94OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgdGV4dFN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KClcbiAgcHVibGljIHJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gIHB1YmxpYyB0ZXh0QXJyYXk6IEFycmF5PFRhcmdldEFycmF5SXRlbT4gPSBbXVxuICBwdWJsaWMgdGV4dEhUTUxzdHJpbmc6IHN0cmluZ1xuICBwdWJsaWMgdGVtcFN0cmluZyA9ICcnXG4gIHB1YmxpYyBib3hTaXplOiBTdHJpbmdcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAvLyBUaW1lciB0byBjaGVjayB3aGVuIHRvIHNlbmQgcmVxdWVzdCB0byB0ZXh0IGFuYWx5c2lzXG4gICAgdGhpcy50ZXh0U3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDIwMDApXG4gICAgKS5zdWJzY3JpYmUodGV4dCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdCh0aGlzLnRlbXBTdHJpbmcpO1xuICAgICAgLy8gSWYgd2UncmUgZG9pbmcgbG9jYWwgYW5hbHlzaXMsIGJlZ2luIHRoZSBwcm9jZXNzLCBvdGhlcndpc2UtIHdhaXQgZm9yIHJlc3BvbnNlIGZyb20gc2VydmljZVxuICAgICAgaWYgKHRoaXMubG9jYWxBbmFseXNpcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdExvY2FsbHkoKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4c21hbGwnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1MnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnc21hbGwnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ0wnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbGFyZ2UnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1hMJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3hsYXJnZSdcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ21lZGl1bSdcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RFeHRlcm5hbGx5KClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdibHVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsICdmb2N1c2VkJyk7XG4gICAgfSk7XG4gICAgLy8gRm9jdXMgdGhlIGNhcmV0IGF0IHRoZSBlbmQgb2YgdGhlIGJveFxuICAgIGlmICh0aGlzLmluaXRGb2N1cykge1xuICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCd0YXJnZXRJdGVtcycsIHRoaXMudGFyZ2V0SXRlbXMpO1xuICB9XG4gIC8vIE1ldGhvZCBjYWxsZWQgdXBvbiBhIGtleXN0cm9rZSB0byBiZWdpbiB0aGUgcHJvY2VzcyBvZiB3YWl0aW5nIGZvciBhIDIgc2Vjb25kIHBhdXNlIGluIGtleXN0cm9rZXNcbiAgdGV4dENoYW5nZShlKSB7XG4gICAgdGhpcy50ZW1wU3RyaW5nID0gZTtcbiAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoZSk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aG91dCBsb2NhdGlvbnNcbiAgY29uc3RydWN0TG9jYWxseSgpIHtcbiAgICAvLyBjb25zdCByZWd1bGFyVGV4dENsYXNzID0gdGhpcy5yZWd1bGFyQ2xhc3MgPyB0aGlzLnJlZ3VsYXJDbGFzcyA6ICdyZWdUeHQnO1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyB0aGlzLnJlZ3VsYXJDbGFzcyArICdcIj4nO1xuICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbG9jYWxBbmFseXNpcyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIGFuYWx5c2lzT3V0cHV0ICsgJyA8L3NwYW4+JztcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRoIGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RFeHRlcm5hbGx5KCkge1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyB0aGlzLnJlZ3VsYXJDbGFzcyArICdcIj4nO1xuICAgIGxldCBsb2NhdGlvbkNoZWNrZXIgPSB0cnVlXG4gICAgY29uc3QgZXJyb3JlZEl0ZW1zID0gW11cbiAgICBpZiAodGhpcy50YXJnZXRJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyB0aGlzLnRlbXBTdHJpbmcgKyAnIDwvc3Bhbj4nXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnRhcmdldEl0ZW1zKSB7XG4gICAgICAgIGlmICghaXRlbS5sb2NhdGlvbikge1xuICAgICAgICAgIGVycm9yZWRJdGVtcy5wdXNoKGl0ZW0pXG4gICAgICAgICAgbG9jYXRpb25DaGVja2VyID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxvY2F0aW9uQ2hlY2tlcikge1xuICAgICAgICBjb25zdCBhbmFseXNpc091dHB1dCA9IG1ha2VTdHJpbmcodGhpcy50YXJnZXRJdGVtcywgdGhpcy50ZW1wU3RyaW5nKVxuICAgICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZXJyb3JlZEl0ZW1zVGV4dCA9ICcnXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBlcnJvcmVkSXRlbXMpIHtcbiAgICAgICAgICBlcnJvcmVkSXRlbXNUZXh0ID0gZXJyb3JlZEl0ZW1zVGV4dCArIGl0ZW0udGV4dCArICcgICdcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID1cbiAgICAgICAgICAnQW4gZXJyb3Igb2NjdXJlZC4gIFRoZSBmb2xsb3dpbmcgaXRlbXMgZGlkIG5vdCBoYXZlIGEgdmFsaWQgaWRlbnRpZmllZCBpbmRleCBsb2NhdGlvbjogJyArIGVycm9yZWRJdGVtc1RleHRcbiAgICAgICAgICArICdFaXRoZXIgcHJvdmlkZSBwcm9wZXIgaW5kZXggbG9jYXRpb25zIG9mIGVhY2ggaXRlbSB0byBiZSBoaWdobGlnaHRlZCBvciBzZXQgbG9jYWxBbmFseXNpcyB0byB0cnVlLidcbiAgICAgIH1cbiAgICB9XG5cblxuICB9XG5cblxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMubGFzdElucHV0KSB7XG4gICAgICB0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnBsYWNlQ2FyZXRBdEVuZCh0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZVJhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpXG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSlcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdzZWxlY3RBbGwnLCBmYWxzZSwgbnVsbClcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGxvY2FsQW5hbHlzaXMoc2VhcmNoVGFyZ2V0cywgc3RyLCBjYXNlU2Vuc2l0aXZlKSB7XG4gIGNvbnN0IG91dHB1dCA9IFtdXG4gIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwXG4gICAgbGV0IGluZGV4XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nXG4gICAgfVxuICAgIGxldCBzZWFyY2hpbmdTdHJpbmdcbiAgICBsZXQgc2VhcmNoaW5nVGV4dFxuICAgIGlmICghY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgc2VhcmNoaW5nU3RyaW5nID0gc3RyLnRvTG93ZXJDYXNlKClcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHQudG9Mb3dlckNhc2UoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWFyY2hpbmdTdHJpbmcgPSBzdHJcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHRcbiAgICB9XG4gICAgd2hpbGUgKChpbmRleCA9IHNlYXJjaGluZ1N0cmluZy5pbmRleE9mKHNlYXJjaGluZ1RleHQsIHN0YXJ0SW5kZXgpKSA+IC0xKSB7XG4gICAgICBjb25zdCBpbmRleEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IHN0ci5zdWJzdHJpbmcoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuKSxcbiAgICAgICAgbG9jYXRpb246IFtpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW5dLFxuICAgICAgICBjc3M6IGl0ZW0uY3NzXG4gICAgICB9XG4gICAgICBvdXRwdXQucHVzaChpbmRleEl0ZW0pXG4gICAgICBzdGFydEluZGV4ID0gaW5kZXggKyBzZWFyY2hTdHJMZW47XG4gICAgfVxuICB9XG4gIGlmIChvdXRwdXQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHN0clxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtYWtlU3RyaW5nKG91dHB1dCwgc3RyKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VTdHJpbmcoc2VhcmNoUmVzdWx0cywgb3JpZ2luYWxfdGV4dCkge1xuICBzZWFyY2hSZXN1bHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLmxvY2F0aW9uWzBdIC0gYi5sb2NhdGlvblswXVxuICB9KVxuICBsZXQgZmluYWxUZXh0ID0gJydcbiAgbGV0IHN0YXJ0ID0gMFxuICBsZXQgZW5kID0gc2VhcmNoUmVzdWx0c1swXS5sb2NhdGlvblswXVxuICBsZXQgbWlkZGxlID0gJydcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWFyY2hSZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0YXJ0ID09PSAwKSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKSArXG4gICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCInICsgc2VhcmNoUmVzdWx0c1tpXS5jc3MgKyAnXCI+JyArIHNlYXJjaFJlc3VsdHNbaV0udGV4dCArICc8L3NwYW4+J1xuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXVxuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyAnPHNwYW4gY2xhc3M9XCInICsgc2VhcmNoUmVzdWx0c1tpXS5jc3MgKyAnXCI+JyArIHNlYXJjaFJlc3VsdHNbaV0udGV4dCArICc8L3NwYW4+J1xuICAgIH1cblxuICAgIGlmIChzZWFyY2hSZXN1bHRzW2kgKyAxXSkge1xuICAgICAgbWlkZGxlID0gb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXSwgc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF0pXG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBtaWRkbGVcbiAgICAgIHN0YXJ0ID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF1cbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzFdXG4gICAgfVxuXG4gICAgaWYgKGkgPT09IChzZWFyY2hSZXN1bHRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhlbmQsIG9yaWdpbmFsX3RleHQubGVuZ3RoKVxuICAgIH1cbiAgfVxuICBjb25zb2xlLmxvZyhmaW5hbFRleHQpXG4gIHJldHVybiBmaW5hbFRleHRcbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgfSBmcm9tICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW05nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5nSW5w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