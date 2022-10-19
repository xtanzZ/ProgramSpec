import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { System } from '../model/system';
import { tap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private system$ = new Subject<System>();

  getSystem() {
    return this.system$;
  }

  querySystemById(id: number): void {
    this.http.get<System>(`/api/system/${id}`).subscribe(response => {
      console.log('query System', response)
      this.system$.next(response);
    });

  }

  /////////////////////

  private systems$ = new BehaviorSubject<System[]>([]);

  callApiGetSystems() {
      this.http.get<System[]>('/api/system').subscribe(response => {
        this.systems$.next(response)
      });
    
  }

  getSystems() {
    return this.systems$;
  }

  /////////////////////

  addSystem(system: System) {
    return this.http.post<System>('/api/system', system).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Add System success.' });
      })
    )
      

  }

  editSystem(system: System) {
    console.log("1 :" + JSON.stringify(system))
    console.log("2 :" + system.systemId)
    return this.http.put<System>(`/api/system/${system.systemId}`, system).pipe(
      tap(response => {
        this.system$.next(response);
        // update Device[]
        this.systems$.next(
          this.systems$.value.map((table: System) =>
            table.systemId === response.systemId ? response : table
          )
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Edit System success.' });
      })
    );


  }

  deleteSystem(id: number) {
    return this.http.delete(`/api/system/${id}`).pipe(
      tap(() => {
        this.system$.next({} as System);
        this.systems$.next(
          this.systems$.value.filter((system: System) => system.systemId !== id)
        );
      })
    );
  }
}
