import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public targetItems = [
    {
      text: 'meow',
      css: 'good',
      type: 'Animal Sound',
      menu: {
        replacementOptions: [
          { viewValue: 'Mew', value: 'mew' },
          { viewValue: 'Hiss', value: 'hiss' },
          { viewValue: 'Purr', value: 'purr' }
        ],
        descriptionItems: [
          'Suggested cat sounds'
        ]
      }
    },
    {
      text: 'woof',
      css: 'bad',
      type: 'Animal Sound',
      menu: {
        replacementOptions: [
          { viewValue: 'Bark', value: 'bark' },
          { viewValue: 'Grr', value: 'grr' },
          { viewValue: 'Bowwow', value: 'bowwow' }
        ],
        descriptionItems: [
          'Suggested dog sounds'
        ]
      }
    }
  ]
  public menuOptions = [
    {
      replacementOptions: [
        { viewValue: 'Bark', value: 'bark' },
        { viewValue: 'Grr', value: 'grr' },
        { viewValue: 'Bowwow', value: 'bowwow' }
      ],
      descriptionItems: [
        'Suggested dog sounds'
      ]
    },
    {
      replacementOptions: [
        { viewValue: 'Mew', value: 'mew' },
        { viewValue: 'Hiss', value: 'hiss' },
        { viewValue: 'Purr', value: 'purr' }
      ],
      descriptionItems: [
        'Suggested cat sounds'
      ]
    },
    {
      replacementOptions: [
        { viewValue: 'Pizza', value: 'pizza' },
        { viewValue: 'Sushi', value: 'sushi' },
        { viewValue: 'Cheeseburger', value: 'cheeseburger' }
      ],
      descriptionItems: [
        'Suggested deliciousness'
      ]
    }
  ]

  public itemForm: FormGroup
  public analyzedItems = []
  public toggleAdd = false

  constructor(private _fb: FormBuilder) {
    this.itemForm = this._fb.group({
      text: ['', Validators.required],
      css: ['', Validators.required],
      type: [null],
      menu: [null]
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
    this.toggleAdd = this.toggleAdd ? null : true
  }

  submitTargetAdd() {
    const newItem = this.itemForm.value
    for (const i in this.menuOptions) {
      if (this.menuOptions[i].descriptionItems[0] === newItem.menu) {
        newItem.menu = this.menuOptions[i]
      }
    }
    this.targetItems.push(newItem)
    this.toggleAdd = false
    console.log(this.targetItems)
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
      const indexItem = {
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
