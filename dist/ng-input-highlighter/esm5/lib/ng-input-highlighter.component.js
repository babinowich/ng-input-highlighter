/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ViewChild, Renderer2, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
var NgInputHighlighterComponent = /** @class */ (function () {
    function NgInputHighlighterComponent(renderer) {
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
                this.constructExternally();
                setTimeout(function () {
                    _this.responsePending = false;
                    _this.focusInput();
                }, 500);
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
        if (this.initFocus) {
            this.focusInput();
        }
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
        var beginning = '<span class="' + this.regularClass + '">';
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
        /** @type {?} */
        var beginning = '<span class="' + this.regularClass + '">';
        /** @type {?} */
        var locationChecker = true;
        /** @type {?} */
        var erroredItems = [];
        if (this.targetItems.length === 0) {
            this.textHTMLstring = beginning + this.tempString + ' </span>';
        }
        else {
            try {
                for (var _c = tslib_1.__values(this.targetItems), _d = _c.next(); !_d.done; _d = _c.next()) {
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
                    for (var erroredItems_1 = tslib_1.__values(erroredItems), erroredItems_1_1 = erroredItems_1.next(); !erroredItems_1_1.done; erroredItems_1_1 = erroredItems_1.next()) {
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
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.selectAll = /**
     * @return {?}
     */
    function () {
        document.execCommand('selectAll', false, null);
    };
    NgInputHighlighterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lib-ng-input-highlighter',
                    template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"boxSize\">\n  <div class=\"text-area\">\n      <span \n        #lastInput\n        autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n        id=\"input-span\" \n        contenteditable\n        [innerHTML]=\"textHTMLstring\"\n        [ngClass]=\"{'pending': responsePending}\"\n        (input)=\"textChange($event.target.textContent)\">\n      </span>\n      <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n      <span (click)=\"focusInput()\"  (dblclick)=\"selectAll()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                    styles: ["#input-area{color:#000;margin-top:10px;background-color:#f3f6fa;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3}::selection{background:#444782;color:#fff}::-moz-selection{background:#444782;color:#fff}"]
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
        boxHeight: [{ type: Input }],
        initFocus: [{ type: Input }],
        caseSensitive: [{ type: Input }],
        currentText: [{ type: Output }],
        lastInput: [{ type: ViewChild, args: ['lastInput',] }],
        inputBox: [{ type: ViewChild, args: ['inputBox',] }]
    };
    return NgInputHighlighterComponent;
}());
export { NgInputHighlighterComponent };
if (false) {
    /** @type {?} */
    NgInputHighlighterComponent.prototype.regularClass;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.targetItems;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.localAnalysis;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxHeight;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.initFocus;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.caseSensitive;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.currentText;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.lastInput;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.inputBox;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.textSubject;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.responsePending;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.textArray;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.textHTMLstring;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.tempString;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxSize;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.renderer;
}
/**
 * @param {?} searchTargets
 * @param {?} str
 * @param {?} caseSensitive
 * @return {?}
 */
function localAnalysis(searchTargets, str, caseSensitive) {
    var e_3, _a;
    /** @type {?} */
    var output = [];
    try {
        for (var searchTargets_1 = tslib_1.__values(searchTargets), searchTargets_1_1 = searchTargets_1.next(); !searchTargets_1_1.done; searchTargets_1_1 = searchTargets_1.next()) {
            var item = searchTargets_1_1.value;
            /** @type {?} */
            var startIndex = 0;
            /** @type {?} */
            var index = void 0;
            /** @type {?} */
            var searchStrLen = item.text.length;
            if (searchStrLen === 0) {
                return 'An error occurred. There appears to be no input search string.';
            }
            /** @type {?} */
            var searchingString = void 0;
            /** @type {?} */
            var searchingText = void 0;
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
                var indexItem = {
                    text: str.substring(index, index + searchStrLen),
                    location: [index, index + searchStrLen],
                    css: item.css
                };
                output.push(indexItem);
                startIndex = index + searchStrLen;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (searchTargets_1_1 && !searchTargets_1_1.done && (_a = searchTargets_1.return)) _a.call(searchTargets_1);
        }
        finally { if (e_3) throw e_3.error; }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBaUIsS0FBSyxFQUE0QixNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDOztJQWdDNUMscUNBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7NEJBbkJmLGFBQWE7MkJBQ0ssRUFBRTs2QkFDbkIsSUFBSTt5QkFDUixHQUFHOzt5QkFFSCxJQUFJOzZCQUNBLEtBQUs7MkJBQ04sSUFBSSxZQUFZLEVBQVU7MkJBS1gsSUFBSSxPQUFPLEVBQUU7K0JBQzNCLEtBQUs7eUJBQ2EsRUFBRTswQkFFekIsRUFBRTtLQUlyQjs7OztJQUVELDhDQUFROzs7SUFBUjtRQUFBLGlCQTZCQzs7UUEzQkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FDbkIsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixLQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O1lBRXZDLElBQUksS0FBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7Z0JBQ3ZCLFVBQVUs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QyxDQUFDLENBQUMsQ0FBQTtTQUNuQzthQUFNO1lBQ0wsU0FBUyxHQUFHLFNBQVMsR0FBRyxlQUFlLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUE7U0FDMUc7UUFFRCxJQUFJLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2hHLFNBQVMsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFBO1lBQzlCLEtBQUssR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN4QyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDdkM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDcEMsU0FBUyxHQUFHLFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDM0U7S0FDRjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsT0FBTyxTQUFTLENBQUE7Q0FDakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFRhcmdldEFycmF5SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRUZXh0SXRlbS5jbGFzcyc7XG5pbXBvcnQgeyBUYXJnZXRJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldEl0ZW1zLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5nLWlucHV0LWhpZ2hsaWdodGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSByZWd1bGFyQ2xhc3MgPSAncmVndWxhclRleHQnIC8vIG9wdGlvbmFsIGNsYXNzIGZvciBpbnB1dCBvZiBzdHlsZSBmb3IgcmVndWxhciB0ZXh0IGluIGJveFxuICBASW5wdXQoKSB0YXJnZXRJdGVtczogQXJyYXk8VGFyZ2V0SXRlbT4gPSBbXTsgLy8gYW5hbHlzaXMgaW5zaWRlIGNvbXBvbmVudDogYXJyYXkgb2YgaXRlbXMgdG8gZmluZFxuICBASW5wdXQoKSBsb2NhbEFuYWx5c2lzID0gdHJ1ZVxuICBASW5wdXQoKSBib3hIZWlnaHQgPSAnTSdcbiAgLy8gQElucHV0KCkgaGlnaENvbnRyYXN0ID0gdHJ1ZVxuICBASW5wdXQoKSBpbml0Rm9jdXMgPSB0cnVlIC8vIGFsbG93IGZvciBvcHRpb24gdG8gZm9jdXMgb24gY29tcG9uZW50IHRleHQgYm94IGluaXRpYWxseSwgcmVjb21tZW5kZWQgZm9yIGFjY2Vzc2liaWxpdHlcbiAgQElucHV0KCkgY2FzZVNlbnNpdGl2ZSA9IGZhbHNlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIHNlbGVjdCBjYXNlIHNlbnNpdGl2aXR5LSBkZWZhdWx0IHRvIG9mZlxuICBAT3V0cHV0KCkgY3VycmVudFRleHQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTsgLy8gY3VycmVudCB0ZXh0IHN0cmluZywgd2lsbCBvdXRwdXQgZm9yIGFuYWx5c2lzIG9yIG90aGVyIHdvcmsgb3V0c2lkZVxuXG4gIEBWaWV3Q2hpbGQoJ2xhc3RJbnB1dCcpIGxhc3RJbnB1dDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRCb3gnKSBpbnB1dEJveDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHRleHRTdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpXG4gIHB1YmxpYyByZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICBwdWJsaWMgdGV4dEFycmF5OiBBcnJheTxUYXJnZXRBcnJheUl0ZW0+ID0gW11cbiAgcHVibGljIHRleHRIVE1Mc3RyaW5nOiBzdHJpbmdcbiAgcHVibGljIHRlbXBTdHJpbmcgPSAnJ1xuICBwdWJsaWMgYm94U2l6ZTogU3RyaW5nXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgLy8gVGltZXIgdG8gY2hlY2sgd2hlbiB0byBzZW5kIHJlcXVlc3QgdG8gdGV4dCBhbmFseXNpc1xuICAgIHRoaXMudGV4dFN1YmplY3QucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgyMDAwKVxuICAgICkuc3Vic2NyaWJlKHRleHQgPT4ge1xuICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmN1cnJlbnRUZXh0LmVtaXQodGhpcy50ZW1wU3RyaW5nKTtcbiAgICAgIC8vIElmIHdlJ3JlIGRvaW5nIGxvY2FsIGFuYWx5c2lzLCBiZWdpbiB0aGUgcHJvY2Vzcywgb3RoZXJ3aXNlLSB3YWl0IGZvciByZXNwb25zZSBmcm9tIHNlcnZpY2VcbiAgICAgIGlmICh0aGlzLmxvY2FsQW5hbHlzaXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RMb2NhbGx5KClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnWFMnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAneHNtYWxsJ1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdTJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3NtYWxsJ1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdMJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ2xhcmdlJ1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYTCcpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4bGFyZ2UnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdtZWRpdW0nXG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgodGhpcy50YXJnZXRJdGVtcy5sZW5ndGggPiAwKSAmJiAoIXRoaXMubG9jYWxBbmFseXNpcykpIHtcbiAgICAgIGlmIChjaGFuZ2VzLnRhcmdldEl0ZW1zKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0RXh0ZXJuYWxseSgpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKVxuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIERPTSBlbGVtZW50cyBhZnRlciByZW5kZXJlZCwgYWxsb3dpbmcgZm9yIGJveC1ib3JkZXJcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnZm9jdXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgJ2ZvY3VzZWQnKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIC8vIEZvY3VzIHRoZSBjYXJldCBhdCB0aGUgZW5kIG9mIHRoZSBib3hcbiAgICBpZiAodGhpcy5pbml0Rm9jdXMpIHtcbiAgICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygndGFyZ2V0SXRlbXMnLCB0aGlzLnRhcmdldEl0ZW1zKTtcbiAgfVxuICAvLyBNZXRob2QgY2FsbGVkIHVwb24gYSBrZXlzdHJva2UgdG8gYmVnaW4gdGhlIHByb2Nlc3Mgb2Ygd2FpdGluZyBmb3IgYSAyIHNlY29uZCBwYXVzZSBpbiBrZXlzdHJva2VzXG4gIHRleHRDaGFuZ2UoZSkge1xuICAgIHRoaXMudGVtcFN0cmluZyA9IGU7XG4gICAgdGhpcy50ZXh0U3ViamVjdC5uZXh0KGUpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGhvdXQgbG9jYXRpb25zXG4gIGNvbnN0cnVjdExvY2FsbHkoKSB7XG4gICAgLy8gY29uc3QgcmVndWxhclRleHRDbGFzcyA9IHRoaXMucmVndWxhckNsYXNzID8gdGhpcy5yZWd1bGFyQ2xhc3MgOiAncmVnVHh0JztcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgdGhpcy5yZWd1bGFyQ2xhc3MgKyAnXCI+JztcbiAgICBjb25zdCBhbmFseXNpc091dHB1dCA9IGxvY2FsQW5hbHlzaXModGhpcy50YXJnZXRJdGVtcywgdGhpcy50ZW1wU3RyaW5nLCB0aGlzLmNhc2VTZW5zaXRpdmUpO1xuICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyBhbmFseXNpc091dHB1dCArICcgPC9zcGFuPic7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aCBsb2NhdGlvbnNcbiAgY29uc3RydWN0RXh0ZXJuYWxseSgpIHtcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgdGhpcy5yZWd1bGFyQ2xhc3MgKyAnXCI+JztcbiAgICBsZXQgbG9jYXRpb25DaGVja2VyID0gdHJ1ZVxuICAgIGNvbnN0IGVycm9yZWRJdGVtcyA9IFtdXG4gICAgaWYgKHRoaXMudGFyZ2V0SXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgdGhpcy50ZW1wU3RyaW5nICsgJyA8L3NwYW4+J1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy50YXJnZXRJdGVtcykge1xuICAgICAgICBpZiAoIWl0ZW0ubG9jYXRpb24pIHtcbiAgICAgICAgICBlcnJvcmVkSXRlbXMucHVzaChpdGVtKVxuICAgICAgICAgIGxvY2F0aW9uQ2hlY2tlciA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsb2NhdGlvbkNoZWNrZXIpIHtcbiAgICAgICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBtYWtlU3RyaW5nKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZylcbiAgICAgICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIGFuYWx5c2lzT3V0cHV0ICsgJyA8L3NwYW4+J1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGVycm9yZWRJdGVtc1RleHQgPSAnJ1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZXJyb3JlZEl0ZW1zKSB7XG4gICAgICAgICAgZXJyb3JlZEl0ZW1zVGV4dCA9IGVycm9yZWRJdGVtc1RleHQgKyBpdGVtLnRleHQgKyAnICAnXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9XG4gICAgICAgICAgJ0FuIGVycm9yIG9jY3VyZWQuICBUaGUgZm9sbG93aW5nIGl0ZW1zIGRpZCBub3QgaGF2ZSBhIHZhbGlkIGlkZW50aWZpZWQgaW5kZXggbG9jYXRpb246ICcgKyBlcnJvcmVkSXRlbXNUZXh0XG4gICAgICAgICAgKyAnRWl0aGVyIHByb3ZpZGUgcHJvcGVyIGluZGV4IGxvY2F0aW9ucyBvZiBlYWNoIGl0ZW0gdG8gYmUgaGlnaGxpZ2h0ZWQgb3Igc2V0IGxvY2FsQW5hbHlzaXMgdG8gdHJ1ZS4nXG4gICAgICB9XG4gICAgfVxuXG5cbiAgfVxuXG5cblxuICAvLyBBQ0NFU1NJQklMSVRZXG4gIC8vIE1ldGhvZCB0byBkaXJlY3QgdGhlIGZvY3VzIG9mIGFueSBjbGljayB0byB0aGUgZGVzaXJlZCBsb2NhdGlvblxuICBmb2N1c0lucHV0KCkge1xuICAgIGNvbnNvbGUubG9nKCdmb2N1cycpO1xuICAgIGlmICh0aGlzLmxhc3RJbnB1dCkge1xuICAgICAgdGhpcy5sYXN0SW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wbGFjZUNhcmV0QXRFbmQodGhpcy5sYXN0SW5wdXQubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHBsYWNlIHRoZSBjYXJldCBmb2N1cyBhdCB0aGUgZW5kIG9mIHRoZSBsYXN0IGl0ZW0gb2YgdGhlIHRleHQgYXJyYXlcbiAgcGxhY2VDYXJldEF0RW5kKGVsKSB7XG4gICAgZWwuZm9jdXMoKVxuICAgIGlmICh0eXBlb2Ygd2luZG93LmdldFNlbGVjdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVSYW5nZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKVxuICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsKVxuICAgICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpXG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKVxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEFsbCgpIHtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnc2VsZWN0QWxsJywgZmFsc2UsIG51bGwpXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBsb2NhbEFuYWx5c2lzKHNlYXJjaFRhcmdldHMsIHN0ciwgY2FzZVNlbnNpdGl2ZSkge1xuICBjb25zdCBvdXRwdXQgPSBbXVxuICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoVGFyZ2V0cykge1xuICAgIGxldCBzdGFydEluZGV4ID0gMFxuICAgIGxldCBpbmRleFxuICAgIGNvbnN0IHNlYXJjaFN0ckxlbiA9IGl0ZW0udGV4dC5sZW5ndGg7XG4gICAgaWYgKHNlYXJjaFN0ckxlbiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ0FuIGVycm9yIG9jY3VycmVkLiBUaGVyZSBhcHBlYXJzIHRvIGJlIG5vIGlucHV0IHNlYXJjaCBzdHJpbmcuJ1xuICAgIH1cbiAgICBsZXQgc2VhcmNoaW5nU3RyaW5nXG4gICAgbGV0IHNlYXJjaGluZ1RleHRcbiAgICBpZiAoIWNhc2VTZW5zaXRpdmUpIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0ci50b0xvd2VyQ2FzZSgpXG4gICAgICBzZWFyY2hpbmdUZXh0ID0gaXRlbS50ZXh0LnRvTG93ZXJDYXNlKClcbiAgICB9IGVsc2Uge1xuICAgICAgc2VhcmNoaW5nU3RyaW5nID0gc3RyXG4gICAgICBzZWFyY2hpbmdUZXh0ID0gaXRlbS50ZXh0XG4gICAgfVxuICAgIHdoaWxlICgoaW5kZXggPSBzZWFyY2hpbmdTdHJpbmcuaW5kZXhPZihzZWFyY2hpbmdUZXh0LCBzdGFydEluZGV4KSkgPiAtMSkge1xuICAgICAgY29uc3QgaW5kZXhJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzdHIuc3Vic3RyaW5nKGluZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbiksXG4gICAgICAgIGxvY2F0aW9uOiBbaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuXSxcbiAgICAgICAgY3NzOiBpdGVtLmNzc1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goaW5kZXhJdGVtKVxuICAgICAgc3RhcnRJbmRleCA9IGluZGV4ICsgc2VhcmNoU3RyTGVuO1xuICAgIH1cbiAgfVxuICBpZiAob3V0cHV0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBzdHJcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbWFrZVN0cmluZyhvdXRwdXQsIHN0cilcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlU3RyaW5nKHNlYXJjaFJlc3VsdHMsIG9yaWdpbmFsX3RleHQpIHtcbiAgc2VhcmNoUmVzdWx0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5sb2NhdGlvblswXSAtIGIubG9jYXRpb25bMF1cbiAgfSlcbiAgbGV0IGZpbmFsVGV4dCA9ICcnXG4gIGxldCBzdGFydCA9IDBcbiAgbGV0IGVuZCA9IHNlYXJjaFJlc3VsdHNbMF0ubG9jYXRpb25bMF1cbiAgbGV0IG1pZGRsZSA9ICcnXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhcmNoUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdGFydCA9PT0gMCkge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZCkgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiJyArIHNlYXJjaFJlc3VsdHNbaV0uY3NzICsgJ1wiPicgKyBzZWFyY2hSZXN1bHRzW2ldLnRleHQgKyAnPC9zcGFuPidcbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV1cbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgJzxzcGFuIGNsYXNzPVwiJyArIHNlYXJjaFJlc3VsdHNbaV0uY3NzICsgJ1wiPicgKyBzZWFyY2hSZXN1bHRzW2ldLnRleHQgKyAnPC9zcGFuPidcbiAgICB9XG5cbiAgICBpZiAoc2VhcmNoUmVzdWx0c1tpICsgMV0pIHtcbiAgICAgIG1pZGRsZSA9IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV0sIHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdKVxuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgbWlkZGxlXG4gICAgICBzdGFydCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblsxXVxuICAgIH1cblxuICAgIGlmIChpID09PSAoc2VhcmNoUmVzdWx0cy5sZW5ndGggLSAxKSkge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0ICsgb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoZW5kLCBvcmlnaW5hbF90ZXh0Lmxlbmd0aClcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coZmluYWxUZXh0KVxuICByZXR1cm4gZmluYWxUZXh0XG59XG4iXX0=