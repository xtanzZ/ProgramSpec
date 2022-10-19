import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/model/program';
import { Project } from 'src/app/model/project';
import { Status } from 'src/app/model/status';
import { System } from 'src/app/model/system';
import { SystemAnalyst } from 'src/app/model/systemanalyst';
import { ProgramService } from 'src/app/service/program.service';
import { Mode } from 'src/app/type/mode';

@Component({
  selector: 'app-save-project',
  templateUrl: './save-program.component.html',
  styleUrls: ['./save-program.component.scss']
})
export class SaveProgramComponent implements OnInit {

  programSaveForm: FormGroup = new FormGroup({
    programId: new FormControl(),
    programName: new FormControl(null,Validators.required),
    systemAnalyst: new FormControl(null,Validators.required),
    project: new FormControl(null,Validators.required),
    system: new FormControl(null,Validators.required),
    status: new FormControl(null,Validators.required),
  })
  
  status: Status[] = [];
  project: Project[] = [];
  system: System[] = [];
  systemAnalyst: SystemAnalyst[] = [];

  subscribeProgram!: Subscription
  subscribeStatus!: Subscription
  subscribeSystem!: Subscription
  subscribeProject!: Subscription
  subscribeSystemAnalyst!: Subscription

  mode!: Mode;
  Mode = Mode;

  constructor(private programService: ProgramService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.programService.callApiGetSystemAnalyst();
    this.subscribeSystemAnalyst = this.programService.getSystemAnalyst().subscribe(response => {
      this.systemAnalyst = response;
    });

    this.programService.callApiGetStatus();
    this.subscribeStatus = this.programService.getStatus().subscribe(response => {
      this.status = response;
    });

    this.programService.callApiGetSystem();
    this.subscribeSystem = this.programService.getSystem().subscribe(response => {
      this.system = response;
    });

    this.programService.callApiGetProject();
    this.subscribeProject = this.programService.getProject().subscribe(response => {
      this.project = response;
    });

   this.programService.getProgram().subscribe(response => {
      console.log('subscribe getProgram patchValue', response);
      this.programSaveForm.patchValue({
        ...response
      });
    });

    const { mode } = this.activeRoute.snapshot.data;
    this.mode = mode;
    const { id } = this.activeRoute.snapshot.params;
    if (id && Mode.EDIT === mode) {
    this.programService.queryProgramById(id);
    console.log("your id : "+id)
    }if (Mode.ADD === mode) {
      let defaultStatus= {
        statusId: 1,
        statusName: "Create",
      };
      this.programSaveForm.get('status')?.patchValue(defaultStatus);
    }

  }

  addProgram(){
    const program = this.programSaveForm.value as Program;
    if (this.programSaveForm.valid) {
      if (Mode.EDIT === this.mode) {
        this.programService.editProgram(program).subscribe(response =>{{
          console.log(response);
      }})
      } else {
        this.programService.addProgram(program).subscribe(response =>{
          console.log(response);
        })
      }
    }
  
  
  }

  reset() {
    if (Mode.EDIT === this.mode) {
    this.ngOnInit();
    }else{
      this.programSaveForm.reset();
      let defaultStatus= {
        statusId: 1,
        statusName: "Create",
      };
      this.programSaveForm.get('status')?.patchValue(defaultStatus);
    }
    
  }

  gotoSearch(){
    this.router.navigate([''])
  }

}
