import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SystemAnalyst } from '../model/systemanalyst';
import { tap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SystemAnalystService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private systemanalyst$ = new Subject<SystemAnalyst>();

  getSystemAnalyst() {
    return this.systemanalyst$;
  }

  querySystemAnalystById(id: number): void {
    this.http.get<SystemAnalyst>(`/api/systemanalyst/${id}`).subscribe(response => {
      console.log('query SystemAnalyst', response)
      this.systemanalyst$.next(response);
    });

  }

  /////////////////////

  private systemanalysts$ = new BehaviorSubject<SystemAnalyst[]>([]);

  callApiGetSystemAnalysts() {
      this.http.get<SystemAnalyst[]>('/api/systemanalyst').subscribe(response => {
        this.systemanalysts$.next(response)
      });
    
  }

  getSystemAnalysts() {
    return this.systemanalysts$;
  }

  /////////////////////

  addSystemAnalyst(systemanalyst: SystemAnalyst) {
    return this.http.post<SystemAnalyst>('/api/systemanalyst', systemanalyst).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Add SystemAnalyst success.' });
      })
    )
      

  }

  editSystemAnalyst(systemanalyst: SystemAnalyst) {
    console.log("1 :" + JSON.stringify(systemanalyst))
    console.log("2 :" + systemanalyst.systemAnalystId)
    return this.http.put<SystemAnalyst>(`/api/systemanalyst/${systemanalyst.systemAnalystId}`, systemanalyst).pipe(
      tap(response => {
        this.systemanalyst$.next(response);
        // update Device[]
        this.systemanalysts$.next(
          this.systemanalysts$.value.map((table: SystemAnalyst) =>
            table.systemAnalystId === response.systemAnalystId ? response : table
          )
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Edit SystemAnalyst success.' });
      })
    );


  }

  deleteSystemAnalyst(id: number) {
    return this.http.delete(`/api/systemanalyst/${id}`).pipe(
      tap(() => {
        this.systemanalyst$.next({} as SystemAnalyst);
        this.systemanalysts$.next(
          this.systemanalysts$.value.filter((systemanalyst: SystemAnalyst) => systemanalyst.systemAnalystId !== id)
        );
      })
    );
  }
}
