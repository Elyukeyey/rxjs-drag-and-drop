import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { mergeMap, takeUntil, skipUntil, repeat } from 'rxjs/operators';

@Component({
  selector: 'app-square',
  template: `
  <div class="square" [style.top]="position.top" [style.left]="position.left"
   [style.cursor]="cursor" [style.transform]="position.transform" #moveSquare>
      <span class="middle" #faceSpan>😏</span>
  </div>
  `,
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  // element Selectors
  @ViewChild('moveSquare', { static: true}) element: ElementRef;
  @ViewChild('faceSpan', {static: true}) faceSpan: ElementRef;
  
  // Observables 
  down$: Observable<any>;
  up$: Observable<any>;
  move$: Observable<Object>;
  leave$: Observable<any>;
  
  // cursor position in the element;
  startX: number;
  startY: number;

  // starting position in the center of the screen
  position = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)'};

  cursor: string;
  

  constructor() { }

  ngOnInit() {
    this.move$ = fromEvent(this.element.nativeElement, 'mousemove');
    this.down$ = fromEvent(this.element.nativeElement, 'mousedown');
    this.up$ = fromEvent(this.element.nativeElement, 'mouseup');
    this.leave$ = fromEvent(this.element.nativeElement, 'mouseleave');


    this.down$.pipe(
      mergeMap(down => this.move$.pipe(
        takeUntil(this.up$),
        takeUntil(this.leave$)
        )
      )
    )
    .subscribe(({ clientX, clientY }: any ) => {
      this.position = { top: clientY - this.startY + 'px', left: clientX - this.startX + 'px', transform: '' };
      this._grab();
    });

    this.down$.subscribe(({offsetX, offsetY}) => {
      this.startX = offsetX;
      this.startY = offsetY;
    });

    
    // for fun only:
    this.up$.subscribe(() => {
      this._letGo();
    });
    this.leave$.pipe(
      skipUntil(this.down$),
      takeUntil(this.up$),
      repeat()
    ).subscribe(() => {
      this._letGo()  
    });

  }

  // for fun only, not cruicial to the proper functioning
  _letGo = (): void => {
    this.faceSpan.nativeElement.innerText = '🤬';
    setTimeout(() => this.faceSpan.nativeElement.innerText = '🤔', 500);
    this.cursor = 'grab';
  }
  _grab = (): void => {
    this.faceSpan.nativeElement.innerText = '😖';
    this.cursor = 'grabbing';
  }

}