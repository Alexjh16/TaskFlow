import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-tasks',
  imports: [CommonModule],
  templateUrl: './empty-tasks.html',
  styleUrl: './empty-tasks.css'
})
export class EmptyTasks {
  @Input() category: string = '';
  @Input() groupedTasks: { [key: string]: any[] } = {};

  get isEmpty(): boolean {
    const result = !this.groupedTasks[this.category] || this.groupedTasks[this.category].length === 0;
    console.log(`Category: ${this.category}, isEmpty: ${result}`, this.groupedTasks[this.category]);
    return result;
  }
}
