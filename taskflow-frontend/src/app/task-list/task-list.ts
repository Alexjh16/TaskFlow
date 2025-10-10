import { Component, type OnInit, ViewChild, TemplateRef } from "@angular/core"
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
  @ViewChild(LoadingTemplate) loadingComponent!: LoadingTemplate;
  loading = true;
  tasks$: Observable<any[]> | undefined
  tasks: any[] = []
  groupedTasks: { [key: string]: any[] } = {}
  categories: string[] = []
  categoryColors: { [key: string]: string } = {}
  colorPalette: string[] = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
  ]

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loading = true;
    this.tasks$ = this.tasksService.getTasks()

    
    setTimeout(() => {
      if (this.tasks$) {
        this.tasks$.subscribe((tasks) => {
          this.tasks = tasks
          this.groupTasksByCategory()
          this.loading = false;
        })
      }
    }, 1500);
  }

  groupTasksByCategory(): void {
    this.groupedTasks = {}
    this.categories = []

    this.tasks.forEach((task) => {
      const categoryName = task.category.name

      if (!this.groupedTasks[categoryName]) {
        this.groupedTasks[categoryName] = []
        this.categories.push(categoryName)
        this.categoryColors[categoryName] = this.colorPalette[this.categories.length - 1] || this.colorPalette[0]
      }

      this.groupedTasks[categoryName].push(task)
    })
  }

  getCategoryColor(category: string): string {
    return this.categoryColors[category] || this.colorPalette[0]
  }

  // Métodos para Drag and Drop
  onDragStart(event: DragEvent, task: any, fromCategory: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          task: task,
          fromCategory: fromCategory,
        }),
      )
    }
    // Agregar clase visual
    ;(event.target as HTMLElement).classList.add("dragging")
  }

  onDragEnd(event: DragEvent): void {
    ;(event.target as HTMLElement).classList.remove("dragging")
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.dataTransfer!.dropEffect = "move"
    ;(event.currentTarget as HTMLElement).classList.add("drag-over")
  }

  onDragLeave(event: DragEvent): void {
    ;(event.currentTarget as HTMLElement).classList.remove("drag-over")
  }

  onDrop(event: DragEvent, toCategory: string): void {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).classList.remove("drag-over")

    const data = JSON.parse(event.dataTransfer!.getData("text/plain"))
    const task = data.task
    const fromCategory = data.fromCategory

    if (fromCategory !== toCategory) {
      // Remover de la categoría original
      const fromIndex = this.groupedTasks[fromCategory].findIndex((t) => t.id === task.id)
      if (fromIndex > -1) {
        this.groupedTasks[fromCategory].splice(fromIndex, 1)
      }

      // Agregar a la nueva categoría
      const updatedTask = { ...task, category: { ...task.category, name: toCategory } }
      this.groupedTasks[toCategory].push(updatedTask)

      console.log(`Tarea "${task.title}" movida de "${fromCategory}" a "${toCategory}"`)
    }
  }

  // Reordenar dentro de la misma categoría
  onDropReorder(event: DragEvent, targetTask: any, category: string): void {
    event.preventDefault()
    event.stopPropagation()

    const data = JSON.parse(event.dataTransfer!.getData("text/plain"))
    const draggedTask = data.task
    const fromCategory = data.fromCategory

    if (fromCategory === category && draggedTask.id !== targetTask.id) {
      const tasks = this.groupedTasks[category]
      const draggedIndex = tasks.findIndex((t) => t.id === draggedTask.id)
      const targetIndex = tasks.findIndex((t) => t.id === targetTask.id)

      if (draggedIndex > -1 && targetIndex > -1) {
        // Remover el elemento arrastrado
        tasks.splice(draggedIndex, 1)

        // Insertarlo en la nueva posición
        const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex
        tasks.splice(newTargetIndex + 1, 0, draggedTask)
      }
    }
  }
}
