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
            _this.renderer.addClass(_this.inputBox.nativeElement, _this.boxFocus);
        });
        this.renderer.listen(this.lastInput.nativeElement, 'blur', function () {
            _this.renderer.removeClass(_this.inputBox.nativeElement, _this.boxFocus);
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
        var beginning = '<span class="' + this.fontClass + '">';
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
        var beginning = '<span class="' + this.fontClass + '">';
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
                    template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"[boxSize, boxClass]\">\n  <div class=\"text-area\" [ngClass]=\"{'pending': responsePending}\">\n    <span \n      #lastInput\n      autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n      id=\"input-span\" \n      contenteditable\n      [innerHTML]=\"textHTMLstring\"\n      [ngClass]=\"fontClass\"\n      (input)=\"textChange($event.target.textContent)\">\n    </span>\n    <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n    <span (click)=\"focusInput()\"  (dblclick)=\"selectAll()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                    styles: ["#input-area{color:#000;margin-top:10px;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.none{background-color:#f3f6fa}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3;color:gray!important}"]
                }] }
    ];
    /** @nocollapse */
    NgInputHighlighterComponent.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
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
    return NgInputHighlighterComponent;
}());
export { NgInputHighlighterComponent };
if (false) {
    /** @type {?} */
    NgInputHighlighterComponent.prototype.targetItems;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.localAnalysis;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxHeight;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.fontClass;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxClass;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxFocus;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBaUIsS0FBSyxFQUE0QixNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDOztJQWtDNUMscUNBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7MkJBckJHLEVBQUU7NkJBQ25CLElBQUk7eUJBQ1IsR0FBRzs7eUJBRUgsYUFBYTt3QkFDZCxNQUFNO3dCQUNOLFNBQVM7eUJBQ1IsSUFBSTs2QkFDQSxLQUFLOzJCQUNOLElBQUksWUFBWSxFQUFVOzJCQUtYLElBQUksT0FBTyxFQUFFOytCQUMzQixLQUFLO3lCQUNhLEVBQUU7MEJBRXpCLEVBQUU7S0FJckI7Ozs7SUFFRCw4Q0FBUTs7O0lBQVI7UUFBQSxpQkE2QkM7O1FBM0JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNuQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQ25CLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztZQUV2QyxJQUFJLEtBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2dCQUN2QixVQUFVLENBQUM7b0JBQ1QsS0FBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUE7b0JBQzVCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtpQkFDbEIsRUFBRSxHQUFHLENBQUMsQ0FBQTthQUNSO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQTtTQUN4QjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7WUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7U0FDdkI7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1NBQ3ZCO2FBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQTtTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUE7U0FDeEI7S0FDRjs7Ozs7SUFFRCxpREFBVzs7OztJQUFYLFVBQVksT0FBc0I7UUFBbEMsaUJBVUM7UUFUQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUMxRCxJQUFJLE9BQU8saUJBQWM7Z0JBQ3ZCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO2dCQUMxQixVQUFVLENBQUM7b0JBQ1QsS0FBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUE7b0JBQzVCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtpQkFDbEIsRUFBRSxHQUFHLENBQUMsQ0FBQTthQUNSO1NBQ0Y7S0FDRjs7OztJQUVELHFEQUFlOzs7SUFBZjtRQUFBLGlCQWFDOztRQVhDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRTtZQUMxRCxLQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDcEUsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFO1lBQ3pELEtBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN2RSxDQUFDLENBQUM7O1FBRUgsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNuQjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM5QztJQUNELG9HQUFvRzs7Ozs7SUFDcEcsZ0RBQVU7Ozs7SUFBVixVQUFXLENBQUM7UUFDVixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxQjtJQUVELGlGQUFpRjs7OztJQUNqRixzREFBZ0I7OztJQUFoQjs7UUFFRSxJQUFNLFNBQVMsR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O1FBQzFELElBQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxHQUFHLGNBQWMsR0FBRyxVQUFVLENBQUM7S0FDL0Q7SUFFRCw4RUFBOEU7Ozs7SUFDOUUseURBQW1COzs7SUFBbkI7OztRQUNFLElBQU0sU0FBUyxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7UUFDMUQsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFBOztRQUMxQixJQUFNLFlBQVksR0FBRyxFQUFFLENBQUE7UUFDdkIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7U0FDL0Q7YUFBTTs7Z0JBQ0wsS0FBbUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxXQUFXLENBQUEsZ0JBQUEsNEJBQUU7b0JBQWhDLElBQU0sSUFBSSxXQUFBO29CQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNsQixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUN2QixlQUFlLEdBQUcsS0FBSyxDQUFBO3FCQUN4QjtpQkFDRjs7Ozs7Ozs7O1lBQ0QsSUFBSSxlQUFlLEVBQUU7O2dCQUNuQixJQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQ3BFLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxHQUFHLGNBQWMsR0FBRyxVQUFVLENBQUE7YUFDOUQ7aUJBQU07O2dCQUNMLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFBOztvQkFDekIsS0FBbUIsSUFBQSxpQkFBQSxpQkFBQSxZQUFZLENBQUEsMENBQUEsb0VBQUU7d0JBQTVCLElBQU0sSUFBSSx5QkFBQTt3QkFDYixnQkFBZ0IsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtxQkFDdkQ7Ozs7Ozs7OztnQkFDRCxJQUFJLENBQUMsY0FBYztvQkFDakIseUZBQXlGLEdBQUcsZ0JBQWdCOzBCQUMxRyxvR0FBb0csQ0FBQTthQUN6RztTQUNGO0tBR0Y7SUFJRCxnQkFBZ0I7SUFDaEIsa0VBQWtFOzs7O0lBQ2xFLGdEQUFVOzs7SUFBVjtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNwRDtLQUNGO0lBRUQsZ0ZBQWdGOzs7OztJQUNoRixxREFBZTs7OztJQUFmLFVBQWdCLEVBQUU7UUFDaEIsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ1YsSUFBSSxPQUFPLE1BQU0sQ0FBQyxZQUFZLEtBQUssV0FBVztlQUN6QyxPQUFPLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxFQUFFOztZQUNoRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7WUFDcEMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7O1lBQ3JCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUNqQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUE7WUFDckIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUNwQjtLQUNGOzs7O0lBRUQsK0NBQVM7OztJQUFUO1FBQ0UsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQy9DOztnQkFsS0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSwwQkFBMEI7b0JBQ3BDLGd3QkFBMEM7O2lCQUUzQzs7OztnQkFYWSxTQUFTOzs7OEJBZW5CLEtBQUs7Z0NBQ0wsS0FBSzs0QkFDTCxLQUFLOzRCQUVMLEtBQUs7MkJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7Z0NBQ0wsS0FBSzs4QkFDTCxNQUFNOzRCQUVOLFNBQVMsU0FBQyxXQUFXOzJCQUNyQixTQUFTLFNBQUMsVUFBVTs7c0NBOUJ2Qjs7U0FnQmEsMkJBQTJCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnS3hDLHVCQUF1QixhQUFhLEVBQUUsR0FBRyxFQUFFLGFBQWE7OztJQUN0RCxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7O1FBQ2pCLEtBQW1CLElBQUEsa0JBQUEsaUJBQUEsYUFBYSxDQUFBLDRDQUFBLHVFQUFFO1lBQTdCLElBQU0sSUFBSSwwQkFBQTs7WUFDYixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUE7O1lBQ2xCLElBQUksS0FBSyxVQUFBOztZQUNULElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3RDLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtnQkFDcEIsT0FBTyxnRUFBZ0UsQ0FBQTthQUMxRTs7WUFDRCxJQUFJLGVBQWUsVUFBQTs7WUFDbkIsSUFBSSxhQUFhLFVBQUE7WUFDakIsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDbEIsZUFBZSxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtnQkFDbkMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7YUFDeEM7aUJBQU07Z0JBQ0wsZUFBZSxHQUFHLEdBQUcsQ0FBQTtnQkFDckIsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7YUFDMUI7WUFDRCxPQUFPLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7O2dCQUN4RSxJQUFNLFNBQVMsR0FBRztvQkFDaEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxZQUFZLENBQUM7b0JBQ2hELFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsWUFBWSxDQUFDO29CQUN2QyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7aUJBQ2QsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUN0QixVQUFVLEdBQUcsS0FBSyxHQUFHLFlBQVksQ0FBQzthQUNuQztTQUNGOzs7Ozs7Ozs7SUFDRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sR0FBRyxDQUFBO0tBQ1g7U0FBTTtRQUNMLE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQTtLQUMvQjtDQUNGOzs7Ozs7QUFFRCxvQkFBb0IsYUFBYSxFQUFFLGFBQWE7SUFDOUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFTLENBQUMsRUFBRSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3JDLENBQUMsQ0FBQTs7SUFDRixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUE7O0lBQ2xCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQTs7SUFDYixJQUFJLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBOztJQUN0QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDZixTQUFTLEdBQUcsU0FBUyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztnQkFDL0MsZUFBZSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFBO1lBQzdGLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ25DO2FBQU07WUFDTCxTQUFTLEdBQUcsU0FBUyxHQUFHLGVBQWUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQTtTQUMxRztRQUVELElBQUksYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN4QixNQUFNLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEcsU0FBUyxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUE7WUFDOUIsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3hDLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUN2QztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNwQyxTQUFTLEdBQUcsU0FBUyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUMzRTtLQUNGO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN0QixPQUFPLFNBQVMsQ0FBQTtDQUNqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctaW5wdXQtaGlnaGxpZ2h0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHRhcmdldEl0ZW1zOiBBcnJheTxUYXJnZXRJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBpbnNpZGUgY29tcG9uZW50OiBhcnJheSBvZiBpdGVtcyB0byBmaW5kXG4gIEBJbnB1dCgpIGxvY2FsQW5hbHlzaXMgPSB0cnVlXG4gIEBJbnB1dCgpIGJveEhlaWdodCA9ICdNJ1xuICAvLyBASW5wdXQoKSBoaWdoQ29udHJhc3QgPSB0cnVlXG4gIEBJbnB1dCgpIGZvbnRDbGFzcyA9ICdyZWd1bGFyVGV4dCcgLy8gb3B0aW9uYWwgY2xhc3MgZm9yIGlucHV0IG9mIHN0eWxlIGZvciByZWd1bGFyIHRleHQgaW4gYm94XG4gIEBJbnB1dCgpIGJveENsYXNzID0gJ25vbmUnXG4gIEBJbnB1dCgpIGJveEZvY3VzID0gJ2ZvY3VzZWQnXG4gIEBJbnB1dCgpIGluaXRGb2N1cyA9IHRydWUgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBmb2N1cyBvbiBjb21wb25lbnQgdGV4dCBib3ggaW5pdGlhbGx5LCByZWNvbW1lbmRlZCBmb3IgYWNjZXNzaWJpbGl0eVxuICBASW5wdXQoKSBjYXNlU2Vuc2l0aXZlID0gZmFsc2U7IC8vIGFsbG93IGZvciBvcHRpb24gdG8gc2VsZWN0IGNhc2Ugc2Vuc2l0aXZpdHktIGRlZmF1bHQgdG8gb2ZmXG4gIEBPdXRwdXQoKSBjdXJyZW50VGV4dCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpOyAvLyBjdXJyZW50IHRleHQgc3RyaW5nLCB3aWxsIG91dHB1dCBmb3IgYW5hbHlzaXMgb3Igb3RoZXIgd29yayBvdXRzaWRlXG5cbiAgQFZpZXdDaGlsZCgnbGFzdElucHV0JykgbGFzdElucHV0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdpbnB1dEJveCcpIGlucHV0Qm94OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgdGV4dFN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KClcbiAgcHVibGljIHJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gIHB1YmxpYyB0ZXh0QXJyYXk6IEFycmF5PFRhcmdldEFycmF5SXRlbT4gPSBbXVxuICBwdWJsaWMgdGV4dEhUTUxzdHJpbmc6IHN0cmluZ1xuICBwdWJsaWMgdGVtcFN0cmluZyA9ICcnXG4gIHB1YmxpYyBib3hTaXplOiBTdHJpbmdcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAvLyBUaW1lciB0byBjaGVjayB3aGVuIHRvIHNlbmQgcmVxdWVzdCB0byB0ZXh0IGFuYWx5c2lzXG4gICAgdGhpcy50ZXh0U3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDIwMDApXG4gICAgKS5zdWJzY3JpYmUodGV4dCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdCh0aGlzLnRlbXBTdHJpbmcpO1xuICAgICAgLy8gSWYgd2UncmUgZG9pbmcgbG9jYWwgYW5hbHlzaXMsIGJlZ2luIHRoZSBwcm9jZXNzLCBvdGhlcndpc2UtIHdhaXQgZm9yIHJlc3BvbnNlIGZyb20gc2VydmljZVxuICAgICAgaWYgKHRoaXMubG9jYWxBbmFseXNpcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdExvY2FsbHkoKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4c21hbGwnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1MnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnc21hbGwnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ0wnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbGFyZ2UnXG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1hMJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3hsYXJnZSdcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ21lZGl1bSdcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RFeHRlcm5hbGx5KClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQsICdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCB0aGlzLmJveEZvY3VzKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCB0aGlzLmJveEZvY3VzKTtcbiAgICB9KTtcbiAgICAvLyBGb2N1cyB0aGUgY2FyZXQgYXQgdGhlIGVuZCBvZiB0aGUgYm94XG4gICAgaWYgKHRoaXMuaW5pdEZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ3RhcmdldEl0ZW1zJywgdGhpcy50YXJnZXRJdGVtcyk7XG4gIH1cbiAgLy8gTWV0aG9kIGNhbGxlZCB1cG9uIGEga2V5c3Ryb2tlIHRvIGJlZ2luIHRoZSBwcm9jZXNzIG9mIHdhaXRpbmcgZm9yIGEgMiBzZWNvbmQgcGF1c2UgaW4ga2V5c3Ryb2tlc1xuICB0ZXh0Q2hhbmdlKGUpIHtcbiAgICB0aGlzLnRlbXBTdHJpbmcgPSBlO1xuICAgIHRoaXMudGV4dFN1YmplY3QubmV4dChlKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRob3V0IGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RMb2NhbGx5KCkge1xuICAgIC8vIGNvbnN0IHJlZ3VsYXJUZXh0Q2xhc3MgPSB0aGlzLnJlZ3VsYXJDbGFzcyA/IHRoaXMucmVndWxhckNsYXNzIDogJ3JlZ1R4dCc7XG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHRoaXMuZm9udENsYXNzICsgJ1wiPic7XG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZywgdGhpcy5jYXNlU2Vuc2l0aXZlKTtcbiAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkoKSB7XG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHRoaXMuZm9udENsYXNzICsgJ1wiPic7XG4gICAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWVcbiAgICBjb25zdCBlcnJvcmVkSXRlbXMgPSBbXVxuICAgIGlmICh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIHRoaXMudGVtcFN0cmluZyArICcgPC9zcGFuPidcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgaWYgKCFpdGVtLmxvY2F0aW9uKSB7XG4gICAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSlcbiAgICAgICAgICBsb2NhdGlvbkNoZWNrZXIgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobG9jYXRpb25DaGVja2VyKSB7XG4gICAgICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbWFrZVN0cmluZyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcpXG4gICAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyBhbmFseXNpc091dHB1dCArICcgPC9zcGFuPidcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBlcnJvcmVkSXRlbXNUZXh0ID0gJydcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICAgIGVycm9yZWRJdGVtc1RleHQgPSBlcnJvcmVkSXRlbXNUZXh0ICsgaXRlbS50ZXh0ICsgJyAgJ1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPVxuICAgICAgICAgICdBbiBlcnJvciBvY2N1cmVkLiAgVGhlIGZvbGxvd2luZyBpdGVtcyBkaWQgbm90IGhhdmUgYSB2YWxpZCBpZGVudGlmaWVkIGluZGV4IGxvY2F0aW9uOiAnICsgZXJyb3JlZEl0ZW1zVGV4dFxuICAgICAgICAgICsgJ0VpdGhlciBwcm92aWRlIHByb3BlciBpbmRleCBsb2NhdGlvbnMgb2YgZWFjaCBpdGVtIHRvIGJlIGhpZ2hsaWdodGVkIG9yIHNldCBsb2NhbEFuYWx5c2lzIHRvIHRydWUuJ1xuICAgICAgfVxuICAgIH1cblxuXG4gIH1cblxuXG5cbiAgLy8gQUNDRVNTSUJJTElUWVxuICAvLyBNZXRob2QgdG8gZGlyZWN0IHRoZSBmb2N1cyBvZiBhbnkgY2xpY2sgdG8gdGhlIGRlc2lyZWQgbG9jYXRpb25cbiAgZm9jdXNJbnB1dCgpIHtcbiAgICBjb25zb2xlLmxvZygnZm9jdXMnKTtcbiAgICBpZiAodGhpcy5sYXN0SW5wdXQpIHtcbiAgICAgIHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBwbGFjZSB0aGUgY2FyZXQgZm9jdXMgYXQgdGhlIGVuZCBvZiB0aGUgbGFzdCBpdGVtIG9mIHRoZSB0ZXh0IGFycmF5XG4gIHBsYWNlQ2FyZXRBdEVuZChlbCkge1xuICAgIGVsLmZvY3VzKClcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5nZXRTZWxlY3Rpb24gIT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKClcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbClcbiAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpXG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICB9XG4gIH1cblxuICBzZWxlY3RBbGwoKSB7XG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ3NlbGVjdEFsbCcsIGZhbHNlLCBudWxsKVxuICB9XG59XG5cblxuZnVuY3Rpb24gbG9jYWxBbmFseXNpcyhzZWFyY2hUYXJnZXRzLCBzdHIsIGNhc2VTZW5zaXRpdmUpIHtcbiAgY29uc3Qgb3V0cHV0ID0gW11cbiAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDBcbiAgICBsZXQgaW5kZXhcbiAgICBjb25zdCBzZWFyY2hTdHJMZW4gPSBpdGVtLnRleHQubGVuZ3RoO1xuICAgIGlmIChzZWFyY2hTdHJMZW4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdBbiBlcnJvciBvY2N1cnJlZC4gVGhlcmUgYXBwZWFycyB0byBiZSBubyBpbnB1dCBzZWFyY2ggc3RyaW5nLidcbiAgICB9XG4gICAgbGV0IHNlYXJjaGluZ1N0cmluZ1xuICAgIGxldCBzZWFyY2hpbmdUZXh0XG4gICAgaWYgKCFjYXNlU2Vuc2l0aXZlKSB7XG4gICAgICBzZWFyY2hpbmdTdHJpbmcgPSBzdHIudG9Mb3dlckNhc2UoKVxuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0clxuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dFxuICAgIH1cbiAgICB3aGlsZSAoKGluZGV4ID0gc2VhcmNoaW5nU3RyaW5nLmluZGV4T2Yoc2VhcmNoaW5nVGV4dCwgc3RhcnRJbmRleCkpID4gLTEpIHtcbiAgICAgIGNvbnN0IGluZGV4SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc3RyLnN1YnN0cmluZyhpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW4pLFxuICAgICAgICBsb2NhdGlvbjogW2luZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbl0sXG4gICAgICAgIGNzczogaXRlbS5jc3NcbiAgICAgIH1cbiAgICAgIG91dHB1dC5wdXNoKGluZGV4SXRlbSlcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgaWYgKG91dHB1dC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gc3RyXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1ha2VTdHJpbmcob3V0cHV0LCBzdHIpXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZVN0cmluZyhzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIH0pXG4gIGxldCBmaW5hbFRleHQgPSAnJ1xuICBsZXQgc3RhcnQgPSAwXG4gIGxldCBlbmQgPSBzZWFyY2hSZXN1bHRzWzBdLmxvY2F0aW9uWzBdXG4gIGxldCBtaWRkbGUgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSlcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG1pZGRsZVxuICAgICAgc3RhcnQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXVxuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMV1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKGZpbmFsVGV4dClcbiAgcmV0dXJuIGZpbmFsVGV4dFxufVxuIl19