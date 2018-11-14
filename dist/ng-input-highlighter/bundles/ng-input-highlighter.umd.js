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
            this.regularClass = null;
            // @Input() targetTextArray: Array<TargetArrayItem> = []; // analysis outside component: need to define schema
            this.targetItems = [];
            this.localAnalysis = true;
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
            { type: i0.Component, args: [{
                        selector: 'lib-ng-input-highlighter',
                        template: "<div #inputBox id=\"input-area\" tabindex=\"0\">\n  <div class=\"text-area\">\n      <span \n        #lastInput\n        autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n        id=\"input-span\" \n        contenteditable\n        [innerHTML]=\"textHTMLstring\"\n        [ngClass]=\"{'pending': responsePending}\"\n        (input)=\"textChange($event.target.textContent)\">\n      </span>\n      <span *ngIf=\"responsePending\" style=\"margin-left:15px\" class=\"spinner spinner-inline\"></span>\n      <span (click)=\"focusInput()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" class=\"rest\"></div>\n</div>",
                        styles: ["#input-area{color:#000;margin-top:10px;background-color:#f3f6fa;border-radius:5px;height:250px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3}"]
                    }] }
        ];
        /** @nocollapse */
        NgInputHighlighterComponent.ctorParameters = function () {
            return [
                { type: i0.Renderer2 }
            ];
        };
        NgInputHighlighterComponent.propDecorators = {
            regularClass: [{ type: i0.Input }],
            targetItems: [{ type: i0.Input }],
            localAnalysis: [{ type: i0.Input }],
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
        var e_3, _a, e_4, _b;
        if (caseSensitive) {
            str = str.toLowerCase();
            try {
                for (var searchTargets_1 = __values(searchTargets), searchTargets_1_1 = searchTargets_1.next(); !searchTargets_1_1.done; searchTargets_1_1 = searchTargets_1.next()) {
                    var item = searchTargets_1_1.value;
                    item.text = item.text.toLowerCase();
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
        catch (e_4_1) {
            e_4 = { error: e_4_1 };
        }
        finally {
            try {
                if (searchTargets_2_1 && !searchTargets_2_1.done && (_b = searchTargets_2.return))
                    _b.call(searchTargets_2);
            }
            finally {
                if (e_4)
                    throw e_4.error;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuc2VydmljZS50cyIsIm5vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFRhcmdldEFycmF5SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRUZXh0SXRlbS5jbGFzcyc7XG5pbXBvcnQgeyBUYXJnZXRJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldEl0ZW1zLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5nLWlucHV0LWhpZ2hsaWdodGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSByZWd1bGFyQ2xhc3M6IHN0cmluZyA9IG51bGwgLy8gb3B0aW9uYWwgY2xhc3MgZm9yIGlucHV0IG9mIHN0eWxlIGZvciByZWd1bGFyIHRleHQgaW4gYm94XG4gIC8vIEBJbnB1dCgpIHRhcmdldFRleHRBcnJheTogQXJyYXk8VGFyZ2V0QXJyYXlJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBvdXRzaWRlIGNvbXBvbmVudDogbmVlZCB0byBkZWZpbmUgc2NoZW1hXG4gIEBJbnB1dCgpIHRhcmdldEl0ZW1zOiBBcnJheTxUYXJnZXRJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBpbnNpZGUgY29tcG9uZW50OiBhcnJheSBvZiBpdGVtcyB0byBmaW5kXG4gIEBJbnB1dCgpIGxvY2FsQW5hbHlzaXMgPSB0cnVlXG4gIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBzZWxlY3QgY2FzZSBzZW5zaXRpdml0eS0gZGVmYXVsdCB0byBvZmZcbiAgQE91dHB1dCgpIGN1cnJlbnRUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7IC8vIGN1cnJlbnQgdGV4dCBzdHJpbmcsIHdpbGwgb3V0cHV0IGZvciBhbmFseXNpcyBvciBvdGhlciB3b3JrIG91dHNpZGVcblxuICBAVmlld0NoaWxkKCdsYXN0SW5wdXQnKSBsYXN0SW5wdXQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Qm94JykgaW5wdXRCb3g6IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSB0ZXh0U3ViamVjdDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKVxuICBwdWJsaWMgcmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgcHVibGljIHRleHRBcnJheTogQXJyYXk8VGFyZ2V0QXJyYXlJdGVtPiA9IFtdXG4gIHB1YmxpYyB0ZXh0SFRNTHN0cmluZzogc3RyaW5nXG4gIHB1YmxpYyB0ZW1wU3RyaW5nID0gJydcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAvLyBUaW1lciB0byBjaGVjayB3aGVuIHRvIHNlbmQgcmVxdWVzdCB0byB0ZXh0IGFuYWx5c2lzXG4gICAgdGhpcy50ZXh0U3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDIwMDApXG4gICAgKS5zdWJzY3JpYmUodGV4dCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdCh0aGlzLnRlbXBTdHJpbmcpO1xuICAgICAgLy8gSWYgd2UncmUgZG9pbmcgbG9jYWwgYW5hbHlzaXMsIGJlZ2luIHRoZSBwcm9jZXNzLCBvdGhlcndpc2UtIHdhaXQgZm9yIHJlc3BvbnNlIGZyb20gc2VydmljZVxuICAgICAgaWYgKHRoaXMubG9jYWxBbmFseXNpcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdExvY2FsbHkoKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coY2hhbmdlcylcbiAgICAgICAgLy8gaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMuaXNGaXJzdENoYW5nZSkge1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGNoYW5nZXMpXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ3NlbGVjdGVkIHRvIGRvIGV4dGVybmFsIGFuYWx5c2lzIHN0cmF0ZWd5JylcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXNwb25zZSBjYW1lIGJhY2sgZnJvbSBzZXJ2aWNlXG4gICAgICAgICAgdGhpcy5jb25zdHJ1Y3RFeHRlcm5hbGx5KClcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgICAgfSwgNTAwKVxuICAgICAgICAvLyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIERPTSBlbGVtZW50cyBhZnRlciByZW5kZXJlZCwgYWxsb3dpbmcgZm9yIGJveC1ib3JkZXJcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnZm9jdXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgJ2ZvY3VzZWQnKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIC8vIEZvY3VzIHRoZSBjYXJldCBhdCB0aGUgZW5kIG9mIHRoZSBib3hcbiAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICBjb25zb2xlLmxvZygndGFyZ2V0SXRlbXMnLCB0aGlzLnRhcmdldEl0ZW1zKTtcbiAgfVxuICAvLyBNZXRob2QgY2FsbGVkIHVwb24gYSBrZXlzdHJva2UgdG8gYmVnaW4gdGhlIHByb2Nlc3Mgb2Ygd2FpdGluZyBmb3IgYSAyIHNlY29uZCBwYXVzZSBpbiBrZXlzdHJva2VzXG4gIHRleHRDaGFuZ2UoZSkge1xuICAgIHRoaXMudGVtcFN0cmluZyA9IGU7XG4gICAgdGhpcy50ZXh0U3ViamVjdC5uZXh0KGUpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGhvdXQgbG9jYXRpb25zXG4gIGNvbnN0cnVjdExvY2FsbHkoKSB7XG4gICAgY29uc3QgcmVndWxhclRleHRDbGFzcyA9IHRoaXMucmVndWxhckNsYXNzID8gdGhpcy5yZWd1bGFyQ2xhc3MgOiAncmVnVHh0JztcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgcmVndWxhclRleHRDbGFzcyArICdcIj4nO1xuICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbG9jYWxBbmFseXNpcyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIGFuYWx5c2lzT3V0cHV0ICsgJyA8L3NwYW4+JztcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRoIGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RFeHRlcm5hbGx5KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZylcbiAgICBjb25zdCByZWd1bGFyVGV4dENsYXNzID0gdGhpcy5yZWd1bGFyQ2xhc3MgPyB0aGlzLnJlZ3VsYXJDbGFzcyA6ICdyZWdUeHQnXG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHJlZ3VsYXJUZXh0Q2xhc3MgKyAnXCI+J1xuICAgIGxldCBsb2NhdGlvbkNoZWNrZXIgPSB0cnVlXG4gICAgY29uc3QgZXJyb3JlZEl0ZW1zID0gW11cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy50YXJnZXRJdGVtcykge1xuICAgICAgaWYgKCFpdGVtLmxvY2F0aW9uKSB7XG4gICAgICAgIGVycm9yZWRJdGVtcy5wdXNoKGl0ZW0pXG4gICAgICAgIGxvY2F0aW9uQ2hlY2tlciA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsb2NhdGlvbkNoZWNrZXIpIHtcbiAgICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbWFrZVN0cmluZyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcpXG4gICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBlcnJvcmVkSXRlbXNUZXh0ID0gJydcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBlcnJvcmVkSXRlbXMpIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zVGV4dCA9IGVycm9yZWRJdGVtc1RleHQgKyBpdGVtLnRleHQgKyAnICAnXG4gICAgICB9XG4gICAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID1cbiAgICAgICAgJ0FuIGVycm9yIG9jY3VyZWQuICBUaGUgZm9sbG93aW5nIGl0ZW1zIGRpZCBub3QgaGF2ZSBhIHZhbGlkIGlkZW50aWZpZWQgaW5kZXggbG9jYXRpb246ICcgKyBlcnJvcmVkSXRlbXNUZXh0XG4gICAgICAgICsgJ0VpdGhlciBwcm92aWRlIHByb3BlciBpbmRleCBsb2NhdGlvbnMgb2YgZWFjaCBpdGVtIHRvIGJlIGhpZ2hsaWdodGVkIG9yIHNldCBsb2NhbEFuYWx5c2lzIHRvIHRydWUuJ1xuICAgIH1cblxuICB9XG5cblxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMubGFzdElucHV0KSB7XG4gICAgICB0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnBsYWNlQ2FyZXRBdEVuZCh0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZVJhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpXG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSlcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKVxuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpXG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gbG9jYWxBbmFseXNpcyhzZWFyY2hUYXJnZXRzLCBzdHIsIGNhc2VTZW5zaXRpdmUpIHtcbiAgaWYgKGNhc2VTZW5zaXRpdmUpIHtcbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKVxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQudG9Mb3dlckNhc2UoKVxuICAgIH1cbiAgfVxuICBjb25zdCBvdXRwdXQgPSBbXVxuICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoVGFyZ2V0cykge1xuICAgIGxldCBzdGFydEluZGV4ID0gMFxuICAgIGxldCBpbmRleFxuICAgIGNvbnN0IHNlYXJjaFN0ckxlbiA9IGl0ZW0udGV4dC5sZW5ndGg7XG4gICAgaWYgKHNlYXJjaFN0ckxlbiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ0FuIGVycm9yIG9jY3VycmVkLiBUaGVyZSBhcHBlYXJzIHRvIGJlIG5vIGlucHV0IHNlYXJjaCBzdHJpbmcuJ1xuICAgIH1cbiAgICB3aGlsZSAoKGluZGV4ID0gc3RyLmluZGV4T2YoaXRlbS50ZXh0LCBzdGFydEluZGV4KSkgPiAtMSkge1xuICAgICAgbGV0IGluZGV4SXRlbSA9IHtcbiAgICAgICAgdGV4dDogaXRlbS50ZXh0LFxuICAgICAgICBsb2NhdGlvbjogW2luZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbl0sXG4gICAgICAgIGNzczogaXRlbS5jc3NcbiAgICAgIH1cbiAgICAgIG91dHB1dC5wdXNoKGluZGV4SXRlbSlcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgLy8gb3V0cHV0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAvLyAgIHJldHVybiBhLmxvY2F0aW9uWzBdIC0gYi5sb2NhdGlvblswXVxuICAvLyB9KVxuICByZXR1cm4gbWFrZVN0cmluZyhvdXRwdXQsIHN0cilcbn1cblxuZnVuY3Rpb24gbWFrZVN0cmluZyhzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIH0pXG4gIGxldCBmaW5hbFRleHQgPSAnJ1xuICBsZXQgc3RhcnQgPSAwXG4gIGxldCBlbmQgPSBzZWFyY2hSZXN1bHRzWzBdLmxvY2F0aW9uWzBdXG4gIGxldCBtaWRkbGUgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSlcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG1pZGRsZVxuICAgICAgc3RhcnQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXVxuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMV1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKGZpbmFsVGV4dClcbiAgcmV0dXJuIGZpbmFsVGV4dFxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCB9IGZyb20gJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIkluamVjdGFibGUiLCJFdmVudEVtaXR0ZXIiLCJTdWJqZWN0IiwiZGVib3VuY2VUaW1lIiwidHNsaWJfMS5fX3ZhbHVlcyIsIkNvbXBvbmVudCIsIlJlbmRlcmVyMiIsIklucHV0IiwiT3V0cHV0IiwiVmlld0NoaWxkIiwiTmdNb2R1bGUiLCJCcm93c2VyTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUFPRTtTQUFpQjs7b0JBTGxCQSxhQUFVLFNBQUM7d0JBQ1YsVUFBVSxFQUFFLE1BQU07cUJBQ25COzs7Ozt3Q0FKRDs7O0lDQUE7Ozs7Ozs7Ozs7Ozs7O0FBY0Esc0JBNEZ5QixDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU87WUFDSCxJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO29CQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDM0M7U0FDSixDQUFDO0lBQ04sQ0FBQzs7Ozs7OztRQ2pGQyxxQ0FBb0IsUUFBbUI7WUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztnQ0FoQlAsSUFBSTs7K0JBRU0sRUFBRTtpQ0FDbkIsSUFBSTtpQ0FDSixLQUFLOytCQUNO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