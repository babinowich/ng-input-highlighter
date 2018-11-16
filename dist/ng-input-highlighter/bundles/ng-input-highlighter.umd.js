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
            this.regularClass = 'regularText';
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
                        template: "<div #inputBox id=\"input-area\" tabindex=\"0\">\n  <div class=\"text-area\">\n      <span \n        #lastInput\n        autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\n        id=\"input-span\" \n        contenteditable\n        [innerHTML]=\"textHTMLstring\"\n        [ngClass]=\"{'pending': responsePending}\"\n        (input)=\"textChange($event.target.textContent)\">\n      </span>\n      <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n      <span (click)=\"focusInput()\"  (dblclick)=\"selectAll()\" class=\"blank-input\"></span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                        styles: ["#input-area{color:#000;margin-top:10px;background-color:#f3f6fa;border-radius:5px;height:250px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3}::selection{background:#444782;color:#fff}::-moz-selection{background:#444782;color:#fff}"]
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuc2VydmljZS50cyIsIm5vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFRhcmdldEFycmF5SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRUZXh0SXRlbS5jbGFzcyc7XG5pbXBvcnQgeyBUYXJnZXRJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldEl0ZW1zLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5nLWlucHV0LWhpZ2hsaWdodGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSByZWd1bGFyQ2xhc3MgPSAncmVndWxhclRleHQnIC8vIG9wdGlvbmFsIGNsYXNzIGZvciBpbnB1dCBvZiBzdHlsZSBmb3IgcmVndWxhciB0ZXh0IGluIGJveFxuICBASW5wdXQoKSB0YXJnZXRJdGVtczogQXJyYXk8VGFyZ2V0SXRlbT4gPSBbXTsgLy8gYW5hbHlzaXMgaW5zaWRlIGNvbXBvbmVudDogYXJyYXkgb2YgaXRlbXMgdG8gZmluZFxuICBASW5wdXQoKSBsb2NhbEFuYWx5c2lzID0gdHJ1ZVxuICBASW5wdXQoKSBjYXNlU2Vuc2l0aXZlID0gZmFsc2U7IC8vIGFsbG93IGZvciBvcHRpb24gdG8gc2VsZWN0IGNhc2Ugc2Vuc2l0aXZpdHktIGRlZmF1bHQgdG8gb2ZmXG4gIEBPdXRwdXQoKSBjdXJyZW50VGV4dCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpOyAvLyBjdXJyZW50IHRleHQgc3RyaW5nLCB3aWxsIG91dHB1dCBmb3IgYW5hbHlzaXMgb3Igb3RoZXIgd29yayBvdXRzaWRlXG5cbiAgQFZpZXdDaGlsZCgnbGFzdElucHV0JykgbGFzdElucHV0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdpbnB1dEJveCcpIGlucHV0Qm94OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgdGV4dFN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KClcbiAgcHVibGljIHJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gIHB1YmxpYyB0ZXh0QXJyYXk6IEFycmF5PFRhcmdldEFycmF5SXRlbT4gPSBbXVxuICBwdWJsaWMgdGV4dEhUTUxzdHJpbmc6IHN0cmluZ1xuICBwdWJsaWMgdGVtcFN0cmluZyA9ICcnXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgLy8gVGltZXIgdG8gY2hlY2sgd2hlbiB0byBzZW5kIHJlcXVlc3QgdG8gdGV4dCBhbmFseXNpc1xuICAgIHRoaXMudGV4dFN1YmplY3QucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgyMDAwKVxuICAgICkuc3Vic2NyaWJlKHRleHQgPT4ge1xuICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmN1cnJlbnRUZXh0LmVtaXQodGhpcy50ZW1wU3RyaW5nKTtcbiAgICAgIC8vIElmIHdlJ3JlIGRvaW5nIGxvY2FsIGFuYWx5c2lzLCBiZWdpbiB0aGUgcHJvY2Vzcywgb3RoZXJ3aXNlLSB3YWl0IGZvciByZXNwb25zZSBmcm9tIHNlcnZpY2VcbiAgICAgIGlmICh0aGlzLmxvY2FsQW5hbHlzaXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RMb2NhbGx5KClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpXG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgodGhpcy50YXJnZXRJdGVtcy5sZW5ndGggPiAwKSAmJiAoIXRoaXMubG9jYWxBbmFseXNpcykpIHtcbiAgICAgIGlmIChjaGFuZ2VzLnRhcmdldEl0ZW1zKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0RXh0ZXJuYWxseSgpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKVxuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIERPTSBlbGVtZW50cyBhZnRlciByZW5kZXJlZCwgYWxsb3dpbmcgZm9yIGJveC1ib3JkZXJcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnZm9jdXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgJ2ZvY3VzZWQnKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmxhc3RJbnB1dC5uYXRpdmVFbGVtZW50LCAnYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCAnZm9jdXNlZCcpO1xuICAgIH0pO1xuICAgIC8vIEZvY3VzIHRoZSBjYXJldCBhdCB0aGUgZW5kIG9mIHRoZSBib3hcbiAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICBjb25zb2xlLmxvZygndGFyZ2V0SXRlbXMnLCB0aGlzLnRhcmdldEl0ZW1zKTtcbiAgfVxuICAvLyBNZXRob2QgY2FsbGVkIHVwb24gYSBrZXlzdHJva2UgdG8gYmVnaW4gdGhlIHByb2Nlc3Mgb2Ygd2FpdGluZyBmb3IgYSAyIHNlY29uZCBwYXVzZSBpbiBrZXlzdHJva2VzXG4gIHRleHRDaGFuZ2UoZSkge1xuICAgIHRoaXMudGVtcFN0cmluZyA9IGU7XG4gICAgdGhpcy50ZXh0U3ViamVjdC5uZXh0KGUpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGhvdXQgbG9jYXRpb25zXG4gIGNvbnN0cnVjdExvY2FsbHkoKSB7XG4gICAgLy8gY29uc3QgcmVndWxhclRleHRDbGFzcyA9IHRoaXMucmVndWxhckNsYXNzID8gdGhpcy5yZWd1bGFyQ2xhc3MgOiAncmVnVHh0JztcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgdGhpcy5yZWd1bGFyQ2xhc3MgKyAnXCI+JztcbiAgICBjb25zdCBhbmFseXNpc091dHB1dCA9IGxvY2FsQW5hbHlzaXModGhpcy50YXJnZXRJdGVtcywgdGhpcy50ZW1wU3RyaW5nLCB0aGlzLmNhc2VTZW5zaXRpdmUpO1xuICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyBhbmFseXNpc091dHB1dCArICcgPC9zcGFuPic7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aCBsb2NhdGlvbnNcbiAgY29uc3RydWN0RXh0ZXJuYWxseSgpIHtcbiAgICBjb25zdCBiZWdpbm5pbmcgPSAnPHNwYW4gY2xhc3M9XCInICsgdGhpcy5yZWd1bGFyQ2xhc3MgKyAnXCI+JztcbiAgICBsZXQgbG9jYXRpb25DaGVja2VyID0gdHJ1ZVxuICAgIGNvbnN0IGVycm9yZWRJdGVtcyA9IFtdXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgIGlmICghaXRlbS5sb2NhdGlvbikge1xuICAgICAgICBlcnJvcmVkSXRlbXMucHVzaChpdGVtKVxuICAgICAgICBsb2NhdGlvbkNoZWNrZXIgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobG9jYXRpb25DaGVja2VyKSB7XG4gICAgICBjb25zdCBhbmFseXNpc091dHB1dCA9IG1ha2VTdHJpbmcodGhpcy50YXJnZXRJdGVtcywgdGhpcy50ZW1wU3RyaW5nKVxuICAgICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIGFuYWx5c2lzT3V0cHV0ICsgJyA8L3NwYW4+J1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZXJyb3JlZEl0ZW1zVGV4dCA9ICcnXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZXJyb3JlZEl0ZW1zKSB7XG4gICAgICAgIGVycm9yZWRJdGVtc1RleHQgPSBlcnJvcmVkSXRlbXNUZXh0ICsgaXRlbS50ZXh0ICsgJyAgJ1xuICAgICAgfVxuICAgICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9XG4gICAgICAgICdBbiBlcnJvciBvY2N1cmVkLiAgVGhlIGZvbGxvd2luZyBpdGVtcyBkaWQgbm90IGhhdmUgYSB2YWxpZCBpZGVudGlmaWVkIGluZGV4IGxvY2F0aW9uOiAnICsgZXJyb3JlZEl0ZW1zVGV4dFxuICAgICAgICArICdFaXRoZXIgcHJvdmlkZSBwcm9wZXIgaW5kZXggbG9jYXRpb25zIG9mIGVhY2ggaXRlbSB0byBiZSBoaWdobGlnaHRlZCBvciBzZXQgbG9jYWxBbmFseXNpcyB0byB0cnVlLidcbiAgICB9XG5cbiAgfVxuXG5cblxuICAvLyBBQ0NFU1NJQklMSVRZXG4gIC8vIE1ldGhvZCB0byBkaXJlY3QgdGhlIGZvY3VzIG9mIGFueSBjbGljayB0byB0aGUgZGVzaXJlZCBsb2NhdGlvblxuICBmb2N1c0lucHV0KCkge1xuICAgIGNvbnNvbGUubG9nKCdmb2N1cycpO1xuICAgIGlmICh0aGlzLmxhc3RJbnB1dCkge1xuICAgICAgdGhpcy5sYXN0SW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wbGFjZUNhcmV0QXRFbmQodGhpcy5sYXN0SW5wdXQubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHBsYWNlIHRoZSBjYXJldCBmb2N1cyBhdCB0aGUgZW5kIG9mIHRoZSBsYXN0IGl0ZW0gb2YgdGhlIHRleHQgYXJyYXlcbiAgcGxhY2VDYXJldEF0RW5kKGVsKSB7XG4gICAgZWwuZm9jdXMoKVxuICAgIGlmICh0eXBlb2Ygd2luZG93LmdldFNlbGVjdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVSYW5nZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKVxuICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsKVxuICAgICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpXG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKVxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEFsbCgpIHtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnc2VsZWN0QWxsJywgZmFsc2UsIG51bGwpXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBsb2NhbEFuYWx5c2lzKHNlYXJjaFRhcmdldHMsIHN0ciwgY2FzZVNlbnNpdGl2ZSkge1xuICBpZiAoY2FzZVNlbnNpdGl2ZSkge1xuICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfVxuICB9XG4gIGNvbnN0IG91dHB1dCA9IFtdXG4gIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwXG4gICAgbGV0IGluZGV4XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nXG4gICAgfVxuICAgIHdoaWxlICgoaW5kZXggPSBzdHIuaW5kZXhPZihpdGVtLnRleHQsIHN0YXJ0SW5kZXgpKSA+IC0xKSB7XG4gICAgICBsZXQgaW5kZXhJdGVtID0ge1xuICAgICAgICB0ZXh0OiBpdGVtLnRleHQsXG4gICAgICAgIGxvY2F0aW9uOiBbaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuXSxcbiAgICAgICAgY3NzOiBpdGVtLmNzc1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goaW5kZXhJdGVtKVxuICAgICAgc3RhcnRJbmRleCA9IGluZGV4ICsgc2VhcmNoU3RyTGVuO1xuICAgIH1cbiAgfVxuICAvLyBjb25zb2xlLmxvZyhvdXRwdXQubGVuZ3RoKVxuICBpZiAob3V0cHV0Lmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnNvbGUubG9nKFwibm90aGluZ1wiKVxuICAgIHJldHVybiBzdHJcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbWFrZVN0cmluZyhvdXRwdXQsIHN0cilcbiAgfVxuICAvLyBvdXRwdXQuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gIC8vICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIC8vIH0pXG59XG5cbmZ1bmN0aW9uIG1ha2VTdHJpbmcoc2VhcmNoUmVzdWx0cywgb3JpZ2luYWxfdGV4dCkge1xuICBzZWFyY2hSZXN1bHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLmxvY2F0aW9uWzBdIC0gYi5sb2NhdGlvblswXVxuICB9KVxuICBsZXQgZmluYWxUZXh0ID0gJydcbiAgbGV0IHN0YXJ0ID0gMFxuICBsZXQgZW5kID0gc2VhcmNoUmVzdWx0c1swXS5sb2NhdGlvblswXVxuICBsZXQgbWlkZGxlID0gJydcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWFyY2hSZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0YXJ0ID09PSAwKSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKSArXG4gICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCInICsgc2VhcmNoUmVzdWx0c1tpXS5jc3MgKyAnXCI+JyArIHNlYXJjaFJlc3VsdHNbaV0udGV4dCArICc8L3NwYW4+J1xuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXVxuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyAnPHNwYW4gY2xhc3M9XCInICsgc2VhcmNoUmVzdWx0c1tpXS5jc3MgKyAnXCI+JyArIHNlYXJjaFJlc3VsdHNbaV0udGV4dCArICc8L3NwYW4+J1xuICAgIH1cblxuICAgIGlmIChzZWFyY2hSZXN1bHRzW2kgKyAxXSkge1xuICAgICAgbWlkZGxlID0gb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXSwgc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF0pXG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBtaWRkbGVcbiAgICAgIHN0YXJ0ID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF1cbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzFdXG4gICAgfVxuXG4gICAgaWYgKGkgPT09IChzZWFyY2hSZXN1bHRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICBmaW5hbFRleHQgPSBmaW5hbFRleHQgKyBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhlbmQsIG9yaWdpbmFsX3RleHQubGVuZ3RoKVxuICAgIH1cbiAgfVxuICBjb25zb2xlLmxvZyhmaW5hbFRleHQpXG4gIHJldHVybiBmaW5hbFRleHRcbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgfSBmcm9tICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW05nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwiU3ViamVjdCIsImRlYm91bmNlVGltZSIsInRzbGliXzEuX192YWx1ZXMiLCJDb21wb25lbnQiLCJSZW5kZXJlcjIiLCJJbnB1dCIsIk91dHB1dCIsIlZpZXdDaGlsZCIsIk5nTW9kdWxlIiwiQnJvd3Nlck1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO1FBT0U7U0FBaUI7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