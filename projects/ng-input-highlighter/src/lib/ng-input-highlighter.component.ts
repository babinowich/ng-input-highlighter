import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewChild, Renderer2, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TextComponent } from './textComponents/text-block.component'
import { RegularComponent } from './textComponents/text-regular.component'
import { HighlightedComponent } from './textComponents/text-highlight.component'
import { TargetArrayItem } from './classes/targetTextItem.class';
import { TargetItem } from './classes/targetItems.class';
import { TextDirective } from './textComponents/text.directive'

@Component({
  selector: 'lib-ng-input-highlighter',
  templateUrl: './ng-input-highlighter.html',
  styleUrls: ['./ng-input-highlighter.css']
})

export class NgInputHighlighterComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() targetItems: Array<TargetItem> = []; // analysis inside component: array of items to find
  @Input() localAnalysis = true;
  @Input() boxHeight = 'M';
  // @Input() highContrast = true // TO-DO
  @Input() idleTime = 2000 // allow for customization on debounce time
  @Input() fontClass = 'regularText'; // optional class for input of style for regular text in box
  @Input() boxClass = 'none';
  @Input() boxFocus = 'focused';
  @Input() initFocus = true; // allow for option to focus on component text box initially, recommended for accessibility
  @Input() caseSensitive = false; // allow for option to select case sensitivity- default to off
  @Output() currentText = new EventEmitter<string>(); // current text string, will output for analysis or other work outside

  @ViewChild('textArea') textArea: ElementRef
  @ViewChild('emptyText') emptyText: ElementRef
  @ViewChild(TextDirective) targetText: TextDirective
  @ViewChild('inputBox') inputBox: ElementRef;

  private textSubject: Subject<string> = new Subject();
  public responsePending = false;
  public textArray: Array<TargetArrayItem> = []
  public boxSize: String;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2) {
  }

  ngOnInit() {
  // Timer to check when to send request to text analysis
    this.textSubject.pipe(
      debounceTime(2000)
    ).subscribe(text => {
      // console.log('idle and time to process', this.textArea)
      this.responsePending = true
      const new_text = this.obtainText()
      this.targetText.viewContainerRef.clear()
      this.currentText.emit(new_text);
    // If we're doing local analysis, begin the process, otherwise- wait for response from service in onChanges
      if (this.localAnalysis) {
        this.constructLocally(new_text);
        setTimeout(() => {
          this.responsePending = false;
          this.focusInput();
        }, 500)
      }
    })

    if (this.boxHeight === 'XS') {
      this.boxSize = 'xsmall';
    } else if (this.boxHeight === 'S') {
      this.boxSize = 'small';
    } else if (this.boxHeight === 'L') {
      this.boxSize = 'large';
    } else if (this.boxHeight === 'XL') {
      this.boxSize = 'xlarge';
    } else {
      this.boxSize = 'medium';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((this.targetItems.length > 0) && (!this.localAnalysis)) {
      if (changes.targetItems) {
        console.log('new external target input received')
        const new_text = this.obtainText()
        this.targetText.viewContainerRef.clear()
        this.currentText.emit(new_text)
        this.constructExternally(new_text)
        setTimeout(() => {
          this.responsePending = false;
          this.focusInput();
        }, 500)
      }
    }
  }

  ngAfterViewInit() {
    // Add event listeners to the DOM elements after rendered, allowing for box-border
    this.renderer.listen(this.targetText.viewContainerRef.element.nativeElement, 'focus', () => {
      this.renderer.addClass(this.inputBox.nativeElement, this.boxFocus);
    });
    this.renderer.listen(this.targetText.viewContainerRef.element.nativeElement, 'blur', () => {
      this.renderer.removeClass(this.inputBox.nativeElement, this.boxFocus);
    });
    // Method called upon a keystroke to begin the process of waiting for a 2 second pause in keystrokes
    this.renderer.listen(this.textArea.nativeElement, 'keyup', () => {
      console.log('keystroke')
      this.textSubject.next();
    });
    // Focus the caret at the end of the box
    if (this.initFocus) {
      this.focusInput();
    }
  }

  obtainText() {
    console.log('target', this.targetText)
    if (this.textArea.nativeElement.childElementCount < 2) {
      console.log('one child element', this.textArea.nativeElement.childElementCount)
      const text = this.textArea.nativeElement.innerText
      console.log(this.textArea)
      console.log('text obtained', text)
      return text
    } else {
      console.log('lots of children elements', this.textArea.nativeElement.childElementCount)
      const childNodes = this.textArea.nativeElement.childNodes
      let newText = ''
      console.log(this.textArea)

      if (this.textArea.nativeElement.childNodes.length > 1) {
        if (this.textArea.nativeElement.childNodes[1].localName === 'br') {
          console.log('br exists- killing it')
          this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1])
        }
        if (this.textArea.nativeElement.childNodes[1].nodeName === '#text') {
          console.log('clean delete- text exists in [1] exists- extracting it')
          const temp = this.textArea.nativeElement.childNodes[1].textContent
          this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1])
          if (this.textArea.nativeElement.childNodes[1].localName === 'br') {
            console.log('a new br exists- killing it')
            this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1])
          }
          console.log('text obtained', temp)
          return temp
        }
      }
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].innerText) {
          newText = newText + ' ' + childNodes[i].innerText
        }
      }
      console.log('text obtained', newText)
      return newText
    }
  }

  renderComponents(textArray) {
    setTimeout(() => {
      console.log('in render', this.textArea)
      const targetRef = this.targetText
      this.textArea.nativeElement.firstChild.textContent = ''

      console.log('render array', textArray)
      const testMenu = {
        replacementOptions: [
          { viewValue: 'Sushi', value: 'sushi' },
          { viewValue: 'Pizza', value: 'pizza' },
          { viewValue: 'Hot Dogs', value: 'hot dogs' }
        ],
        descriptionItems: [
          'Suggested replacements'
        ]
      }
      for (let i = 0; i < textArray.length; i++) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(textArray[i].component)
        const ref = targetRef.viewContainerRef.createComponent(componentFactory);
        const el = this.targetText.viewContainerRef.element;
        (<TextComponent>ref.instance).text = textArray[i].text;
        (<TextComponent>ref.instance).css = textArray[i].css;
        (<TextComponent>ref.instance).type = textArray[i].type;
        (<TextComponent>ref.instance).confidence = textArray[i].confidence;
        (<TextComponent>ref.instance).menu = textArray[i].menu;
        (<TextComponent>ref.instance).data = textArray[i];

        this.renderer.appendChild(el.nativeElement, ref.location.nativeElement)
      }
    })
  }


  // Method to construct the html string from an input text array without locations
  constructLocally(text) {
    console.log('in construct locally')
    const analysisOutput = localAnalysis(this.targetItems, text, this.caseSensitive);
    this.renderComponents(analysisOutput)
  }

  // Method to construct the html string from an input text array with locations
  constructExternally(text) {
    console.log('in construct externally')
    constructComponentArray(this.targetItems, text)
  }

  // ACCESSIBILITY
  // Method to direct the focus of any click to the desired location
  focusInput() {
    console.log('focus');
    if (this.textArea) {
      this.textArea.nativeElement.focus();
      this.placeCaretAtEnd(this.textArea.nativeElement);
    }
  }

  // Method to place the caret focus at the end of the last item of the text array
  placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection !== 'undefined'
      && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  // Method called to select all text in box if double clicked anywhere in the box
  selectAll() {
    document.execCommand('selectAll', false, null);
  }
}

