import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  constructor(private apollo: Apollo) { }

  //método para obtener las tareas
  getTasks(): Observable<any[]> {
    return this.apollo.watchQuery<any> ({
      query: GET_TASKS_QUERY,
      //usar no cache para asegurar  que siempre vaya al servidor al inicio
      fetchPolicy: 'no-cache'
    }).valueChanges.pipe(
      //mapear el resultado para obtener solo las tareas
      map(result => result.data.tasks)
    );
  }
}
