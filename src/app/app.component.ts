import { Component, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-input-highlighter-app';

  public targetItems = [
    {
      text: 'meow',
      css: 'good'
    },
    {
      text: 'woof',
      css: 'bad'
    }
  ]

  public itemForm: FormGroup


  public analyzedItems = []
  public toggleAdd = false
  public addError = false
  public fullyFilled = false

  constructor(private _fb: FormBuilder) {
    this.itemForm = this._fb.group({
      text: ['', Validators.required],
      css: ['', Validators.required]
    })
  }

  processText(event) {
    console.log('process text!', event)
    this.analyzedItems = localAnalysis(this.targetItems, event)
    console.log(this.analyzedItems)
  }

  removeTargetItem(event) {
    for (let i = 0;  i < this.targetItems.length; i++) {
      if (event.text === this.targetItems[i].text) {
        this.targetItems.splice(i, 1)
      }
    }
    console.log(this.targetItems)
  }

  addTargetItem() {
    this.toggleAdd = true
  }

  submitTargetAdd() {
    let newItem = this.itemForm.value
    this.targetItems.push(newItem)
    this.toggleAdd = false
  }

}

function localAnalysis(searchTargets, str, caseSensitive?) {
  if (caseSensitive) {
    str = str.toLowerCase()
    for (const item of searchTargets) {
      item.text = item.text.toLowerCase()
    }
  }
  const output = []
  for (const item of searchTargets) {
    let startIndex = 0
    let index
    const searchStrLen = item.text.length;
    // if (searchStrLen === 0) {
    //     return 'An error occurred. There appears to be no input search string.'
    // }
    while ((index = str.indexOf(item.text, startIndex)) > -1) {
      let indexItem = {
        text: item.text,
        location: [index, index + searchStrLen],
        css: item.css
      }
      output.push(indexItem)
      startIndex = index + searchStrLen;
    }
  }
  return output
}
