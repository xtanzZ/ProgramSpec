import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject} from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Program } from '../model/program';
import { ProgramSearch } from '../model/program-search';
import { Project } from '../model/project';
import { Status } from '../model/status';
import { System } from '../model/system';
import { SystemAnalyst } from '../model/systemanalyst';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  public programId!: number;
  public programSelect: Boolean | undefined;
  public programLoading: Boolean = false;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private program$ = new Subject<Program>();

  getProgram() {
    return this.program$;
  }

  hasTemps(): boolean {
    return this.programs$.getValue().length > 0;
  }

  queryProgramById(id: number): void {
    let temp: Program;
    console.log('this.programs$.getValue()', this.programs$.getValue())
    // ตรวจสอบว่ามีการค้นหา Registation[] มาแล้วหรือยัง
    if (this.hasTemps()) {
      // เลือก Registation จาก Registation[] ด้วยการใช้ filter
      temp = this.programs$.getValue().find(program => program.programId == id) ?? {} as Program;
      // ส่ง Registation ที่หาได้เข้าไปที่ตัวแปร Obserable
      console.log('find Program', temp)
      this.program$.next(temp);
    } else {

      // ไม่มี Registation[] เก็บอยู่ให้ค้นมาจาก api
      this.http.get<Program>(`/api/programs/${id}`).subscribe(response => {
        // ส่ง Registation ที่หาได้เข้าไปที่ตัวแปร Obserable
        console.log('query Program', response)
        this.program$.next(response);
      });
    }
  }


  addProgram(program: any) {
    return this.http.post<Program>('/api/programs', program).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Add Program success.' });
      })
    )
  }

  editProgram(program: Program) {
    console.log(program)
    console.log(program.programId)
    return this.http.put<Program>(`/api/programs/${program.programId}`, program).pipe(
      tap(response => {
        this.program$.next(response);
        // update Device[]
        this.programs$.next(
          this.programs$.value.map((table: Program) =>
            table.programId === response.programId ? response : table
          )
        );
        this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Edit Program success.' });
      })
    );
    
  }

   /////////////////////
   private project$ = new BehaviorSubject<Project[]>([]);

   callApiGetProject() {
     if (this.project$.value.length === 0) {
       this.http.get<Project[]>('/api/project').subscribe(response => {
         this.project$.next(response)
       });
     }
   }
 
   getProject() {
     return this.project$;
   }

  /////////////////////
  private system$ = new BehaviorSubject<System[]>([]);

  callApiGetSystem() {
    if (this.system$.value.length === 0) {
      this.http.get<System[]>('/api/system').subscribe(response => {
        this.system$.next(response)
      });
    }
  }

  getSystem() {
    return this.system$;
  }

  /////////////////////
  private systemAnalyst$ = new BehaviorSubject<SystemAnalyst[]>([]);

  callApiGetSystemAnalyst() {
    if (this.systemAnalyst$.value.length === 0) {
      this.http.get<SystemAnalyst[]>('/api/systemanalyst').subscribe(response => {
        this.systemAnalyst$.next(response)
      });
    }
  }

  getSystemAnalyst() {
    return this.systemAnalyst$;
  }
  /////////////////////

  callApiGetProgram() {
      this.http.get<Program[]>('/api/programs').subscribe(response => {
        this.programs$.next(response)
        console.log("Do This++++")
        // console.log("Y program: "+JSON.stringify(response))
      });
    
  }

  getProgramName() {
    return this.http.get<Program[]>('/api/programs')
  
}

  /////////////////////
  private status$ = new BehaviorSubject<Status[]>([]);

  callApiGetStatus() {
    if (this.status$.value.length === 0) {
      this.http.get<Status[]>('/api/status').subscribe(response => {
        this.status$.next(response)
      });
    }
  }

  getStatus() {
    return this.status$;
  }

  /////////////////////
  private programs$ = new BehaviorSubject<Program[]>([]);

  getPrograms() {
    return this.programs$
  }

  queryProjects(program: ProgramSearch) {
    let httpParams = new HttpParams();
    if (program.program) {
      httpParams = httpParams.append('programName', '%' + program.program + '%');
    }
    if (program.employeeName) {
      httpParams = httpParams.append('systemAnalystName', '%' + program.employeeName+ '%');
    }
    if (program.status) {
      httpParams = httpParams.append('statusId', program.status.statusId);
    }
    console.log("httpParams : "+httpParams)

    return this.http.get<Program[]>('/api/programs/queryProgramsByCondition', { params: httpParams }).pipe
    (tap(response => {
        console.log("value : "+JSON.stringify(response))
        this.programs$.next(response);
      })
    );
  }

  /////////////////////
  getProgramPdfId(id: number){
    return this.http.get<Program[]>(`/api/programs/${id}`);
  }

   /////////////////////
   getProgramPdf(){
    return this.http.get<Program[]>(`/api/programs`);
  }

    ////////////////////
    deleteProgram(id: number) {
      return this.http.delete(`/api/programs/${id}`).pipe(
        tap(() => {
          this.program$.next({} as Program);
          this.programs$.next(
            // filter Registation[] ด้วย id แล้วเอา Registation[] ที่เหลือใส่เข้าไปที่ BehaviorSubject เพื่อ update Table
            this.programs$.value.filter((program: Program) => program.programId !== id)
          );
          this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Delete Program success.' })
        })
      );
    }
}
