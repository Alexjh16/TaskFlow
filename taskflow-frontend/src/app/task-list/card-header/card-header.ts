import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  imports: [],
  templateUrl: './card-header.html',
  styleUrl: './card-header.css'
})
export class CardHeader {
 @Input() category: string = '';
 @Input() groupedTasks: any = {};
}
