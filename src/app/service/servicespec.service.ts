import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ServiceSpec } from '../model/serviceSpec';
import { tap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ServicespecService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private service$ = new Subject<ServiceSpec>();

  getServiceSpec() {
    return this.service$;
  }

  queryServiceSpecById(id: number): void {
    this.http.get<ServiceSpec>(`/api/service/${id}`).subscribe(response => {
      console.log('query ServiceSpec', response)
      this.service$.next(response);
    });

  }

  /////////////////////

  private services$ = new BehaviorSubject<ServiceSpec[]>([]);

  callApiGetServiceSpecs() {
      this.http.get<ServiceSpec[]>('/api/service').subscribe(response => {
        this.services$.next(response)
      });
    
  }

  getServiceSpecs() {
    return this.services$;
  }

  /////////////////////

  addServiceSpec(service: ServiceSpec) {
    return this.http.post<ServiceSpec>('/api/service', service).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Add Service-Spec success.' });
      })
    )
      

  }

  editServiceSpec(service: ServiceSpec) {
    console.log("1 :" + JSON.stringify(service))
    console.log("2 :" + service.serviceId)
    return this.http.put<ServiceSpec>(`/api/service/${service.serviceId}`, service).pipe(
      tap(response => {
        this.service$.next(response);
        // update Device[]
        this.services$.next(
          this.services$.value.map((table: ServiceSpec) =>
            table.serviceId === response.serviceId ? response : table
          )
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Edit Service-Spec success.' });
      })
    );


  }

  deleteServiceSpec(id: number) {
    return this.http.delete(`/api/service/${id}`).pipe(
      tap(() => {
        this.service$.next({} as ServiceSpec);
        this.services$.next(
          this.services$.value.filter((service: ServiceSpec) => service.serviceId !== id)
        );
      })
    );
  }
    /////////////////////
    getServiceSpecsPdf(){
      return this.http.get<ServiceSpec[]>(`/api/service`);
    }
}
