import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ProgramService } from 'src/app/service/program.service';
import { PageImageService } from 'src/app/service/pageimage.service';
import { Program } from 'src/app/model/program';
import { PageImage } from 'src/app/model/pageimage';
import { Mode } from 'src/app/type/mode';

@Component({
  selector: 'app-save-pageimage',
  templateUrl: './save-pageimage.component.html',
  styleUrls: ['./save-pageimage.component.scss']
})
export class SavePageImageComponent implements OnInit {

  pageImageAddForm: FormGroup = new FormGroup({
    pageImageId: new FormControl(),
    pageImageName: new FormControl(null,Validators.required),
    picture: new FormControl(),
    program: new FormControl(null,Validators.required),
  })

  subscribeProjects!: Subscription

  showPicture: string | undefined;
  result: string = '';
  programs: Program[] = [];
  file: any;

  mode!: Mode;
  Mode = Mode;

  subscribeProgram!: Subscription
  subscribePageImage!: Subscription

  constructor(private http: HttpClient, private router: Router, private programService: ProgramService, private pageImageService: PageImageService, private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    // this.componentForm.controls['project'].setValue(this.projectService.projectId);
    // this.subscribeProjects = this.projectService.getProjects().subscribe(projects => {
    //   this.projects = projects
    // })

    this.programService.callApiGetProgram();
    this.subscribeProgram = this.programService.getPrograms().subscribe(response => {
      this.programs = response;
    });

    this.subscribePageImage = this.pageImageService.getPageImage().subscribe(response => {
      console.log('subscribe getPageImage patchValue', JSON.stringify(response));
      this.pageImageAddForm.patchValue({
        ...response
      });
    });
    this.forGetProgramName();

    const { mode } = this.activeRoute.snapshot.data;
    this.mode = mode;
    const { id } = this.activeRoute.snapshot.params;
    if (id && Mode.EDIT === mode) {
      this.pageImageService.queryPageImageById(id);
      this.result = 'File Name: ' + this.pageImageAddForm.get('picture')?.value;
      this.showPicture = this.pageImageAddForm.get('picture')?.value;
      console.log("your id : " + id)
    }
  }

  getFile(event: any) {
    this.file = event.target.files[0];
    this.result = 'File Name: ' + this.file.name;
    console.log(this.file)
  }

  upload() {

  }

  forGetProgramName() {
    for (let i = 0; i < this.programs.length; i++) {
      let programN = this.programs[i];
      if (programN.programId == this.programService.programId) {
        this.pageImageAddForm.get('program')?.patchValue(programN);
      }
    }

  }

  addPageImage() {
    const file = this.file;
    const formData = new FormData();
    if (this.pageImageAddForm.valid) {
      if (Mode.EDIT === this.mode) {
        if (file != null) {
          formData.append("fileName", file.name);
          formData.append("files", file);
          this.http.post('api/pageimages/upload', formData).subscribe((res: any) => {
            this.pageImageAddForm.get('picture')?.setValue(file.name);
            this.pageImageService.editPageImage(this.pageImageAddForm.value).subscribe(response => {
              console.log(response);
            })
          });
        }
        else {
          this.pageImageService.editPageImage(this.pageImageAddForm.value).subscribe(response => {
            console.log(response);
          })
        }
    }
   

    
    else if (Mode.ADD === this.mode && file != null) {
      formData.append("fileName", file.name);
      formData.append("files", file);
      this.http.post('api/pageimages/upload', formData).subscribe((res: any) => {
        this.pageImageAddForm.get('picture')?.setValue(file.name);
        this.pageImageService.addPageImage(this.pageImageAddForm.value).subscribe(response => {
          console.log(response);
        })
      });


    }
  }
    // else{
    //   this.pageImageService.addPageImage(this.pageImageAddForm.value).subscribe(response => {
    //     console.log(response);
    //   })
    // }





  }
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  reset() {
    if (Mode.EDIT === this.mode) {
      this.ngOnInit();
    } else {
      this.pageImageAddForm.reset();
      this.result  = '';
      this.file  = '';
      this.myInputVariable.nativeElement.value = '';
    }
  }

  gotoSearch() {
    this.router.navigate(['/pageimage'])
  }

}
