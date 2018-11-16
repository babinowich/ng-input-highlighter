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
                template: "<div #inputBox id=\"input-area\" tabindex=\"0\">\n  <div class=\"text-area\">\n      <span \n        #lastInput\n        autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n        id=\"input-span\" \n        contenteditable\n        [innerHTML]=\"textHTMLstring\"\n        [ngClass]=\"{'pending': responsePending}\"\n        (input)=\"textChange($event.target.textContent)\">\n      </span>\n      <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n      <span (click)=\"focusInput()\"  (dblclick)=\"selectAll()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                styles: ["#input-area{color:#000;margin-top:10px;background-color:#f3f6fa;border-radius:5px;height:250px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3}::selection{background:#444782;color:#fff}::-moz-selection{background:#444782;color:#fff}"]
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
    // console.log(output.length)
    if (output.length === 0) {
        console.log("nothing");
        return str;
    }
    else {
        return makeString(output, str);
    }
    // output.sort(function(a, b) {
    //   return a.location[0] - b.location[0]
    // })
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctaW5wdXQtaGlnaGxpZ2h0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHJlZ3VsYXJDbGFzcyA9ICdyZWd1bGFyVGV4dCcgLy8gb3B0aW9uYWwgY2xhc3MgZm9yIGlucHV0IG9mIHN0eWxlIGZvciByZWd1bGFyIHRleHQgaW4gYm94XG4gIEBJbnB1dCgpIHRhcmdldEl0ZW1zOiBBcnJheTxUYXJnZXRJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBpbnNpZGUgY29tcG9uZW50OiBhcnJheSBvZiBpdGVtcyB0byBmaW5kXG4gIEBJbnB1dCgpIGxvY2FsQW5hbHlzaXMgPSB0cnVlXG4gIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBzZWxlY3QgY2FzZSBzZW5zaXRpdml0eS0gZGVmYXVsdCB0byBvZmZcbiAgQE91dHB1dCgpIGN1cnJlbnRUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7IC8vIGN1cnJlbnQgdGV4dCBzdHJpbmcsIHdpbGwgb3V0cHV0IGZvciBhbmFseXNpcyBvciBvdGhlciB3b3JrIG91dHNpZGVcblxuICBAVmlld0NoaWxkKCdsYXN0SW5wdXQnKSBsYXN0SW5wdXQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Qm94JykgaW5wdXRCb3g6IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSB0ZXh0U3ViamVjdDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKVxuICBwdWJsaWMgcmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgcHVibGljIHRleHRBcnJheTogQXJyYXk8VGFyZ2V0QXJyYXlJdGVtPiA9IFtdXG4gIHB1YmxpYyB0ZXh0SFRNTHN0cmluZzogc3RyaW5nXG4gIHB1YmxpYyB0ZW1wU3RyaW5nID0gJydcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAvLyBUaW1lciB0byBjaGVjayB3aGVuIHRvIHNlbmQgcmVxdWVzdCB0byB0ZXh0IGFuYWx5c2lzXG4gICAgdGhpcy50ZXh0U3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDIwMDApXG4gICAgKS5zdWJzY3JpYmUodGV4dCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdCh0aGlzLnRlbXBTdHJpbmcpO1xuICAgICAgLy8gSWYgd2UncmUgZG9pbmcgbG9jYWwgYW5hbHlzaXMsIGJlZ2luIHRoZSBwcm9jZXNzLCBvdGhlcndpc2UtIHdhaXQgZm9yIHJlc3BvbnNlIGZyb20gc2VydmljZVxuICAgICAgaWYgKHRoaXMubG9jYWxBbmFseXNpcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdExvY2FsbHkoKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RFeHRlcm5hbGx5KClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdibHVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsICdmb2N1c2VkJyk7XG4gICAgfSk7XG4gICAgLy8gRm9jdXMgdGhlIGNhcmV0IGF0IHRoZSBlbmQgb2YgdGhlIGJveFxuICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgIGNvbnNvbGUubG9nKCd0YXJnZXRJdGVtcycsIHRoaXMudGFyZ2V0SXRlbXMpO1xuICB9XG4gIC8vIE1ldGhvZCBjYWxsZWQgdXBvbiBhIGtleXN0cm9rZSB0byBiZWdpbiB0aGUgcHJvY2VzcyBvZiB3YWl0aW5nIGZvciBhIDIgc2Vjb25kIHBhdXNlIGluIGtleXN0cm9rZXNcbiAgdGV4dENoYW5nZShlKSB7XG4gICAgdGhpcy50ZW1wU3RyaW5nID0gZTtcbiAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoZSk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aG91dCBsb2NhdGlvbnNcbiAgY29uc3RydWN0TG9jYWxseSgpIHtcbiAgICAvLyBjb25zdCByZWd1bGFyVGV4dENsYXNzID0gdGhpcy5yZWd1bGFyQ2xhc3MgPyB0aGlzLnJlZ3VsYXJDbGFzcyA6ICdyZWdUeHQnO1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyB0aGlzLnJlZ3VsYXJDbGFzcyArICdcIj4nO1xuICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbG9jYWxBbmFseXNpcyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIGFuYWx5c2lzT3V0cHV0ICsgJyA8L3NwYW4+JztcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRoIGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RFeHRlcm5hbGx5KCkge1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyB0aGlzLnJlZ3VsYXJDbGFzcyArICdcIj4nO1xuICAgIGxldCBsb2NhdGlvbkNoZWNrZXIgPSB0cnVlXG4gICAgY29uc3QgZXJyb3JlZEl0ZW1zID0gW11cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy50YXJnZXRJdGVtcykge1xuICAgICAgaWYgKCFpdGVtLmxvY2F0aW9uKSB7XG4gICAgICAgIGVycm9yZWRJdGVtcy5wdXNoKGl0ZW0pXG4gICAgICAgIGxvY2F0aW9uQ2hlY2tlciA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsb2NhdGlvbkNoZWNrZXIpIHtcbiAgICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbWFrZVN0cmluZyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcpXG4gICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBlcnJvcmVkSXRlbXNUZXh0ID0gJydcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBlcnJvcmVkSXRlbXMpIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zVGV4dCA9IGVycm9yZWRJdGVtc1RleHQgKyBpdGVtLnRleHQgKyAnICAnXG4gICAgICB9XG4gICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID1cbiAgICAgICAgJ0FuIGVycm9yIG9jY3VyZWQuICBUaGUgZm9sbG93aW5nIGl0ZW1zIGRpZCBub3QgaGF2ZSBhIHZhbGlkIGlkZW50aWZpZWQgaW5kZXggbG9jYXRpb246ICcgKyBlcnJvcmVkSXRlbXNUZXh0XG4gICAgICAgICsgJ0VpdGhlciBwcm92aWRlIHByb3BlciBpbmRleCBsb2NhdGlvbnMgb2YgZWFjaCBpdGVtIHRvIGJlIGhpZ2hsaWdodGVkIG9yIHNldCBsb2NhbEFuYWx5c2lzIHRvIHRydWUuJ1xuICAgIH1cblxuICB9XG5cblxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMubGFzdElucHV0KSB7XG4gICAgICB0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnBsYWNlQ2FyZXRBdEVuZCh0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZVJhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpXG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSlcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdzZWxlY3RBbGwnLCBmYWxzZSwgbnVsbClcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGxvY2FsQW5hbHlzaXMoc2VhcmNoVGFyZ2V0cywgc3RyLCBjYXNlU2Vuc2l0aXZlKSB7XG4gIGlmIChjYXNlU2Vuc2l0aXZlKSB7XG4gICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKClcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoVGFyZ2V0cykge1xuICAgICAgaXRlbS50ZXh0ID0gaXRlbS50ZXh0LnRvTG93ZXJDYXNlKClcbiAgICB9XG4gIH1cbiAgY29uc3Qgb3V0cHV0ID0gW11cbiAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDBcbiAgICBsZXQgaW5kZXhcbiAgICBjb25zdCBzZWFyY2hTdHJMZW4gPSBpdGVtLnRleHQubGVuZ3RoO1xuICAgIGlmIChzZWFyY2hTdHJMZW4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdBbiBlcnJvciBvY2N1cnJlZC4gVGhlcmUgYXBwZWFycyB0byBiZSBubyBpbnB1dCBzZWFyY2ggc3RyaW5nLidcbiAgICB9XG4gICAgd2hpbGUgKChpbmRleCA9IHN0ci5pbmRleE9mKGl0ZW0udGV4dCwgc3RhcnRJbmRleCkpID4gLTEpIHtcbiAgICAgIGxldCBpbmRleEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IGl0ZW0udGV4dCxcbiAgICAgICAgbG9jYXRpb246IFtpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW5dLFxuICAgICAgICBjc3M6IGl0ZW0uY3NzXG4gICAgICB9XG4gICAgICBvdXRwdXQucHVzaChpbmRleEl0ZW0pXG4gICAgICBzdGFydEluZGV4ID0gaW5kZXggKyBzZWFyY2hTdHJMZW47XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUubG9nKG91dHB1dC5sZW5ndGgpXG4gIGlmIChvdXRwdXQubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc29sZS5sb2coXCJub3RoaW5nXCIpXG4gICAgcmV0dXJuIHN0clxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtYWtlU3RyaW5nKG91dHB1dCwgc3RyKVxuICB9XG4gIC8vIG91dHB1dC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgLy8gICByZXR1cm4gYS5sb2NhdGlvblswXSAtIGIubG9jYXRpb25bMF1cbiAgLy8gfSlcbn1cblxuZnVuY3Rpb24gbWFrZVN0cmluZyhzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIH0pXG4gIGxldCBmaW5hbFRleHQgPSAnJ1xuICBsZXQgc3RhcnQgPSAwXG4gIGxldCBlbmQgPSBzZWFyY2hSZXN1bHRzWzBdLmxvY2F0aW9uWzBdXG4gIGxldCBtaWRkbGUgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSlcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG1pZGRsZVxuICAgICAgc3RhcnQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXVxuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMV1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKGZpbmFsVGV4dClcbiAgcmV0dXJuIGZpbmFsVGV4dFxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCB9IGZyb20gJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0lBT0UsaUJBQWlCOzs7WUFMbEIsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7Ozs7Ozs7O0FDSkQ7Ozs7SUFpQ0UsWUFBb0IsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVzs0QkFmZixhQUFhOzJCQUNLLEVBQUU7NkJBQ25CLElBQUk7NkJBQ0osS0FBSzsyQkFDTixJQUFJLFlBQVksRUFBVTsyQkFLWCxJQUFJLE9BQU8sRUFBRTsrQkFDM0IsS0FBSzt5QkFDYSxFQUFFOzBCQUV6QixFQUFFO0tBR3JCOzs7O0lBRUQsUUFBUTs7UUFFTixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDbkIsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUNuQixDQUFDLFNBQVMsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O1lBRXZDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7Z0JBQ3ZCLFVBQVUsQ0FBQztvQkFDVCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQTtvQkFDNUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO2lCQUNsQixFQUFFLEdBQUcsQ0FBQyxDQUFBO2FBQ1I7U0FDRixDQUFDLENBQUE7S0FDSDs7Ozs7SUFF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