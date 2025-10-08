import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../tasks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList  implements OnInit {
  tasks$: Observable<any[]> | undefined;

  constructor(private tasksService: TasksService) { }
  
  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks();
  }
}
