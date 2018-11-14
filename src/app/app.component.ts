import { Component } from '@angular/core';

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

  public analyzedItems = []

  processText(event) {
    console.log('process text!', event)
    this.analyzedItems = localAnalysis(this.targetItems, event)
    console.log(this.analyzedItems)
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
