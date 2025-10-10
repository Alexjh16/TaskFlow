import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//definar la query para graphql

const GET_TASKS_QUERY = gql`
  query GetTasks{
    tasks {
      id
      title
      description
      is_completed
      category {
        id
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  public readonly GET_TASKS_QUERY = GET_TASKS_QUERY;

  // Estado centralizado
  private tasksSubject = new BehaviorSubject<any[]>([]);
  private groupedTasksSubject = new BehaviorSubject<{ [key: string]: any[] }>({});
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  private categoryColorsSubject = new BehaviorSubject<{ [key: string]: string }>({});

  // Observables públicos
  public tasks$ = this.tasksSubject.asObservable();
  public groupedTasks$ = this.groupedTasksSubject.asObservable();
  public categories$ = this.categoriesSubject.asObservable();
  public categoryColors$ = this.categoryColorsSubject.asObservable();

  // Paleta de colores
  private colorPalette: string[] = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
  ];

  constructor(private apollo: Apollo) { }

  //método para obtener las tareas
  getTasks(): Observable<any[]> {
    return this.apollo.watchQuery<any> ({
      query: GET_TASKS_QUERY,
      //usar no cache para asegurar  que siempre vaya al servidor al inicio
      fetchPolicy: 'no-cache'
    }).valueChanges.pipe(
      //mapear el resultado para obtener solo las tareas
      map(result => result.data.tasks),
      tap(tasks => {
        this.tasksSubject.next(tasks);
        this.processTasksData(tasks);
      })
    );
  }

  // Procesar y agrupar tareas
  private processTasksData(tasks: any[]): void {
    const { groupedTasks, categories, categoryColors } = this.groupTasksByCategory(tasks);
    this.groupedTasksSubject.next(groupedTasks);
    this.categoriesSubject.next(categories);
    this.categoryColorsSubject.next(categoryColors);
  }

  // Agrupar tareas por categoría
  groupTasksByCategory(tasks: any[]): { 
    groupedTasks: { [key: string]: any[] }, 
    categories: string[], 
    categoryColors: { [key: string]: string } 
  } {
    const groupedTasks: { [key: string]: any[] } = {};
    const categories: string[] = [];
    const categoryColors: { [key: string]: string } = {};

    tasks.forEach((task) => {
      const categoryName = task.category.name;

      if (!groupedTasks[categoryName]) {
        groupedTasks[categoryName] = [];
        categories.push(categoryName);
        categoryColors[categoryName] = this.colorPalette[categories.length - 1] || this.colorPalette[0];
      }

      groupedTasks[categoryName].push(task);
    });

    return { groupedTasks, categories, categoryColors };
  }

  // Obtener color de categoría
  getCategoryColor(category: string): string {
    const colors = this.categoryColorsSubject.value;
    return colors[category] || this.colorPalette[0];
  }

  // Mover tarea a otra categoría
  moveTaskToCategory(taskId: string, fromCategory: string, toCategory: string): void {
    const currentGroupedTasks = { ...this.groupedTasksSubject.value };
    
    // Encontrar y remover de la categoría original
    const fromIndex = currentGroupedTasks[fromCategory].findIndex((t: any) => t.id === taskId);
    if (fromIndex > -1) {
      const task = currentGroupedTasks[fromCategory][fromIndex];
      currentGroupedTasks[fromCategory].splice(fromIndex, 1);
      
      // Agregar a la nueva categoría
      const updatedTask = { ...task, category: { ...task.category, name: toCategory } };
      currentGroupedTasks[toCategory].push(updatedTask);
      
      // Actualizar estado
      this.groupedTasksSubject.next(currentGroupedTasks);
      
      console.log(`Tarea "${task.title}" movida de "${fromCategory}" a "${toCategory}"`);
    }
  }

  // Reordenar tareas dentro de la misma categoría
  reorderTaskInCategory(draggedTaskId: string, targetTaskId: string, category: string): void {
    const currentGroupedTasks = { ...this.groupedTasksSubject.value };
    const tasks = [...currentGroupedTasks[category]];
    
    const draggedIndex = tasks.findIndex((t: any) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t: any) => t.id === targetTaskId);

    if (draggedIndex > -1 && targetIndex > -1 && draggedTaskId !== targetTaskId) {
      // Remover el elemento arrastrado
      const [draggedTask] = tasks.splice(draggedIndex, 1);
      
      // Insertarlo en la nueva posición
      const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
      tasks.splice(newTargetIndex + 1, 0, draggedTask);
      
      // Actualizar estado
      currentGroupedTasks[category] = tasks;
      this.groupedTasksSubject.next(currentGroupedTasks);
    }
  }

  // Getters para el estado actual
  get currentTasks(): any[] {
    return this.tasksSubject.value;
  }

  get currentGroupedTasks(): { [key: string]: any[] } {
    return this.groupedTasksSubject.value;
  }

  get currentCategories(): string[] {
    return this.categoriesSubject.value;
  }

  get currentCategoryColors(): { [key: string]: string } {
    return this.categoryColorsSubject.value;
  }
}
