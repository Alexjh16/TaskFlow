import { Component, signal } from '@angular/core';
import { TaskList } from './task-list/task-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskList],
  template:  `
  <main style="padding: 20px;">
      <h1>TaskFlow - Administrador de Tareas</h1>
      <app-task-list></app-task-list>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {
  title = 'taskflow-frontend';
}