// all good here, needs to still look for the items locally and send out that to text array
function localAnalysis(searchTargets, str, caseSensitive) {
  console.log('in local analysis')
  const output = [];
  for (const item of searchTargets) {
    let startIndex = 0;
    let index;
    const searchStrLen = item.text.length;
    if (searchStrLen === 0) {
        return 'An error occurred. There appears to be no input search string.';
    }
    let searchingString;
    let searchingText;
    if (!caseSensitive) {
      searchingString = str.toLowerCase();
      searchingText = item.text.toLowerCase();
    } else {
      searchingString = str;
      searchingText = item.text;
    }
    while ((index = searchingString.indexOf(searchingText, startIndex)) > -1) {
      const indexItem = {
        text: str.substring(index, index + searchStrLen),
        location: [index, index + searchStrLen],
        menu: item.menu ? item.menu : null,
        type: item.type ? item.type : null,
        confidence: null,
        css: item.css
      }
      output.push(indexItem);
      startIndex = index + searchStrLen;
    }
  }
  console.log('output from local: ', output)
  return constructComponentArray(output, str);
}


// CHANGE THIS to make complete text array
// take in targets found and indices of all, create a large text array with non-target text
// append type of component to it (RegularComponent or HighlightedComponent)
function constructComponentArray(searchResults, original_text) {
  console.log('in construct array')
  const finalArray = []
  let locationChecker = true;
  const erroredItems = [];
  if (searchResults.length === 0) {
    const onlyItem =  {
      text: original_text,
      css: null,
      menu: null,
      type: null,
      confidence: null,
      component: RegularComponent
    }
    finalArray.push(onlyItem)
    return finalArray
  } else {
    for (const item of searchResults) {
      if (!item.location) {
        erroredItems.push(item);
        locationChecker = false;
      }
    }
    if (!locationChecker) {
      let erroredItemsText = ''
      for (const item of erroredItems) {
        erroredItemsText = erroredItemsText + item.text + '  ';
      }
      const errorText = 'An error occured. The following items did not have a valid identified index location: ' + erroredItemsText
      + 'Either provide proper index locations of each item to be highlighted or set localAnalysis to true.';
      const errorItem =  {
        text: errorText,
        css: null,
        menu: null,
        type: null,
        confidence: null,
        component: RegularComponent
      }
      finalArray.push(errorItem)
      return finalArray
    }
  }
  searchResults.sort(function(a, b) {
    return a.location[0] - b.location[0];
  })
  let start = 0;
  let end = searchResults[0].location[0];
  let middle = '';
  for (let i = 0; i < searchResults.length; i++) {
    if (start === 0) {
      const startItem = {
        text: original_text.substring(start, end),
        css: null,
        menu: null,
        type: null,
        confidence: null,
        component: RegularComponent
      }
      finalArray.push(startItem)
      const firstItem = {
        text: searchResults[i].text,
        css: searchResults[i].css,
        menu: searchResults[i].menu ? searchResults[i].menu : null,
        type: searchResults[i].type ? searchResults[i].type : null,
        confidence: null,
        component: HighlightedComponent
      }
      finalArray.push(firstItem)
      end = searchResults[i].location[1];
    } else {
      const nextItem = {
        text: searchResults[i].text,
        css: searchResults[i].css,
        menu: searchResults[i].menu ? searchResults[i].menu : null,
        type: searchResults[i].type ? searchResults[i].type : null,
        confidence: null,
        component: HighlightedComponent
      }
      finalArray.push(nextItem)
    }

    if (searchResults[i + 1]) {
      middle = original_text.substring(searchResults[i].location[1], searchResults[i + 1].location[0]);
      const middleItem = {
        text: middle,
        css: null,
        menu: null,
        type: null,
        confidence: null,
        component: RegularComponent
      }
      finalArray.push(middleItem)
      start = searchResults[i + 1].location[0];
      end = searchResults[i + 1].location[1];
    }

    if (i === (searchResults.length - 1)) {
      const endItem = {
        text: original_text.substring(end, original_text.length),
        css: null,
        menu: null,
        type: null,
        confidence: null,
        component: RegularComponent
      }
      finalArray.push(endItem)
    }
  }
  console.log('output of array construction:', finalArray)
  return finalArray;
}
