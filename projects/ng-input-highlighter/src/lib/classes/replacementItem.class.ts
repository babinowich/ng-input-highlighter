
export class ReplacementItem {

    public viewValue: string
    public value: string
    public data?: any
    constructor(
        _viewValue: string,
        _value: string,
        _data?: any
      ) {
        this.viewValue = _viewValue
        this.value = _value
        this.data = _data
      }
}
