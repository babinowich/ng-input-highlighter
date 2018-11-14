import { Injectable, NgModule, defineInjectable, EventEmitter, Component, Renderer2, Input, Output, ViewChild } from '@angular/core';
import { __values } from 'tslib';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgInputHighlighterService = /** @class */ (function () {
    function NgInputHighlighterService() {
    }
    NgInputHighlighterService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NgInputHighlighterService.ctorParameters = function () { return []; };
    /** @nocollapse */ NgInputHighlighterService.ngInjectableDef = defineInjectable({ factory: function NgInputHighlighterService_Factory() { return new NgInputHighlighterService(); }, token: NgInputHighlighterService, providedIn: "root" });
    return NgInputHighlighterService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgInputHighlighterComponent = /** @class */ (function () {
    function NgInputHighlighterComponent(renderer) {
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
    NgInputHighlighterComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Timer to check when to send request to text analysis
        this.textSubject.pipe(debounceTime(2000)).subscribe(function (text) {
            console.log(text);
            _this.responsePending = true;
            _this.currentText.emit(_this.tempString);
            // If we're doing local analysis, begin the process, otherwise- wait for response from service
            if (_this.localAnalysis) {
                _this.constructLocally();
                setTimeout(function () {
                    _this.responsePending = false;
                    _this.focusInput();
                }, 500);
            }
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        if ((this.targetItems.length > 0) && (!this.localAnalysis)) {
            if (changes["targetItems"]) {
                console.log(changes);
                // if (changes.targetItems.isFirstChange) {
                //   console.log(changes)
                //   console.log('selected to do external analysis strategy')
                // } else {
                // Response came back from service
                this.constructExternally();
                setTimeout(function () {
                    _this.responsePending = false;
                    _this.focusInput();
                }, 500);
                // }
            }
        }
    };
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add event listeners to the DOM elements after rendered, allowing for box-border
        this.renderer.listen(this.lastInput.nativeElement, 'focus', function () {
            _this.renderer.addClass(_this.inputBox.nativeElement, 'focused');
        });
        this.renderer.listen(this.lastInput.nativeElement, 'blur', function () {
            _this.renderer.removeClass(_this.inputBox.nativeElement, 'focused');
        });
        // Focus the caret at the end of the box
        this.focusInput();
        console.log('targetItems', this.targetItems);
    };
    // Method called upon a keystroke to begin the process of waiting for a 2 second pause in keystrokes
    /**
     * @param {?} e
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.textChange = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        this.tempString = e;
        this.textSubject.next(e);
    };
    // Method to construct the html string from an input text array without locations
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.constructLocally = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var regularTextClass = this.regularClass ? this.regularClass : 'regTxt';
        /** @type {?} */
        var beginning = '<span class="' + regularTextClass + '">';
        /** @type {?} */
        var analysisOutput = localAnalysis(this.targetItems, this.tempString, this.caseSensitive);
        this.textHTMLstring = beginning + analysisOutput + ' </span>';
    };
    // Method to construct the html string from an input text array with locations
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.constructExternally = /**
     * @return {?}
     */
    function () {
        var e_1, _a, e_2, _b;
        console.log(this.targetItems, this.tempString);
        /** @type {?} */
        var regularTextClass = this.regularClass ? this.regularClass : 'regTxt';
        /** @type {?} */
        var beginning = '<span class="' + regularTextClass + '">';
        /** @type {?} */
        var locationChecker = true;
        /** @type {?} */
        var erroredItems = [];
        try {
            for (var _c = __values(this.targetItems), _d = _c.next(); !_d.done; _d = _c.next()) {
                var item = _d.value;
                if (!item.location) {
                    erroredItems.push(item);
                    locationChecker = false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (locationChecker) {
            /** @type {?} */
            var analysisOutput = makeString(this.targetItems, this.tempString);
            this.textHTMLstring = beginning + analysisOutput + ' </span>';
        }
        else {
            /** @type {?} */
            var erroredItemsText = '';
            try {
                for (var erroredItems_1 = __values(erroredItems), erroredItems_1_1 = erroredItems_1.next(); !erroredItems_1_1.done; erroredItems_1_1 = erroredItems_1.next()) {
                    var item = erroredItems_1_1.value;
                    erroredItemsText = erroredItemsText + item.text + '  ';
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (erroredItems_1_1 && !erroredItems_1_1.done && (_b = erroredItems_1.return)) _b.call(erroredItems_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.textHTMLstring =
                'An error occured.  The following items did not have a valid identified index location: ' + erroredItemsText
                    + 'Either provide proper index locations of each item to be highlighted or set localAnalysis to true.';
        }
    };
    // ACCESSIBILITY
    // Method to direct the focus of any click to the desired location
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.focusInput = /**
     * @return {?}
     */
    function () {
        console.log('focus');
        if (this.lastInput) {
            this.lastInput.nativeElement.focus();
            this.placeCaretAtEnd(this.lastInput.nativeElement);
        }
    };
    // Method to place the caret focus at the end of the last item of the text array
    /**
     * @param {?} el
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.placeCaretAtEnd = /**
     * @param {?} el
     * @return {?}
     */
    function (el) {
        el.focus();
        if (typeof window.getSelection !== 'undefined'
            && typeof document.createRange !== 'undefined') {
            /** @type {?} */
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            /** @type {?} */
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };
    NgInputHighlighterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lib-ng-input-highlighter',
                    template: "<div #inputBox id=\"input-area\" tabindex=\"0\">\n  <div class=\"text-area\">\n      <span \n        #lastInput\n        autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n        id=\"input-span\" \n        contenteditable\n        [innerHTML]=\"textHTMLstring\"\n        [ngClass]=\"{'pending': responsePending}\"\n        (input)=\"textChange($event.target.textContent)\">\n      </span>\n      <span *ngIf=\"responsePending\" style=\"margin-left:15px\" class=\"spinner spinner-inline\"></span>\n      <span (click)=\"focusInput()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" class=\"rest\"></div>\n</div>",
                    styles: ["#input-area{color:#000;margin-top:10px;background-color:#f3f6fa;border-radius:5px;height:250px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3}"]
                }] }
    ];
    /** @nocollapse */
    NgInputHighlighterComponent.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
    NgInputHighlighterComponent.propDecorators = {
        regularClass: [{ type: Input }],
        targetItems: [{ type: Input }],
        localAnalysis: [{ type: Input }],
        caseSensitive: [{ type: Input }],
        currentText: [{ type: Output }],
        lastInput: [{ type: ViewChild, args: ['lastInput',] }],
        inputBox: [{ type: ViewChild, args: ['inputBox',] }]
    };
    return NgInputHighlighterComponent;
}());
/**
 * @param {?} searchTargets
 * @param {?} str
 * @param {?} caseSensitive
 * @return {?}
 */
function localAnalysis(searchTargets, str, caseSensitive) {
    var e_3, _a, e_4, _b;
    if (caseSensitive) {
        str = str.toLowerCase();
        try {
            for (var searchTargets_1 = __values(searchTargets), searchTargets_1_1 = searchTargets_1.next(); !searchTargets_1_1.done; searchTargets_1_1 = searchTargets_1.next()) {
                var item = searchTargets_1_1.value;
                item.text = item.text.toLowerCase();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (searchTargets_1_1 && !searchTargets_1_1.done && (_a = searchTargets_1.return)) _a.call(searchTargets_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    /** @type {?} */
    var output = [];
    try {
        for (var searchTargets_2 = __values(searchTargets), searchTargets_2_1 = searchTargets_2.next(); !searchTargets_2_1.done; searchTargets_2_1 = searchTargets_2.next()) {
            var item = searchTargets_2_1.value;
            /** @type {?} */
            var startIndex = 0;
            /** @type {?} */
            var index = void 0;
            /** @type {?} */
            var searchStrLen = item.text.length;
            if (searchStrLen === 0) {
                return 'An error occurred. There appears to be no input search string.';
            }
            while ((index = str.indexOf(item.text, startIndex)) > -1) {
                /** @type {?} */
                var indexItem = {
                    text: item.text,
                    location: [index, index + searchStrLen],
                    css: item.css
                };
                output.push(indexItem);
                startIndex = index + searchStrLen;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (searchTargets_2_1 && !searchTargets_2_1.done && (_b = searchTargets_2.return)) _b.call(searchTargets_2);
        }
        finally { if (e_4) throw e_4.error; }
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
    var finalText = '';
    /** @type {?} */
    var start = 0;
    /** @type {?} */
    var end = searchResults[0].location[0];
    /** @type {?} */
    var middle = '';
    for (var i = 0; i < searchResults.length; i++) {
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
var NgInputHighlighterModule = /** @class */ (function () {
    function NgInputHighlighterModule() {
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
    return NgInputHighlighterModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgInputHighlighterService, NgInputHighlighterComponent, NgInputHighlighterModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctaW5wdXQtaGlnaGxpZ2h0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHJlZ3VsYXJDbGFzczogc3RyaW5nID0gbnVsbCAvLyBvcHRpb25hbCBjbGFzcyBmb3IgaW5wdXQgb2Ygc3R5bGUgZm9yIHJlZ3VsYXIgdGV4dCBpbiBib3hcbiAgLy8gQElucHV0KCkgdGFyZ2V0VGV4dEFycmF5OiBBcnJheTxUYXJnZXRBcnJheUl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIG91dHNpZGUgY29tcG9uZW50OiBuZWVkIHRvIGRlZmluZSBzY2hlbWFcbiAgQElucHV0KCkgdGFyZ2V0SXRlbXM6IEFycmF5PFRhcmdldEl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIGluc2lkZSBjb21wb25lbnQ6IGFycmF5IG9mIGl0ZW1zIHRvIGZpbmRcbiAgQElucHV0KCkgbG9jYWxBbmFseXNpcyA9IHRydWVcbiAgQElucHV0KCkgY2FzZVNlbnNpdGl2ZSA9IGZhbHNlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIHNlbGVjdCBjYXNlIHNlbnNpdGl2aXR5LSBkZWZhdWx0IHRvIG9mZlxuICBAT3V0cHV0KCkgY3VycmVudFRleHQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTsgLy8gY3VycmVudCB0ZXh0IHN0cmluZywgd2lsbCBvdXRwdXQgZm9yIGFuYWx5c2lzIG9yIG90aGVyIHdvcmsgb3V0c2lkZVxuXG4gIEBWaWV3Q2hpbGQoJ2xhc3RJbnB1dCcpIGxhc3RJbnB1dDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRCb3gnKSBpbnB1dEJveDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHRleHRTdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpXG4gIHB1YmxpYyByZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICBwdWJsaWMgdGV4dEFycmF5OiBBcnJheTxUYXJnZXRBcnJheUl0ZW0+ID0gW11cbiAgcHVibGljIHRleHRIVE1Mc3RyaW5nOiBzdHJpbmdcbiAgcHVibGljIHRlbXBTdHJpbmcgPSAnJ1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIC8vIFRpbWVyIHRvIGNoZWNrIHdoZW4gdG8gc2VuZCByZXF1ZXN0IHRvIHRleHQgYW5hbHlzaXNcbiAgICB0aGlzLnRleHRTdWJqZWN0LnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMjAwMClcbiAgICApLnN1YnNjcmliZSh0ZXh0ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5jdXJyZW50VGV4dC5lbWl0KHRoaXMudGVtcFN0cmluZyk7XG4gICAgICAvLyBJZiB3ZSdyZSBkb2luZyBsb2NhbCBhbmFseXNpcywgYmVnaW4gdGhlIHByb2Nlc3MsIG90aGVyd2lzZS0gd2FpdCBmb3IgcmVzcG9uc2UgZnJvbSBzZXJ2aWNlXG4gICAgICBpZiAodGhpcy5sb2NhbEFuYWx5c2lzKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TG9jYWxseSgpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKVxuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMudGFyZ2V0SXRlbXMubGVuZ3RoID4gMCkgJiYgKCF0aGlzLmxvY2FsQW5hbHlzaXMpKSB7XG4gICAgICBpZiAoY2hhbmdlcy50YXJnZXRJdGVtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhjaGFuZ2VzKVxuICAgICAgICAvLyBpZiAoY2hhbmdlcy50YXJnZXRJdGVtcy5pc0ZpcnN0Q2hhbmdlKSB7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coY2hhbmdlcylcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgdG8gZG8gZXh0ZXJuYWwgYW5hbHlzaXMgc3RyYXRlZ3knKVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJlc3BvbnNlIGNhbWUgYmFjayBmcm9tIHNlcnZpY2VcbiAgICAgICAgICB0aGlzLmNvbnN0cnVjdEV4dGVybmFsbHkoKVxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgICB9LCA1MDApXG4gICAgICAgIC8vIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdibHVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsICdmb2N1c2VkJyk7XG4gICAgfSk7XG4gICAgLy8gRm9jdXMgdGhlIGNhcmV0IGF0IHRoZSBlbmQgb2YgdGhlIGJveFxuICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgIGNvbnNvbGUubG9nKCd0YXJnZXRJdGVtcycsIHRoaXMudGFyZ2V0SXRlbXMpO1xuICB9XG4gIC8vIE1ldGhvZCBjYWxsZWQgdXBvbiBhIGtleXN0cm9rZSB0byBiZWdpbiB0aGUgcHJvY2VzcyBvZiB3YWl0aW5nIGZvciBhIDIgc2Vjb25kIHBhdXNlIGluIGtleXN0cm9rZXNcbiAgdGV4dENoYW5nZShlKSB7XG4gICAgdGhpcy50ZW1wU3RyaW5nID0gZTtcbiAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoZSk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aG91dCBsb2NhdGlvbnNcbiAgY29uc3RydWN0TG9jYWxseSgpIHtcbiAgICBjb25zdCByZWd1bGFyVGV4dENsYXNzID0gdGhpcy5yZWd1bGFyQ2xhc3MgPyB0aGlzLnJlZ3VsYXJDbGFzcyA6ICdyZWdUeHQnO1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyByZWd1bGFyVGV4dENsYXNzICsgJ1wiPic7XG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZywgdGhpcy5jYXNlU2Vuc2l0aXZlKTtcbiAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy50YXJnZXRJdGVtcywgdGhpcy50ZW1wU3RyaW5nKVxuICAgIGNvbnN0IHJlZ3VsYXJUZXh0Q2xhc3MgPSB0aGlzLnJlZ3VsYXJDbGFzcyA/IHRoaXMucmVndWxhckNsYXNzIDogJ3JlZ1R4dCdcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgcmVndWxhclRleHRDbGFzcyArICdcIj4nXG4gICAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWVcbiAgICBjb25zdCBlcnJvcmVkSXRlbXMgPSBbXVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnRhcmdldEl0ZW1zKSB7XG4gICAgICBpZiAoIWl0ZW0ubG9jYXRpb24pIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSlcbiAgICAgICAgbG9jYXRpb25DaGVja2VyID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGxvY2F0aW9uQ2hlY2tlcikge1xuICAgICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBtYWtlU3RyaW5nKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZylcbiAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyBhbmFseXNpc091dHB1dCArICcgPC9zcGFuPidcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGVycm9yZWRJdGVtc1RleHQgPSAnJ1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICBlcnJvcmVkSXRlbXNUZXh0ID0gZXJyb3JlZEl0ZW1zVGV4dCArIGl0ZW0udGV4dCArICcgICdcbiAgICAgIH1cbiAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPVxuICAgICAgICAnQW4gZXJyb3Igb2NjdXJlZC4gIFRoZSBmb2xsb3dpbmcgaXRlbXMgZGlkIG5vdCBoYXZlIGEgdmFsaWQgaWRlbnRpZmllZCBpbmRleCBsb2NhdGlvbjogJyArIGVycm9yZWRJdGVtc1RleHRcbiAgICAgICAgKyAnRWl0aGVyIHByb3ZpZGUgcHJvcGVyIGluZGV4IGxvY2F0aW9ucyBvZiBlYWNoIGl0ZW0gdG8gYmUgaGlnaGxpZ2h0ZWQgb3Igc2V0IGxvY2FsQW5hbHlzaXMgdG8gdHJ1ZS4nXG4gICAgfVxuXG4gIH1cblxuXG5cbiAgLy8gQUNDRVNTSUJJTElUWVxuICAvLyBNZXRob2QgdG8gZGlyZWN0IHRoZSBmb2N1cyBvZiBhbnkgY2xpY2sgdG8gdGhlIGRlc2lyZWQgbG9jYXRpb25cbiAgZm9jdXNJbnB1dCgpIHtcbiAgICBjb25zb2xlLmxvZygnZm9jdXMnKTtcbiAgICBpZiAodGhpcy5sYXN0SW5wdXQpIHtcbiAgICAgIHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBwbGFjZSB0aGUgY2FyZXQgZm9jdXMgYXQgdGhlIGVuZCBvZiB0aGUgbGFzdCBpdGVtIG9mIHRoZSB0ZXh0IGFycmF5XG4gIHBsYWNlQ2FyZXRBdEVuZChlbCkge1xuICAgIGVsLmZvY3VzKClcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5nZXRTZWxlY3Rpb24gIT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKClcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbClcbiAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpXG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBsb2NhbEFuYWx5c2lzKHNlYXJjaFRhcmdldHMsIHN0ciwgY2FzZVNlbnNpdGl2ZSkge1xuICBpZiAoY2FzZVNlbnNpdGl2ZSkge1xuICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfVxuICB9XG4gIGNvbnN0IG91dHB1dCA9IFtdXG4gIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwXG4gICAgbGV0IGluZGV4XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nXG4gICAgfVxuICAgIHdoaWxlICgoaW5kZXggPSBzdHIuaW5kZXhPZihpdGVtLnRleHQsIHN0YXJ0SW5kZXgpKSA+IC0xKSB7XG4gICAgICBsZXQgaW5kZXhJdGVtID0ge1xuICAgICAgICB0ZXh0OiBpdGVtLnRleHQsXG4gICAgICAgIGxvY2F0aW9uOiBbaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuXSxcbiAgICAgICAgY3NzOiBpdGVtLmNzc1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goaW5kZXhJdGVtKVxuICAgICAgc3RhcnRJbmRleCA9IGluZGV4ICsgc2VhcmNoU3RyTGVuO1xuICAgIH1cbiAgfVxuICAvLyBvdXRwdXQuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gIC8vICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIC8vIH0pXG4gIHJldHVybiBtYWtlU3RyaW5nKG91dHB1dCwgc3RyKVxufVxuXG5mdW5jdGlvbiBtYWtlU3RyaW5nKHNlYXJjaFJlc3VsdHMsIG9yaWdpbmFsX3RleHQpIHtcbiAgc2VhcmNoUmVzdWx0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5sb2NhdGlvblswXSAtIGIubG9jYXRpb25bMF1cbiAgfSlcbiAgbGV0IGZpbmFsVGV4dCA9ICcnXG4gIGxldCBzdGFydCA9IDBcbiAgbGV0IGVuZCA9IHNlYXJjaFJlc3VsdHNbMF0ubG9jYXRpb25bMF1cbiAgbGV0IG1pZGRsZSA9ICcnXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhcmNoUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdGFydCA9PT0gMCkge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZCkgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiJyArIHNlYXJjaFJlc3VsdHNbaV0uY3NzICsgJ1wiPicgKyBzZWFyY2hSZXN1bHRzW2ldLnRleHQgKyAnPC9zcGFuPidcbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV1cbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgJzxzcGFuIGNsYXNzPVwiJyArIHNlYXJjaFJlc3VsdHNbaV0uY3NzICsgJ1wiPicgKyBzZWFyY2hSZXN1bHRzW2ldLnRleHQgKyAnPC9zcGFuPidcbiAgICB9XG5cbiAgICBpZiAoc2VhcmNoUmVzdWx0c1tpICsgMV0pIHtcbiAgICAgIG1pZGRsZSA9IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV0sIHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdKVxuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgbWlkZGxlXG4gICAgICBzdGFydCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblsxXVxuICAgIH1cblxuICAgIGlmIChpID09PSAoc2VhcmNoUmVzdWx0cy5sZW5ndGggLSAxKSkge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoZW5kLCBvcmlnaW5hbF90ZXh0Lmxlbmd0aClcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coZmluYWxUZXh0KVxuICByZXR1cm4gZmluYWxUZXh0XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IH0gZnJvbSAnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX3ZhbHVlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0lBT0U7S0FBaUI7O2dCQUxsQixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7OztvQ0FKRDs7Ozs7Ozs7SUNrQ0UscUNBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7NEJBaEJQLElBQUk7OzJCQUVNLEVBQUU7NkJBQ25CLElBQUk7NkJBQ0osS0FBSzsyQkFDTixJQUFJLFlBQVksRUFBVTsyQkFLWCxJQUFJLE9BQU8sRUFBRTsrQkFDM0IsS0FBSzt5QkFDYSxFQUFFOzBCQUV6QixFQUFFO0tBR3JCOzs7O0lBRUQsOENBQVE7OztJQUFSO1FBQUEsaUJBaUJDOztRQWZDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNuQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQ25CLENBQUMsU0FBUyxD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