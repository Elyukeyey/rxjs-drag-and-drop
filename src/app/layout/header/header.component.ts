import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
  <header>
  	<h1>Drag & drop</h1>
    <p>with RxJS and Angular</p>
  </header>
  `,
  styles: [`header {
      width: 100%;
      text-align: center;
  }`]
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}