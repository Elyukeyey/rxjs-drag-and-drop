import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { mergeMap, takeUntil, repeat } from 'rxjs/operators';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  down$: Observable<any>;
  up$: Observable<any>;
  move$: Observable<Object>; // { posX: , posY: }
  @ViewChild('moveSquare') element: ElementRef;
  @ViewChild('faceSpan') faceSpan: ElementRef;
  startX: number;
  startY: number;
  cursor: string;
  position: { top: string, left: string};

  constructor() { }

  ngOnInit() {
    this.position = { top: '100px', left: '100px' }
    this.move$ = fromEvent(this.element.nativeElement, 'mousemove');
    this.down$ = fromEvent(this.element.nativeElement, 'mousedown');
    this.up$ = fromEvent(this.element.nativeElement, 'mouseup');

    this.down$.pipe(
      mergeMap(down => this.move$.pipe(
        takeUntil(this.up$)
        )
      )
    )
    .subscribe(({ clientX, clientY }) => {
      this.position = { top: clientY - this.startY + 'px', left: clientX - this.startX + 'px' };
    });
    

    this.down$.subscribe(({offsetX, offsetY}) => {
      this.faceSpan.nativeElement.innerText = '😖';
      this.cursor = 'grabbing';
      this.startX = offsetX;
      this.startY = offsetY;
    });
    this.up$.subscribe(() => {
      this.faceSpan.nativeElement.innerText = '🤔';
      this.cursor = 'grab'
      
      });
  }

}