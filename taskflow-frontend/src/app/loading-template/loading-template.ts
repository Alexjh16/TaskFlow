import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-template',
  imports: [],
  templateUrl: './loading-template.html',
  styleUrl: './loading-template.css'
})
export class LoadingTemplate {
  @Input() path = '';
}
