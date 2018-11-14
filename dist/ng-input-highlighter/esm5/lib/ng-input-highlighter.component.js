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
export { NgInputHighlighterComponent };
if (false) {
    /** @type {?} */
    NgInputHighlighterComponent.prototype.regularClass;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.targetItems;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.localAnalysis;
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
    NgInputHighlighterComponent.prototype.renderer;
}
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
            for (var searchTargets_1 = tslib_1.__values(searchTargets), searchTargets_1_1 = searchTargets_1.next(); !searchTargets_1_1.done; searchTargets_1_1 = searchTargets_1.next()) {
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
        for (var searchTargets_2 = tslib_1.__values(searchTargets), searchTargets_2_1 = searchTargets_2.next(); !searchTargets_2_1.done; searchTargets_2_1 = searchTargets_2.next()) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBaUIsS0FBSyxFQUE0QixNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDOztJQTZCNUMscUNBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7NEJBaEJQLElBQUk7OzJCQUVNLEVBQUU7NkJBQ25CLElBQUk7NkJBQ0osS0FBSzsyQkFDTixJQUFJLFlBQVksRUFBVTsyQkFLWCxJQUFJLE9BQU8sRUFBRTsrQkFDM0IsS0FBSzt5QkFDYSxFQUFFOzBCQUV6QixFQUFFO0tBR3JCOzs7O0lBRUQsOENBQVE7OztJQUFSO1FBQUEsaUJBaUJDOztRQWZDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNuQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQ25CLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztZQUV2QyxJQUFJLEtBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2dCQUN2QixVQUFVLENBQUM7b0JBQ1QsS0FBSSxDQUFDLGVB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LENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDdkM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDcEMsU0FBUyxHQUFHLFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDM0U7S0FDRjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsT0FBTyxTQUFTLENBQUE7Q0FDakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFRhcmdldEFycmF5SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRUZXh0SXRlbS5jbGFzcyc7XG5pbXBvcnQgeyBUYXJnZXRJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldEl0ZW1zLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5nLWlucHV0LWhpZ2hsaWdodGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSByZWd1bGFyQ2xhc3M6IHN0cmluZyA9IG51bGwgLy8gb3B0aW9uYWwgY2xhc3MgZm9yIGlucHV0IG9mIHN0eWxlIGZvciByZWd1bGFyIHRleHQgaW4gYm94XG4gIC8vIEBJbnB1dCgpIHRhcmdldFRleHRBcnJheTogQXJyYXk8VGFyZ2V0QXJyYXlJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBvdXRzaWRlIGNvbXBvbmVudDogbmVlZCB0byBkZWZpbmUgc2NoZW1hXG4gIEBJbnB1dCgpIHRhcmdldEl0ZW1zOiBBcnJheTxUYXJnZXRJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBpbnNpZGUgY29tcG9uZW50OiBhcnJheSBvZiBpdGVtcyB0byBmaW5kXG4gIEBJbnB1dCgpIGxvY2FsQW5hbHlzaXMgPSB0cnVlXG4gIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBzZWxlY3QgY2FzZSBzZW5zaXRpdml0eS0gZGVmYXVsdCB0byBvZmZcbiAgQE91dHB1dCgpIGN1cnJlbnRUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7IC8vIGN1cnJlbnQgdGV4dCBzdHJpbmcsIHdpbGwgb3V0cHV0IGZvciBhbmFseXNpcyBvciBvdGhlciB3b3JrIG91dHNpZGVcblxuICBAVmlld0NoaWxkKCdsYXN0SW5wdXQnKSBsYXN0SW5wdXQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Qm94JykgaW5wdXRCb3g6IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSB0ZXh0U3ViamVjdDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKVxuICBwdWJsaWMgcmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgcHVibGljIHRleHRBcnJheTogQXJyYXk8VGFyZ2V0QXJyYXlJdGVtPiA9IFtdXG4gIHB1YmxpYyB0ZXh0SFRNTHN0cmluZzogc3RyaW5nXG4gIHB1YmxpYyB0ZW1wU3RyaW5nID0gJydcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAvLyBUaW1lciB0byBjaGVjayB3aGVuIHRvIHNlbmQgcmVxdWVzdCB0byB0ZXh0IGFuYWx5c2lzXG4gICAgdGhpcy50ZXh0U3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDIwMDApXG4gICAgKS5zdWJzY3JpYmUodGV4dCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdCh0aGlzLnRlbXBTdHJpbmcpO1xuICAgICAgLy8gSWYgd2UncmUgZG9pbmcgbG9jYWwgYW5hbHlzaXMsIGJlZ2luIHRoZSBwcm9jZXNzLCBvdGhlcndpc2UtIHdhaXQgZm9yIHJlc3BvbnNlIGZyb20gc2VydmljZVxuICAgICAgaWYgKHRoaXMubG9jYWxBbmFseXNpcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdExvY2FsbHkoKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coY2hhbmdlcylcbiAgICAgICAgLy8gaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMuaXNGaXJzdENoYW5nZSkge1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGNoYW5nZXMpXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ3NlbGVjdGVkIHRvIGRvIGV4dGVybmFsIGFuYWx5c2lzIHN0cmF0ZWd5JylcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXNwb25zZSBjYW1lIGJhY2sgZnJvbSBzZXJ2aWNlXG4gICAgICAgICAgdGhpcy5jb25zdHJ1Y3RFeHRlcm5hbGx5KClcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgICAgfSwgNTAwKVxuICAgICAgICAvLyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIERPTSBlbGVtZW50cyBhZnRlciByZW5kZXJlZCwgYWxsb3dpbmcgZm9yIGJveC1ib3JkZXJcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnZm9jdXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgJ2ZvY3VzZWQnKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIC8vIEZvY3VzIHRoZSBjYXJldCBhdCB0aGUgZW5kIG9mIHRoZSBib3hcbiAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICBjb25zb2xlLmxvZygndGFyZ2V0SXRlbXMnLCB0aGlzLnRhcmdldEl0ZW1zKTtcbiAgfVxuICAvLyBNZXRob2QgY2FsbGVkIHVwb24gYSBrZXlzdHJva2UgdG8gYmVnaW4gdGhlIHByb2Nlc3Mgb2Ygd2FpdGluZyBmb3IgYSAyIHNlY29uZCBwYXVzZSBpbiBrZXlzdHJva2VzXG4gIHRleHRDaGFuZ2UoZSkge1xuICAgIHRoaXMudGVtcFN0cmluZyA9IGU7XG4gICAgdGhpcy50ZXh0U3ViamVjdC5uZXh0KGUpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGhvdXQgbG9jYXRpb25zXG4gIGNvbnN0cnVjdExvY2FsbHkoKSB7XG4gICAgY29uc3QgcmVndWxhclRleHRDbGFzcyA9IHRoaXMucmVndWxhckNsYXNzID8gdGhpcy5yZWd1bGFyQ2xhc3MgOiAncmVnVHh0JztcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgcmVndWxhclRleHRDbGFzcyArICdcIj4nO1xuICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbG9jYWxBbmFseXNpcyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIGFuYWx5c2lzT3V0cHV0ICsgJyA8L3NwYW4+JztcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRoIGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RFeHRlcm5hbGx5KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZylcbiAgICBjb25zdCByZWd1bGFyVGV4dENsYXNzID0gdGhpcy5yZWd1bGFyQ2xhc3MgPyB0aGlzLnJlZ3VsYXJDbGFzcyA6ICdyZWdUeHQnXG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHJlZ3VsYXJUZXh0Q2xhc3MgKyAnXCI+J1xuICAgIGxldCBsb2NhdGlvbkNoZWNrZXIgPSB0cnVlXG4gICAgY29uc3QgZXJyb3JlZEl0ZW1zID0gW11cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy50YXJnZXRJdGVtcykge1xuICAgICAgaWYgKCFpdGVtLmxvY2F0aW9uKSB7XG4gICAgICAgIGVycm9yZWRJdGVtcy5wdXNoKGl0ZW0pXG4gICAgICAgIGxvY2F0aW9uQ2hlY2tlciA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsb2NhdGlvbkNoZWNrZXIpIHtcbiAgICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbWFrZVN0cmluZyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcpXG4gICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBlcnJvcmVkSXRlbXNUZXh0ID0gJydcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBlcnJvcmVkSXRlbXMpIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zVGV4dCA9IGVycm9yZWRJdGVtc1RleHQgKyBpdGVtLnRleHQgKyAnICAnXG4gICAgICB9XG4gICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID1cbiAgICAgICAgJ0FuIGVycm9yIG9jY3VyZWQuICBUaGUgZm9sbG93aW5nIGl0ZW1zIGRpZCBub3QgaGF2ZSBhIHZhbGlkIGlkZW50aWZpZWQgaW5kZXggbG9jYXRpb246ICcgKyBlcnJvcmVkSXRlbXNUZXh0XG4gICAgICAgICsgJ0VpdGhlciBwcm92aWRlIHByb3BlciBpbmRleCBsb2NhdGlvbnMgb2YgZWFjaCBpdGVtIHRvIGJlIGhpZ2hsaWdodGVkIG9yIHNldCBsb2NhbEFuYWx5c2lzIHRvIHRydWUuJ1xuICAgIH1cblxuICB9XG5cblxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMubGFzdElucHV0KSB7XG4gICAgICB0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnBsYWNlQ2FyZXRBdEVuZCh0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZVJhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpXG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSlcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gbG9jYWxBbmFseXNpcyhzZWFyY2hUYXJnZXRzLCBzdHIsIGNhc2VTZW5zaXRpdmUpIHtcbiAgaWYgKGNhc2VTZW5zaXRpdmUpIHtcbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQudG9Mb3dlckNhc2UoKVxuICAgIH1cbiAgfVxuICBjb25zdCBvdXRwdXQgPSBbXVxuICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoVGFyZ2V0cykge1xuICAgIGxldCBzdGFydEluZGV4ID0gMFxuICAgIGxldCBpbmRleFxuICAgIGNvbnN0IHNlYXJjaFN0ckxlbiA9IGl0ZW0udGV4dC5sZW5ndGg7XG4gICAgaWYgKHNlYXJjaFN0ckxlbiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ0FuIGVycm9yIG9jY3VycmVkLiBUaGVyZSBhcHBlYXJzIHRvIGJlIG5vIGlucHV0IHNlYXJjaCBzdHJpbmcuJ1xuICAgIH1cbiAgICB3aGlsZSAoKGluZGV4ID0gc3RyLmluZGV4T2YoaXRlbS50ZXh0LCBzdGFydEluZGV4KSkgPiAtMSkge1xuICAgICAgbGV0IGluZGV4SXRlbSA9IHtcbiAgICAgICAgdGV4dDogaXRlbS50ZXh0LFxuICAgICAgICBsb2NhdGlvbjogW2luZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbl0sXG4gICAgICAgIGNzczogaXRlbS5jc3NcbiAgICAgIH1cbiAgICAgIG91dHB1dC5wdXNoKGluZGV4SXRlbSlcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgLy8gb3V0cHV0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAvLyAgIHJldHVybiBhLmxvY2F0aW9uWzBdIC0gYi5sb2NhdGlvblswXVxuICAvLyB9KVxuICByZXR1cm4gbWFrZVN0cmluZyhvdXRwdXQsIHN0cilcbn1cblxuZnVuY3Rpb24gbWFrZVN0cmluZyhzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIH0pXG4gIGxldCBmaW5hbFRleHQgPSAnJ1xuICBsZXQgc3RhcnQgPSAwXG4gIGxldCBlbmQgPSBzZWFyY2hSZXN1bHRzWzBdLmxvY2F0aW9uWzBdXG4gIGxldCBtaWRkbGUgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSlcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG1pZGRsZVxuICAgICAgc3RhcnQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXVxuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMV1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKGZpbmFsVGV4dClcbiAgcmV0dXJuIGZpbmFsVGV4dFxufVxuIl19