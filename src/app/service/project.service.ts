import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Project } from '../model/project';
import { tap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private project$ = new Subject<Project>();

  getProject() {
    return this.project$;
  }

  queryProjectById(id: number): void {
    this.http.get<Project>(`/api/project/${id}`).subscribe(response => {
      console.log('query Project', response)
      this.project$.next(response);
    });

  }

  /////////////////////

  private projects$ = new BehaviorSubject<Project[]>([]);

  callApiGetProjects() {
      this.http.get<Project[]>('/api/project').subscribe(response => {
        this.projects$.next(response)
      });
    
  }

  getProjects() {
    return this.projects$;
  }

  /////////////////////

  addProject(project: Project) {
    return this.http.post<Project>('/api/project', project).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Add Project success.' });
      })
    )
      

  }

  editProject(project: Project) {
    console.log("1 :" + JSON.stringify(project))
    console.log("2 :" + project.projectId)
    return this.http.put<Project>(`/api/project/${project.projectId}`, project).pipe(
      tap(response => {
        this.project$.next(response);
        // update Device[]
        this.projects$.next(
          this.projects$.value.map((table: Project) =>
            table.projectId === response.projectId ? response : table
          )
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Edit Project success.' });
      })
    );


  }

  deleteProject(id: number) {
    return this.http.delete(`/api/project/${id}`).pipe(
      tap(() => {
        this.project$.next({} as Project);
        this.projects$.next(
          this.projects$.value.filter((project: Project) => project.projectId !== id)
        );
      })
    );
  }
  
}
