import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PageImage } from '../model/pageimage';
import { pageimageFiltter } from '../model/pageimage-filtter';
import { tap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class PageImageService {

  public pageImageId!: number;
  public page: number = 2;

  constructor(private http: HttpClient, private messageService: MessageService) { }

   private pageimage$ = new Subject<PageImage>();
 
  getPageImage() {
    return this.pageimage$;
  }

  hasTemps(): boolean {
    return this.pageimages$.getValue().length > 0;
  }

  copy(id: number) {
    return this.http.get<any>(`api/pageimages/copy/${id}`).pipe(
      tap(()=> {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Copy success.', life: 2000});
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      })
    )
  }

  queryPageImageById(id: number): void {
    let temp: PageImage;
    console.log('this.pageimages$.getValue()', this.pageimages$.getValue())

    if (this.hasTemps() && this.page == 2) {
   
      console.log("GOd"+this.hasTemps.length)
      temp = this.pageimages$.getValue().find(pageimage => pageimage.pageImageId == id) ?? {} as PageImage;
  
      console.log('find PageImage', temp)
      this.pageimage$.next(temp);
    } else {

      this.http.get<PageImage>(`/api/pageimages/${id}`).subscribe(response => {
       
        console.log('query PageImage', response)
        this.pageimage$.next(response);
      });
    }
  }

  /////////////////////

  private pageimages$ = new BehaviorSubject<PageImage[]>([]);

  getPageImages() {
    return this.pageimages$
  }

  queryPageImages(pageImage: any) {
    let httpParams = new HttpParams();
    if (pageImage.program) {
      httpParams = httpParams.append('programName', '%' + pageImage.program + '%');
    }
    console.log("httpParams : " + httpParams)

    return this.http.get<PageImage[]>('/api/pageimages/queryPageImagesByCondition', { params: httpParams }).pipe
    (tap(response => {
        console.log("value2 : " + response)
        this.pageimages$.next(response);
        console.log("value : " + this.pageimages$)
        
      }))


  }

  //////////////////

  addPageImage(pageimage: any) {
    return this.http.post<PageImage>('/api/pageimages', pageimage).pipe(
      tap(()=> {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Add PageImage success.' });
      })
    )
  }

  editPageImage(pageimage: PageImage) {
    console.log("1 :"+JSON.stringify(pageimage))
    console.log("2 :"+pageimage.pageImageId)
    return this.http.put<PageImage>(`/api/pageimages/${pageimage.pageImageId}`, pageimage).pipe(
      tap(response => {
        this.pageimage$.next(response);
        // update Device[]
        this.pageimages$.next(
          this.pageimages$.value.map((table: PageImage) =>
            table.pageImageId === response.pageImageId ? response : table
          )
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Edit PageImage success.' });
      })
    );
    
  }

  /////////////////////

  callApiGetPageImages() {
      this.http.get<PageImage[]>('/api/pageimages').subscribe(response => {
        this.pageimages$.next(response)
        console.log(response)
      });
    
  }

  //////////////////////
  getPageImagesPdf(){
    return this.http.get<PageImage[]>(`/api/pageimages`);
  }

  getPageImagesPdfId(id: number){
    return this.http.get<PageImage[]>(`/api/pageimages/${id}`);
  }

   ////////////////////
   deletePageImage(id: number) {
    return this.http.delete(`/api/pageimages/${id}`).pipe(
      tap(() => {
        this.pageimage$.next({} as PageImage);
        this.pageimages$.next(
          // filter Registation[] ด้วย id แล้วเอา Registation[] ที่เหลือใส่เข้าไปที่ BehaviorSubject เพื่อ update Table
          this.pageimages$.value.filter((pageimage: PageImage) => pageimage.pageImageId !== id)
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Delete PageImage success.' })
      })
    );
  }

  
}
