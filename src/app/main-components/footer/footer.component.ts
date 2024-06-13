import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  date!: number;
  ngOnInit() {
    this.date = new Date().getFullYear();
  }
}
