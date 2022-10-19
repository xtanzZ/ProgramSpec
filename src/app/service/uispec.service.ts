import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FormType } from '../model/formtype';
import { PageImage } from '../model/pageimage';
import { UISpec } from '../model/uispec';
import { uispecFiltter } from '../model/uispec-filtter';

@Injectable({
  providedIn: 'root'
})
export class UispecService {

  public spec: number = 3;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private uispec$ = new Subject<UISpec>();

  getUISpec() {
    return this.uispec$;
  }

  hasTemps(): boolean {
    return this.uispecs$.getValue().length > 0;
  }

  queryUISpecById(id: number): void {
    let temp: UISpec;
    console.log('this.uispecs$.getValue()', this.uispecs$.getValue())
    // ตรวจสอบว่ามีการค้นหา Registation[] มาแล้วหรือยัง
    if (this.hasTemps() && this.spec == 3) {
      // เลือก Registation จาก Registation[] ด้วยการใช้ filter
      temp = this.uispecs$.getValue().find(uispec => uispec.uispecId == id) ?? {} as UISpec;
      // ส่ง Registation ที่หาได้เข้าไปที่ตัวแปร Obserable
      console.log('find UISpec', temp)
      this.uispec$.next(temp);
    } else {

      // ไม่มี Registation[] เก็บอยู่ให้ค้นมาจาก api
      this.http.get<UISpec>(`/api/uispecs/${id}`).subscribe(response => {
        // ส่ง Registation ที่หาได้เข้าไปที่ตัวแปร Obserable
        console.log('query UISpec', response)
        this.uispec$.next(response);
      });
    }
  }

  /////////////////////


  private uispecs$ = new BehaviorSubject<UISpec[]>([]);

  getUISpecs() {
    return this.uispecs$ 
  }

  queryUISpecs(UISpec: uispecFiltter) {
    let httpParams = new HttpParams();
    if (UISpec.pageImage) {
      httpParams = httpParams.append('pageImageName', '%' + UISpec.pageImage + '%');
    }
    console.log("httpParams : " + httpParams)

    return this.http.get<UISpec[]>('/api/uispecs/queryUISpecsByCondition', { params: httpParams }).subscribe
      (response => {
        console.log("value : " + JSON.stringify(response))
        this.uispecs$ .next(response);
      })


  }

  //////////////////

  addUISpec(uispec: any) {
    return this.http.post<UISpec>('/api/uispecs', uispec).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Add UISpec success.' });
      })
    )
  }

  editUISpec(uispec: UISpec) {
    console.log("1 :"+JSON.stringify(uispec))
    console.log("2 :"+uispec.uispecId)
    return this.http.put<UISpec>(`/api/uispecs/${uispec.uispecId}`, uispec).pipe(
      tap(response => {
        this.uispec$.next(response);
        // update Device[]
        this.uispecs$.next(
          this.uispecs$.value.map((table: UISpec) =>
            table.uispecId === response.uispecId ? response : table
          )
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Edit UISpec success.' });
      })
    );
    
  }

  /////////////////////
  private formtype$ = new BehaviorSubject<FormType[]>([]);

  callApiGetFormType() {
    if (this.formtype$.value.length === 0) {
      this.http.get<FormType[]>('/api/formtype').subscribe(response => {
        this.formtype$.next(response)
      });
    }
  }

  getFormType() {
    return this.formtype$;
  }

  /////////////////////
  getUISpecsPdf(){
    return this.http.get<UISpec[]>(`/api/uispecs`);
  }

  getUISpecsPdfId(id: number){
    return this.http.get<UISpec[]>(`/api/uispecs/${id}`);
  }

  ////////////////////
  deleteUISpec(id: number) {
    return this.http.delete(`/api/uispecs/${id}`).pipe(
      tap(() => {
        this.uispec$.next({} as UISpec);
        this.uispecs$.next(
          // filter Registation[] ด้วย id แล้วเอา Registation[] ที่เหลือใส่เข้าไปที่ BehaviorSubject เพื่อ update Table
          this.uispecs$.value.filter((uispec: UISpec) => uispec.uispecId !== id)
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Delete UISpec success.' })
      })
    );
  }


}
