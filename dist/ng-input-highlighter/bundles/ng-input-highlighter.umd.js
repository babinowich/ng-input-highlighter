(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('ng-input-highlighter', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/platform-browser'], factory) :
    (factory((global['ng-input-highlighter'] = {}),global.ng.core,global.rxjs,global.rxjs.operators,global.ng.platformBrowser));
}(this, (function (exports,i0,rxjs,operators,platformBrowser) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgInputHighlighterService = /** @class */ (function () {
        function NgInputHighlighterService() {
        }
        NgInputHighlighterService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        NgInputHighlighterService.ctorParameters = function () { return []; };
        /** @nocollapse */ NgInputHighlighterService.ngInjectableDef = i0.defineInjectable({ factory: function NgInputHighlighterService_Factory() { return new NgInputHighlighterService(); }, token: NgInputHighlighterService, providedIn: "root" });
        return NgInputHighlighterService;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
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
            this.currentText = new i0.EventEmitter();
            this.textSubject = new rxjs.Subject();
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
                this.textSubject.pipe(operators.debounceTime(2000)).subscribe(function (text) {
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
                        for (var _c = __values(this.targetItems), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var item = _d.value;
                            if (!item.location) {
                                erroredItems.push(item);
                                locationChecker = false;
                            }
                        }
                    }
                    catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return))
                                _a.call(_c);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
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
                        catch (e_2_1) {
                            e_2 = { error: e_2_1 };
                        }
                        finally {
                            try {
                                if (erroredItems_1_1 && !erroredItems_1_1.done && (_b = erroredItems_1.return))
                                    _b.call(erroredItems_1);
                            }
                            finally {
                                if (e_2)
                                    throw e_2.error;
                            }
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
            { type: i0.Component, args: [{
                        selector: 'lib-ng-input-highlighter',
                        template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"[boxSize, boxClass]\">\n  <div class=\"text-area\" [ngClass]=\"{'pending': responsePending}\">\n    <span \n      #lastInput\n      autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n      id=\"input-span\" \n      contenteditable\n      [innerHTML]=\"textHTMLstring\"\n      [ngClass]=\"fontClass\"\n      (input)=\"textChange($event.target.textContent)\">\n    </span>\n    <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n    <span (click)=\"focusInput()\"  (dblclick)=\"selectAll()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                        styles: ["#input-area{color:#000;margin-top:10px;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.none{background-color:#f3f6fa}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3;color:gray!important}"]
                    }] }
        ];
        /** @nocollapse */
        NgInputHighlighterComponent.ctorParameters = function () {
            return [
                { type: i0.Renderer2 }
            ];
        };
        NgInputHighlighterComponent.propDecorators = {
            targetItems: [{ type: i0.Input }],
            localAnalysis: [{ type: i0.Input }],
            boxHeight: [{ type: i0.Input }],
            fontClass: [{ type: i0.Input }],
            boxClass: [{ type: i0.Input }],
            boxFocus: [{ type: i0.Input }],
            initFocus: [{ type: i0.Input }],
            caseSensitive: [{ type: i0.Input }],
            currentText: [{ type: i0.Output }],
            lastInput: [{ type: i0.ViewChild, args: ['lastInput',] }],
            inputBox: [{ type: i0.ViewChild, args: ['inputBox',] }]
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
        var e_3, _a;
        /** @type {?} */
        var output = [];
        try {
            for (var searchTargets_1 = __values(searchTargets), searchTargets_1_1 = searchTargets_1.next(); !searchTargets_1_1.done; searchTargets_1_1 = searchTargets_1.next()) {
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
        catch (e_3_1) {
            e_3 = { error: e_3_1 };
        }
        finally {
            try {
                if (searchTargets_1_1 && !searchTargets_1_1.done && (_a = searchTargets_1.return))
                    _a.call(searchTargets_1);
            }
            finally {
                if (e_3)
                    throw e_3.error;
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
            { type: i0.NgModule, args: [{
                        imports: [
                            platformBrowser.BrowserModule
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

    exports.NgInputHighlighterService = NgInputHighlighterService;
    exports.NgInputHighlighterComponent = NgInputHighlighterComponent;
    exports.NgInputHighlighterModule = NgInputHighlighterModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuc2VydmljZS50cyIsIm5vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFRhcmdldEFycmF5SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRUZXh0SXRlbS5jbGFzcyc7XG5pbXBvcnQgeyBUYXJnZXRJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldEl0ZW1zLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5nLWlucHV0LWhpZ2hsaWdodGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSB0YXJnZXRJdGVtczogQXJyYXk8VGFyZ2V0SXRlbT4gPSBbXTsgLy8gYW5hbHlzaXMgaW5zaWRlIGNvbXBvbmVudDogYXJyYXkgb2YgaXRlbXMgdG8gZmluZFxuICBASW5wdXQoKSBsb2NhbEFuYWx5c2lzID0gdHJ1ZVxuICBASW5wdXQoKSBib3hIZWlnaHQgPSAnTSdcbiAgLy8gQElucHV0KCkgaGlnaENvbnRyYXN0ID0gdHJ1ZVxuICBASW5wdXQoKSBmb250Q2xhc3MgPSAncmVndWxhclRleHQnIC8vIG9wdGlvbmFsIGNsYXNzIGZvciBpbnB1dCBvZiBzdHlsZSBmb3IgcmVndWxhciB0ZXh0IGluIGJveFxuICBASW5wdXQoKSBib3hDbGFzcyA9ICdub25lJ1xuICBASW5wdXQoKSBib3hGb2N1cyA9ICdmb2N1c2VkJ1xuICBASW5wdXQoKSBpbml0Rm9jdXMgPSB0cnVlIC8vIGFsbG93IGZvciBvcHRpb24gdG8gZm9jdXMgb24gY29tcG9uZW50IHRleHQgYm94IGluaXRpYWxseSwgcmVjb21tZW5kZWQgZm9yIGFjY2Vzc2liaWxpdHlcbiAgQElucHV0KCkgY2FzZVNlbnNpdGl2ZSA9IGZhbHNlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIHNlbGVjdCBjYXNlIHNlbnNpdGl2aXR5LSBkZWZhdWx0IHRvIG9mZlxuICBAT3V0cHV0KCkgY3VycmVudFRleHQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTsgLy8gY3VycmVudCB0ZXh0IHN0cmluZywgd2lsbCBvdXRwdXQgZm9yIGFuYWx5c2lzIG9yIG90aGVyIHdvcmsgb3V0c2lkZVxuXG4gIEBWaWV3Q2hpbGQoJ2xhc3RJbnB1dCcpIGxhc3RJbnB1dDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRCb3gnKSBpbnB1dEJveDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHRleHRTdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpXG4gIHB1YmxpYyByZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICBwdWJsaWMgdGV4dEFycmF5OiBBcnJheTxUYXJnZXRBcnJheUl0ZW0+ID0gW11cbiAgcHVibGljIHRleHRIVE1Mc3RyaW5nOiBzdHJpbmdcbiAgcHVibGljIHRlbXBTdHJpbmcgPSAnJ1xuICBwdWJsaWMgYm94U2l6ZTogU3RyaW5nXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgLy8gVGltZXIgdG8gY2hlY2sgd2hlbiB0byBzZW5kIHJlcXVlc3QgdG8gdGV4dCBhbmFseXNpc1xuICAgIHRoaXMudGV4dFN1YmplY3QucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgyMDAwKVxuICAgICkuc3Vic2NyaWJlKHRleHQgPT4ge1xuICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmN1cnJlbnRUZXh0LmVtaXQodGhpcy50ZW1wU3RyaW5nKTtcbiAgICAgIC8vIElmIHdlJ3JlIGRvaW5nIGxvY2FsIGFuYWx5c2lzLCBiZWdpbiB0aGUgcHJvY2Vzcywgb3RoZXJ3aXNlLSB3YWl0IGZvciByZXNwb25zZSBmcm9tIHNlcnZpY2VcbiAgICAgIGlmICh0aGlzLmxvY2FsQW5hbHlzaXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RMb2NhbGx5KClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnWFMnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAneHNtYWxsJ1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdTJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3NtYWxsJ1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdMJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ2xhcmdlJ1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYTCcpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4bGFyZ2UnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdtZWRpdW0nXG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgodGhpcy50YXJnZXRJdGVtcy5sZW5ndGggPiAwKSAmJiAoIXRoaXMubG9jYWxBbmFseXNpcykpIHtcbiAgICAgIGlmIChjaGFuZ2VzLnRhcmdldEl0ZW1zKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0RXh0ZXJuYWxseSgpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKVxuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIERPTSBlbGVtZW50cyBhZnRlciByZW5kZXJlZCwgYWxsb3dpbmcgZm9yIGJveC1ib3JkZXJcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnZm9jdXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgdGhpcy5ib3hGb2N1cyk7XG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5sYXN0SW5wdXQubmF0aXZlRWxlbWVudCwgJ2JsdXInLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgdGhpcy5ib3hGb2N1cyk7XG4gICAgfSk7XG4gICAgLy8gRm9jdXMgdGhlIGNhcmV0IGF0IHRoZSBlbmQgb2YgdGhlIGJveFxuICAgIGlmICh0aGlzLmluaXRGb2N1cykge1xuICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCd0YXJnZXRJdGVtcycsIHRoaXMudGFyZ2V0SXRlbXMpO1xuICB9XG4gIC8vIE1ldGhvZCBjYWxsZWQgdXBvbiBhIGtleXN0cm9rZSB0byBiZWdpbiB0aGUgcHJvY2VzcyBvZiB3YWl0aW5nIGZvciBhIDIgc2Vjb25kIHBhdXNlIGluIGtleXN0cm9rZXNcbiAgdGV4dENoYW5nZShlKSB7XG4gICAgdGhpcy50ZW1wU3RyaW5nID0gZTtcbiAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoZSk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aG91dCBsb2NhdGlvbnNcbiAgY29uc3RydWN0TG9jYWxseSgpIHtcbiAgICAvLyBjb25zdCByZWd1bGFyVGV4dENsYXNzID0gdGhpcy5yZWd1bGFyQ2xhc3MgPyB0aGlzLnJlZ3VsYXJDbGFzcyA6ICdyZWdUeHQnO1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyB0aGlzLmZvbnRDbGFzcyArICdcIj4nO1xuICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbG9jYWxBbmFseXNpcyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIGFuYWx5c2lzT3V0cHV0ICsgJyA8L3NwYW4+JztcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRoIGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RFeHRlcm5hbGx5KCkge1xuICAgIGNvbnN0IGJlZ2lubmluZyA9ICc8c3BhbiBjbGFzcz1cIicgKyB0aGlzLmZvbnRDbGFzcyArICdcIj4nO1xuICAgIGxldCBsb2NhdGlvbkNoZWNrZXIgPSB0cnVlXG4gICAgY29uc3QgZXJyb3JlZEl0ZW1zID0gW11cbiAgICBpZiAodGhpcy50YXJnZXRJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyB0aGlzLnRlbXBTdHJpbmcgKyAnIDwvc3Bhbj4nXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLnRhcmdldEl0ZW1zKSB7XG4gICAgICAgIGlmICghaXRlbS5sb2NhdGlvbikge1xuICAgICAgICAgIGVycm9yZWRJdGVtcy5wdXNoKGl0ZW0pXG4gICAgICAgICAgbG9jYXRpb25DaGVja2VyID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxvY2F0aW9uQ2hlY2tlcikge1xuICAgICAgICBjb25zdCBhbmFseXNpc091dHB1dCA9IG1ha2VTdHJpbmcodGhpcy50YXJnZXRJdGVtcywgdGhpcy50ZW1wU3RyaW5nKVxuICAgICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZXJyb3JlZEl0ZW1zVGV4dCA9ICcnXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBlcnJvcmVkSXRlbXMpIHtcbiAgICAgICAgICBlcnJvcmVkSXRlbXNUZXh0ID0gZXJyb3JlZEl0ZW1zVGV4dCArIGl0ZW0udGV4dCArICcgICdcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID1cbiAgICAgICAgICAnQW4gZXJyb3Igb2NjdXJlZC4gIFRoZSBmb2xsb3dpbmcgaXRlbXMgZGlkIG5vdCBoYXZlIGEgdmFsaWQgaWRlbnRpZmllZCBpbmRleCBsb2NhdGlvbjogJyArIGVycm9yZWRJdGVtc1RleHRcbiAgICAgICAgICArICdFaXRoZXIgcHJvdmlkZSBwcm9wZXIgaW5kZXggbG9jYXRpb25zIG9mIGVhY2ggaXRlbSB0byBiZSBoaWdobGlnaHRlZCBvciBzZXQgbG9jYWxBbmFseXNpcyB0byB0cnVlLidcbiAgICAgIH1cbiAgICB9XG5cblxuICB9XG5cblxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMubGFzdElucHV0KSB7XG4gICAgICB0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnBsYWNlQ2FyZXRBdEVuZCh0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZVJhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpXG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSlcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdzZWxlY3RBbGwnLCBmYWxzZSwgbnVsbClcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGxvY2FsQW5hbHlzaXMoc2VhcmNoVGFyZ2V0cywgc3RyLCBjYXNlU2Vuc2l0aXZlKSB7XG4gIGNvbnN0IG91dHB1dCA9IFtdXG4gIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwXG4gICAgbGV0IGluZGV4XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nXG4gICAgfVxuICAgIGxldCBzZWFyY2hpbmdTdHJpbmdcbiAgICBsZXQgc2VhcmNoaW5nVGV4dFxuICAgIGlmICghY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgc2VhcmNoaW5nU3RyaW5nID0gc3RyLnRvTG93ZXJDYXNlKClcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHQudG9Mb3dlckNhc2UoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWFyY2hpbmdTdHJpbmcgPSBzdHJcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHRcbiAgICB9XG4gICAgd2hpbGUgKChpbmRleCA9IHNlYXJjaGluZ1N0cmluZy5pbmRleE9mKHNlYXJjaGluZ1RleHQsIHN0YXJ0SW5kZXgpKSA+IC0xKSB7XG4gICAgICBjb25zdCBpbmRleEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IHN0ci5zdWJzdHJpbmcoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuKSxcbiAgICAgICAgbG9jYXRpb246IFtpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW5dLFxuICAgICAgICBjc3M6IGl0ZW0uY3NzXG4gICAgICB9XG4gICAgICBvdXRwdXQucHVzaChpbmRleEl0ZW0pXG4gICAgICBzdGFydEluZGV4ID0gaW5kZXggKyBzZWFyY2hTdHJMZW47XG4gICAgfVxuICB9XG4gIGlmIChvdXRwdXQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHN0clxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtYWtlU3RyaW5nKG91dHB1dCwgc3RyKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VTdHJpbmcoc2VhcmNoUmVzdWx0cywgb3JpZ2luYWxfdGV4dCkge1xuICBzZWFyY2hSZXN1bHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLmxvY2F0aW9uWzBdIC0gYi5sb2NhdGlvblswXVxuICB9KVxuICBsZXQgZmluYWxUZXh0ID0gJydcbiAgbGV0IHN0YXJ0ID0gMFxuICBsZXQgZW5kID0gc2VhcmNoUmVzdWx0c1swXS5sb2NhdGlvblswXVxuICBsZXQgbWlkZGxlID0gJydcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWFyY2hSZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0YXJ0ID09PSAwKSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKSArXG4gICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCInICsgc2VhcmNoUmVzdWx0c1tpXS5jc3MgKyAnXCI+JyArIHNlYXJjaFJlc3VsdHNbaV0udGV4dCArICc8L3NwYW4+J1xuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXVxuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyAnPHNwYW4gY2xhc3M9XCInICsgc2VhcmNoUmVzdWx0c1tpXS5jc3MgKyAnXCI+JyArIHNlYXJjaFJlc3VsdHNbaV0udGV4dCArICc8L3NwYW4+J1xuICAgIH1cblxuICAgIGlmIChzZWFyY2hSZXN1bHRzW2kgKyAxXSkge1xuICAgICAgbWlkZGxlID0gb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXSwgc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF0pXG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBtaWRkbGVcbiAgICAgIHN0YXJ0ID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF1cbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzFdXG4gICAgfVxuXG4gICAgaWYgKGkgPT09IChzZWFyY2hSZXN1bHRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhlbmQsIG9yaWdpbmFsX3RleHQubGVuZ3RoKVxuICAgIH1cbiAgfVxuICBjb25zb2xlLmxvZyhmaW5hbFRleHQpXG4gIHJldHVybiBmaW5hbFRleHRcbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgfSBmcm9tICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW05nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwiU3ViamVjdCIsImRlYm91bmNlVGltZSIsInRzbGliXzEuX192YWx1ZXMiLCJDb21wb25lbnQiLCJSZW5kZXJlcjIiLCJJbnB1dCIsIk91dHB1dCIsIlZpZXdDaGlsZCIsIk5nTW9kdWxlIiwiQnJvd3Nlck1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO1FBT0U7U0FBaUI7O29CQUxsQkEsYUFBVSxTQUFDO3dCQUNWLFVBQVUsRUFBRSxNQUFNO3FCQUNuQjs7Ozs7d0NBSkQ7OztJQ0FBOzs7Ozs7Ozs7Ozs7OztBQWNBLHNC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