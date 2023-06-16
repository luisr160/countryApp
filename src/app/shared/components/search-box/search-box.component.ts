import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy{

  private debouncer: Subject<string> = new Subject();

  private debouncerSubscription?:Subscription;

  @Input()
  public placeholder:string = ''

  @Input()
  public initialValue:string = '';

  @Output()
  public onDebounce:EventEmitter<string> = new EventEmitter()

  constructor() { }

  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe(); 
  }

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
    .pipe(
      debounceTime(250)
    )
    .subscribe( value => {
      this.onDebounce.emit(value);
    })
  }

  public onKeyPress(value:string):void{
    this.debouncer.next( value );
  }

}
