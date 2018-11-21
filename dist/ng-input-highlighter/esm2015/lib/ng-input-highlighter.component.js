/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, Renderer2, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
export class NgInputHighlighterComponent {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFpQixLQUFLLEVBQTRCLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEksT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFXOUMsTUFBTTs7OztJQXFCSixZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXOzRCQW5CZixhQUFhOzJCQUNLLEVBQUU7NkJBQ25CLElBQUk7eUJBQ1IsR0FBRzs7eUJBRUgsSUFBSTs2QkFDQSxLQUFLOzJCQUNOLElBQUksWUFBWSxFQUFVOzJCQUtYLElBQUksT0FBTyxFQUFFOytCQUMzQixLQUFLO3lCQUNhLEVBQUU7MEJBRXpCLEVBQUU7S0FJckI7Ozs7SUFFRCxRQUFROztRQUVOLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNuQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQ25CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztZQUV2QyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2dCQUN2QixVQUFVLENBQUMs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R0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoRyxTQUFTLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQTtZQUM5QixLQUFLLEdBQUcsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDeEMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3ZDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3BDLFNBQVMsR0FBRyxTQUFTLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzNFO0tBQ0Y7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3RCLE9BQU8sU0FBUyxDQUFBO0NBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCwgUmVuZGVyZXIyLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBUYXJnZXRBcnJheUl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0VGV4dEl0ZW0uY2xhc3MnO1xuaW1wb3J0IHsgVGFyZ2V0SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRJdGVtcy5jbGFzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZy1pbnB1dC1oaWdobGlnaHRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgcmVndWxhckNsYXNzID0gJ3JlZ3VsYXJUZXh0JyAvLyBvcHRpb25hbCBjbGFzcyBmb3IgaW5wdXQgb2Ygc3R5bGUgZm9yIHJlZ3VsYXIgdGV4dCBpbiBib3hcbiAgQElucHV0KCkgdGFyZ2V0SXRlbXM6IEFycmF5PFRhcmdldEl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIGluc2lkZSBjb21wb25lbnQ6IGFycmF5IG9mIGl0ZW1zIHRvIGZpbmRcbiAgQElucHV0KCkgbG9jYWxBbmFseXNpcyA9IHRydWVcbiAgQElucHV0KCkgYm94SGVpZ2h0ID0gJ00nXG4gIC8vIEBJbnB1dCgpIGhpZ2hDb250cmFzdCA9IHRydWVcbiAgQElucHV0KCkgaW5pdEZvY3VzID0gdHJ1ZSAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIGZvY3VzIG9uIGNvbXBvbmVudCB0ZXh0IGJveCBpbml0aWFsbHksIHJlY29tbWVuZGVkIGZvciBhY2Nlc3NpYmlsaXR5XG4gIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBzZWxlY3QgY2FzZSBzZW5zaXRpdml0eS0gZGVmYXVsdCB0byBvZmZcbiAgQE91dHB1dCgpIGN1cnJlbnRUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7IC8vIGN1cnJlbnQgdGV4dCBzdHJpbmcsIHdpbGwgb3V0cHV0IGZvciBhbmFseXNpcyBvciBvdGhlciB3b3JrIG91dHNpZGVcblxuICBAVmlld0NoaWxkKCdsYXN0SW5wdXQnKSBsYXN0SW5wdXQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Qm94JykgaW5wdXRCb3g6IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSB0ZXh0U3ViamVjdDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKVxuICBwdWJsaWMgcmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgcHVibGljIHRleHRBcnJheTogQXJyYXk8VGFyZ2V0QXJyYXlJdGVtPiA9IFtdXG4gIHB1YmxpYyB0ZXh0SFRNTHN0cmluZzogc3RyaW5nXG4gIHB1YmxpYyB0ZW1wU3RyaW5nID0gJydcbiAgcHVibGljIGJveFNpemU6IFN0cmluZ1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIC8vIFRpbWVyIHRvIGNoZWNrIHdoZW4gdG8gc2VuZCByZXF1ZXN0IHRvIHRleHQgYW5hbHlzaXNcbiAgICB0aGlzLnRleHRTdWJqZWN0LnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMjAwMClcbiAgICApLnN1YnNjcmliZSh0ZXh0ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5jdXJyZW50VGV4dC5lbWl0KHRoaXMudGVtcFN0cmluZyk7XG4gICAgICAvLyBJZiB3ZSdyZSBkb2luZyBsb2NhbCBhbmFseXNpcywgYmVnaW4gdGhlIHByb2Nlc3MsIG90aGVyd2lzZS0gd2FpdCBmb3IgcmVzcG9uc2UgZnJvbSBzZXJ2aWNlXG4gICAgICBpZiAodGhpcy5sb2NhbEFuYWx5c2lzKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TG9jYWxseSgpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKVxuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1hTJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3hzbWFsbCdcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdzbWFsbCdcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnTCcpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdsYXJnZSdcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnWEwnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAneGxhcmdlJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbWVkaXVtJ1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMudGFyZ2V0SXRlbXMubGVuZ3RoID4gMCkgJiYgKCF0aGlzLmxvY2FsQW5hbHlzaXMpKSB7XG4gICAgICBpZiAoY2hhbmdlcy50YXJnZXRJdGVtcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdEV4dGVybmFsbHkoKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KClcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBET00gZWxlbWVudHMgYWZ0ZXIgcmVuZGVyZWQsIGFsbG93aW5nIGZvciBib3gtYm9yZGVyXG4gICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5sYXN0SW5wdXQubmF0aXZlRWxlbWVudCwgJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsICdmb2N1c2VkJyk7XG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5sYXN0SW5wdXQubmF0aXZlRWxlbWVudCwgJ2JsdXInLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgJ2ZvY3VzZWQnKTtcbiAgICB9KTtcbiAgICAvLyBGb2N1cyB0aGUgY2FyZXQgYXQgdGhlIGVuZCBvZiB0aGUgYm94XG4gICAgaWYgKHRoaXMuaW5pdEZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ3RhcmdldEl0ZW1zJywgdGhpcy50YXJnZXRJdGVtcyk7XG4gIH1cbiAgLy8gTWV0aG9kIGNhbGxlZCB1cG9uIGEga2V5c3Ryb2tlIHRvIGJlZ2luIHRoZSBwcm9jZXNzIG9mIHdhaXRpbmcgZm9yIGEgMiBzZWNvbmQgcGF1c2UgaW4ga2V5c3Ryb2tlc1xuICB0ZXh0Q2hhbmdlKGUpIHtcbiAgICB0aGlzLnRlbXBTdHJpbmcgPSBlO1xuICAgIHRoaXMudGV4dFN1YmplY3QubmV4dChlKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRob3V0IGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RMb2NhbGx5KCkge1xuICAgIC8vIGNvbnN0IHJlZ3VsYXJUZXh0Q2xhc3MgPSB0aGlzLnJlZ3VsYXJDbGFzcyA/IHRoaXMucmVndWxhckNsYXNzIDogJ3JlZ1R4dCc7XG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHRoaXMucmVndWxhckNsYXNzICsgJ1wiPic7XG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRoaXMudGVtcFN0cmluZywgdGhpcy5jYXNlU2Vuc2l0aXZlKTtcbiAgICB0aGlzLnRleHRIVE1Mc3RyaW5nID0gYmVnaW5uaW5nICsgYW5hbHlzaXNPdXRwdXQgKyAnIDwvc3Bhbj4nO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkoKSB7XG4gICAgY29uc3QgYmVnaW5uaW5nID0gJzxzcGFuIGNsYXNzPVwiJyArIHRoaXMucmVndWxhckNsYXNzICsgJ1wiPic7XG4gICAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWVcbiAgICBjb25zdCBlcnJvcmVkSXRlbXMgPSBbXVxuICAgIGlmICh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy50ZXh0SFRNTHN0cmluZyA9IGJlZ2lubmluZyArIHRoaXMudGVtcFN0cmluZyArICcgPC9zcGFuPidcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgaWYgKCFpdGVtLmxvY2F0aW9uKSB7XG4gICAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSlcbiAgICAgICAgICBsb2NhdGlvbkNoZWNrZXIgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobG9jYXRpb25DaGVja2VyKSB7XG4gICAgICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbWFrZVN0cmluZyh0aGlzLnRhcmdldEl0ZW1zLCB0aGlzLnRlbXBTdHJpbmcpXG4gICAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPSBiZWdpbm5pbmcgKyBhbmFseXNpc091dHB1dCArICcgPC9zcGFuPidcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBlcnJvcmVkSXRlbXNUZXh0ID0gJydcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICAgIGVycm9yZWRJdGVtc1RleHQgPSBlcnJvcmVkSXRlbXNUZXh0ICsgaXRlbS50ZXh0ICsgJyAgJ1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dEhUTUxzdHJpbmcgPVxuICAgICAgICAgICdBbiBlcnJvciBvY2N1cmVkLiAgVGhlIGZvbGxvd2luZyBpdGVtcyBkaWQgbm90IGhhdmUgYSB2YWxpZCBpZGVudGlmaWVkIGluZGV4IGxvY2F0aW9uOiAnICsgZXJyb3JlZEl0ZW1zVGV4dFxuICAgICAgICAgICsgJ0VpdGhlciBwcm92aWRlIHByb3BlciBpbmRleCBsb2NhdGlvbnMgb2YgZWFjaCBpdGVtIHRvIGJlIGhpZ2hsaWdodGVkIG9yIHNldCBsb2NhbEFuYWx5c2lzIHRvIHRydWUuJ1xuICAgICAgfVxuICAgIH1cblxuXG4gIH1cblxuXG5cbiAgLy8gQUNDRVNTSUJJTElUWVxuICAvLyBNZXRob2QgdG8gZGlyZWN0IHRoZSBmb2N1cyBvZiBhbnkgY2xpY2sgdG8gdGhlIGRlc2lyZWQgbG9jYXRpb25cbiAgZm9jdXNJbnB1dCgpIHtcbiAgICBjb25zb2xlLmxvZygnZm9jdXMnKTtcbiAgICBpZiAodGhpcy5sYXN0SW5wdXQpIHtcbiAgICAgIHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKHRoaXMubGFzdElucHV0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBwbGFjZSB0aGUgY2FyZXQgZm9jdXMgYXQgdGhlIGVuZCBvZiB0aGUgbGFzdCBpdGVtIG9mIHRoZSB0ZXh0IGFycmF5XG4gIHBsYWNlQ2FyZXRBdEVuZChlbCkge1xuICAgIGVsLmZvY3VzKClcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5nZXRTZWxlY3Rpb24gIT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKClcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbClcbiAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKVxuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpXG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICB9XG4gIH1cblxuICBzZWxlY3RBbGwoKSB7XG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ3NlbGVjdEFsbCcsIGZhbHNlLCBudWxsKVxuICB9XG59XG5cblxuZnVuY3Rpb24gbG9jYWxBbmFseXNpcyhzZWFyY2hUYXJnZXRzLCBzdHIsIGNhc2VTZW5zaXRpdmUpIHtcbiAgY29uc3Qgb3V0cHV0ID0gW11cbiAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDBcbiAgICBsZXQgaW5kZXhcbiAgICBjb25zdCBzZWFyY2hTdHJMZW4gPSBpdGVtLnRleHQubGVuZ3RoO1xuICAgIGlmIChzZWFyY2hTdHJMZW4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdBbiBlcnJvciBvY2N1cnJlZC4gVGhlcmUgYXBwZWFycyB0byBiZSBubyBpbnB1dCBzZWFyY2ggc3RyaW5nLidcbiAgICB9XG4gICAgbGV0IHNlYXJjaGluZ1N0cmluZ1xuICAgIGxldCBzZWFyY2hpbmdUZXh0XG4gICAgaWYgKCFjYXNlU2Vuc2l0aXZlKSB7XG4gICAgICBzZWFyY2hpbmdTdHJpbmcgPSBzdHIudG9Mb3dlckNhc2UoKVxuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0clxuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dFxuICAgIH1cbiAgICB3aGlsZSAoKGluZGV4ID0gc2VhcmNoaW5nU3RyaW5nLmluZGV4T2Yoc2VhcmNoaW5nVGV4dCwgc3RhcnRJbmRleCkpID4gLTEpIHtcbiAgICAgIGNvbnN0IGluZGV4SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc3RyLnN1YnN0cmluZyhpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW4pLFxuICAgICAgICBsb2NhdGlvbjogW2luZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbl0sXG4gICAgICAgIGNzczogaXRlbS5jc3NcbiAgICAgIH1cbiAgICAgIG91dHB1dC5wdXNoKGluZGV4SXRlbSlcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgaWYgKG91dHB1dC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gc3RyXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1ha2VTdHJpbmcob3V0cHV0LCBzdHIpXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZVN0cmluZyhzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdXG4gIH0pXG4gIGxldCBmaW5hbFRleHQgPSAnJ1xuICBsZXQgc3RhcnQgPSAwXG4gIGxldCBlbmQgPSBzZWFyY2hSZXN1bHRzWzBdLmxvY2F0aW9uWzBdXG4gIGxldCBtaWRkbGUgPSAnJ1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArICc8c3BhbiBjbGFzcz1cIicgKyBzZWFyY2hSZXN1bHRzW2ldLmNzcyArICdcIj4nICsgc2VhcmNoUmVzdWx0c1tpXS50ZXh0ICsgJzwvc3Bhbj4nXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSlcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG1pZGRsZVxuICAgICAgc3RhcnQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXVxuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMV1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGZpbmFsVGV4dCA9IGZpbmFsVGV4dCArIG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKGZpbmFsVGV4dClcbiAgcmV0dXJuIGZpbmFsVGV4dFxufVxuIl19