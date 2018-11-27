import {
  Component,
  OnInit,
  ViewChild, Renderer2, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { TargetArrayItem } from './classes/targetTextItem.class';
import { TargetItem } from './classes/targetItems.class';

@Component({
  selector: 'lib-ng-input-highlighter',
  templateUrl: './ng-input-highlighter.html',
  styleUrls: ['./ng-input-highlighter.css']
})

export class NgInputHighlighterComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() targetItems: Array<TargetItem> = []; // analysis inside component: array of items to find
  @Input() localAnalysis = true
  @Input() boxHeight = 'M'
  // @Input() highContrast = true
  @Input() fontClass = 'regularText' // optional class for input of style for regular text in box
  @Input() boxClass = 'none'
  @Input() boxFocus = 'focused'
  @Input() initFocus = true // allow for option to focus on component text box initially, recommended for accessibility
  @Input() caseSensitive = false; // allow for option to select case sensitivity- default to off
  @Output() currentText = new EventEmitter<string>(); // current text string, will output for analysis or other work outside

  @ViewChild('lastInput') lastInput: ElementRef;
  @ViewChild('inputBox') inputBox: ElementRef;

  private textSubject: Subject<string> = new Subject()
  public responsePending = false
  public textArray: Array<TargetArrayItem> = []
  public textHTMLstring: string
  public tempString = ''
  public boxSize: String

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
  // Timer to check when to send request to text analysis
    this.textSubject.pipe(
      debounceTime(2000)
    ).subscribe(text => {
      console.log(text);
      this.responsePending = true;
      this.currentText.emit(this.tempString);
      // If we're doing local analysis, begin the process, otherwise- wait for response from service
      if (this.localAnalysis) {
        this.constructLocally()
        setTimeout(() => {
          this.responsePending = false
          this.focusInput()
        }, 500)
      }
    })

    if (this.boxHeight === 'XS') {
      this.boxSize = 'xsmall'
    } else if (this.boxHeight === 'S') {
      this.boxSize = 'small'
    } else if (this.boxHeight === 'L') {
      this.boxSize = 'large'
    } else if (this.boxHeight === 'XL') {
      this.boxSize = 'xlarge'
    } else {
      this.boxSize = 'medium'
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((this.targetItems.length > 0) && (!this.localAnalysis)) {
      if (changes.targetItems) {
        this.constructExternally()
        setTimeout(() => {
          this.responsePending = false
          this.focusInput()
        }, 500)
      }
    }
  }

  ngAfterViewInit() {
    // Add event listeners to the DOM elements after rendered, allowing for box-border
    this.renderer.listen(this.lastInput.nativeElement, 'focus', () => {
      this.renderer.addClass(this.inputBox.nativeElement, this.boxFocus);
    });
    this.renderer.listen(this.lastInput.nativeElement, 'blur', () => {
      this.renderer.removeClass(this.inputBox.nativeElement, this.boxFocus);
    });
    // Focus the caret at the end of the box
    if (this.initFocus) {
      this.focusInput();
    }
    console.log('targetItems', this.targetItems);
  }
  // Method called upon a keystroke to begin the process of waiting for a 2 second pause in keystrokes
  textChange(e) {
    this.tempString = e;
    this.textSubject.next(e);
  }

  // Method to construct the html string from an input text array without locations
  constructLocally() {
    // const regularTextClass = this.regularClass ? this.regularClass : 'regTxt';
    const beginning = '<span class="' + this.fontClass + '">';
    const analysisOutput = localAnalysis(this.targetItems, this.tempString, this.caseSensitive);
    this.textHTMLstring = beginning + analysisOutput + ' </span>';
  }

  // Method to construct the html string from an input text array with locations
  constructExternally() {
    const beginning = '<span class="' + this.fontClass + '">';
    let locationChecker = true
    const erroredItems = []
    if (this.targetItems.length === 0) {
      this.textHTMLstring = beginning + this.tempString + ' </span>'
    } else {
      for (const item of this.targetItems) {
        if (!item.location) {
          erroredItems.push(item)
          locationChecker = false
        }
      }
      if (locationChecker) {
        const analysisOutput = makeString(this.targetItems, this.tempString)
        this.textHTMLstring = beginning + analysisOutput + ' </span>'
      } else {
        let erroredItemsText = ''
        for (const item of erroredItems) {
          erroredItemsText = erroredItemsText + item.text + '  '
        }
        this.textHTMLstring =
          'An error occured.  The following items did not have a valid identified index location: ' + erroredItemsText
          + 'Either provide proper index locations of each item to be highlighted or set localAnalysis to true.'
      }
    }


  }



  // ACCESSIBILITY
  // Method to direct the focus of any click to the desired location
  focusInput() {
    console.log('focus');
    if (this.lastInput) {
      this.lastInput.nativeElement.focus();
      this.placeCaretAtEnd(this.lastInput.nativeElement);
    }
  }

  // Method to place the caret focus at the end of the last item of the text array
  placeCaretAtEnd(el) {
    el.focus()
    if (typeof window.getSelection !== 'undefined'
      && typeof document.createRange !== 'undefined') {
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  selectAll() {
    document.execCommand('selectAll', false, null)
  }
}


function localAnalysis(searchTargets, str, caseSensitive) {
  const output = []
  for (const item of searchTargets) {
    let startIndex = 0
    let index
    const searchStrLen = item.text.length;
    if (searchStrLen === 0) {
        return 'An error occurred. There appears to be no input search string.'
    }
    let searchingString
    let searchingText
    if (!caseSensitive) {
      searchingString = str.toLowerCase()
      searchingText = item.text.toLowerCase()
    } else {
      searchingString = str
      searchingText = item.text
    }
    while ((index = searchingString.indexOf(searchingText, startIndex)) > -1) {
      const indexItem = {
        text: str.substring(index, index + searchStrLen),
        location: [index, index + searchStrLen],
        css: item.css
      }
      output.push(indexItem)
      startIndex = index + searchStrLen;
    }
  }
  if (output.length === 0) {
    return str
  } else {
    return makeString(output, str)
  }
}

function makeString(searchResults, original_text) {
  searchResults.sort(function(a, b) {
    return a.location[0] - b.location[0]
  })
  let finalText = ''
  let start = 0
  let end = searchResults[0].location[0]
  let middle = ''
  for (let i = 0; i < searchResults.length; i++) {
    if (start === 0) {
      finalText = finalText + original_text.substring(start, end) +
                  '<span class="' + searchResults[i].css + '">' + searchResults[i].text + '</span>'
      end = searchResults[i].location[1]
    } else {
      finalText = finalText + '<span class="' + searchResults[i].css + '">' + searchResults[i].text + '</span>'
    }

    if (searchResults[i + 1]) {
      middle = original_text.substring(searchResults[i].location[1], searchResults[i + 1].location[0])
      finalText = finalText + middle
      start = searchResults[i + 1].location[0]
      end = searchResults[i + 1].location[1]
    }

    if (i === (searchResults.length - 1)) {
      finalText = finalText + original_text.substring(end, original_text.length)
    }
  }
  console.log(finalText)
  return finalText
}
