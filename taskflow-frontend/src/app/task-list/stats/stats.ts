import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats {
  @Input() tasks: any[] = [];
  @Input() categories: string[] = [];
}
