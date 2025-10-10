import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TasksService } from "../tasks.service"
import type { Observable } from "rxjs"
import { Header } from "./header/header"
import { Stats } from "./stats/stats"
import { CardHeader } from "./card-header/card-header"
import { TaskCard } from "./task-card/task-card"
import { Instructions } from "./instructions/instructions"
import { EmptyTasks } from "./empty-tasks/empty-tasks"
import { LoadingTemplate } from "../loading-template/loading-template"

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [CommonModule, 
    Header, 
    Stats, 
    CardHeader, 
    LoadingTemplate,
    TaskCard,
    EmptyTasks,
    Instructions    
  ],
  templateUrl: "./task-list.html",
  styleUrl: "./task-list.css",
})
export class TaskList implements OnInit {
  loading = true;
  
  // Observables del servicio (inicializados después del constructor)
  tasks$!: Observable<any[]>;
  groupedTasks$!: Observable<{ [key: string]: any[] }>;
  categories$!: Observable<string[]>;

  // Getters para mantener compatibilidad con el template
  get tasks() { return this.tasksService.currentTasks; }
  get groupedTasks() { return this.tasksService.currentGroupedTasks; }
  get categories() { return this.tasksService.currentCategories; }

  constructor(private tasksService: TasksService) {
    // Inicializar observables después del constructor
    this.tasks$ = this.tasksService.tasks$;
    this.groupedTasks$ = this.tasksService.groupedTasks$;
    this.categories$ = this.tasksService.categories$;
  }

  ngOnInit(): void {
    this.loading = true;
    
    setTimeout(() => {
      this.tasksService.getTasks().subscribe(() => {
        this.loading = false;
      });
    }, 1500);
  }

  // Métodos de UI para Drag and Drop (solo manejan eventos de UI)
  onDragStart(event: DragEvent, task: any, fromCategory: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          task: task,
          fromCategory: fromCategory,
        }),
      );
    }
    // Solo efectos visuales
    (event.target as HTMLElement).classList.add("dragging");
  }

  onDragEnd(event: DragEvent): void {
    (event.target as HTMLElement).classList.remove("dragging");
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "move";
    (event.currentTarget as HTMLElement).classList.add("drag-over");
  }

  onDragLeave(event: DragEvent): void {
    (event.currentTarget as HTMLElement).classList.remove("drag-over");
  }

  onDrop(event: DragEvent, toCategory: string): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.remove("drag-over");

    const data = JSON.parse(event.dataTransfer!.getData("text/plain"));
    const task = data.task;
    const fromCategory = data.fromCategory;

    if (fromCategory !== toCategory) {
      // Delegar la lógica al servicio
      this.tasksService.moveTaskToCategory(task.id, fromCategory, toCategory);
    }
  }

  onDropReorder(event: DragEvent, targetTask: any, category: string): void {
    event.preventDefault();
    event.stopPropagation();

    const data = JSON.parse(event.dataTransfer!.getData("text/plain"));
    const draggedTask = data.task;
    const fromCategory = data.fromCategory;

    if (fromCategory === category && draggedTask.id !== targetTask.id) {
      // Delegar la lógica al servicio
      this.tasksService.reorderTaskInCategory(draggedTask.id, targetTask.id, category);
    }
  }

  // Método delegado para obtener colores
  getCategoryColor(category: string): string {
    return this.tasksService.getCategoryColor(category);
  }
}
