import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/model/program';
import { Status } from 'src/app/model/status';
import { SystemAnalyst } from 'src/app/model/systemanalyst';
import { ProgramService } from 'src/app/service/program.service';
import { UispecService } from 'src/app/service/uispec.service';
import { PageImageService } from 'src/app/service/pageimage.service';
import { UISpec } from 'src/app/model/uispec';
import { PageImage } from 'src/app/model/pageimage';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-search-program',
  templateUrl: './search-program.component.html',
  styleUrls: ['./search-program.component.scss'],
})
export class SearchProgramComponent implements OnInit {
  projectSearchForm: FormGroup = new FormGroup({
    employeeName: new FormControl(),
    program: new FormControl(),
    status: new FormControl(),
  });

  subscribeCopyPageImages!: Subscription;
  subscribeCopyUiSpecs!: Subscription;

  status: Status[] = [];
  projects: Program[] = [];
  programName: Program[] = [];
  programName2: Program[] = [];
  systemAnalyst: SystemAnalyst[] = [];
  fitterSystemAnalyst: SystemAnalyst[] = [];
  fitterProgram: Program[] = [];

  uiSpecs: UISpec[] = [];
  fitterUISpecId: any[] = [];
  pageImages: PageImage[] = [];
  fitterPageImageId: any[] = [];

  copyPageImage = {} as PageImage;
  copyUiSpec = {} as UISpec;
  copyPrograms: Program[] = [];

  isLoading: boolean = false;
  round: number = 0;
  isDone: boolean = false;
  roundUISpec: number = 0;

  specPDFId: any[] = [];
  checkUISpec: UISpec[] = [];

  constructor(
    private programService: ProgramService,
    private router: Router,
    private uispecService: UispecService,
    private pageImageService: PageImageService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.programService.programId = 0;
    this.programService.programSelect = false;
    this.pageImageService.page = 1;
    this.uispecService.spec = 2;

    this.programService.callApiGetSystemAnalyst();
    this.programService.getSystemAnalyst().subscribe((response) => {
      this.systemAnalyst = response;
    });

    this.programService.callApiGetStatus();
    this.programService.getStatus().subscribe((response) => {
      this.status = response;
    });

    this.programService.getPrograms().subscribe((programs) => {
      this.projects = programs;
    });
  }

  searchSD(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.systemAnalyst.length; i++) {
      let systemAnalyst = this.systemAnalyst[i];
      if (
        systemAnalyst.systemAnalystName
          .toLowerCase()
          .indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(systemAnalyst.systemAnalystName);
      }
    }

    this.fitterSystemAnalyst = filtered;
  }

  searchP(event: any) {
    this.programService.getProgramName().subscribe({
      next: (response) => {
        this.programName2 = response;
      },
      complete: () => {
        let filtered: any[] = [];
        let query = event.query;
        for (let i = 0; i < this.programName2.length; i++) {
          let programN = this.programName2[i];
          if (
            programN.programName.toLowerCase().indexOf(query.toLowerCase()) == 0
          ) {
            filtered.push(programN.programName);
          }
        }
        const distinctArray = filtered.filter(
          (n, i) => filtered.indexOf(n) === i
        );
        this.fitterProgram = distinctArray;
      },
    });
  }

  ngOnDestroy(): void { }

  queryProjects() {
    console.log(this.projectSearchForm.value);
    this.programService
      .queryProjects(this.projectSearchForm.value)
      .subscribe(() => { });
  }

  reset() {
    this.projectSearchForm.reset();
  }

  gotoPageImage(id: number) {
    this.programService.programId = id;
    this.programService.programSelect = true;
    this.router.navigate(['/pageimage']);
  }

  gotoPDF(id: number) {
    console.log(id);
    this.specPDFId = [];
    this.uispecService.getUISpecsPdf().subscribe({
      next: (response) => {
        this.checkUISpec = response;
      },
      complete: () => {
        Object.entries(this.checkUISpec).find(([key, value]) => {
          if (value.pageimage.program.programId === id) {
            this.specPDFId.push(value.pageimage.program.programId);
            console.log('specPDFId : ' + this.specPDFId);
          }
        });
        if (this.specPDFId.length == 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Message',
            detail: 'PDF Error : Program Is Not Set Spec.',
          });
        } else {
          this.programService.programId = id;
          this.router.navigate(['/pdf']);
        }
      },
    });
  }

  gotoSave() {
    this.router.navigate(['/program/save']);
  }

  gotoEdit(id: number) {
    this.router.navigate(['/program/edit', id]);
  }

  gotoPageImageSave(id: number) {
    this.programService.programId = id;
    this.router.navigate(['/pageimage/save']);
  }

  butt() {
    this.pageImageService.getPageImagesPdf().subscribe((response) => {
      console.log(response.length);
    });
  }

  copyProgram(id: number) {
    this.pageImageService.copy(id).subscribe();
  }

  delete(id: number) {
    this.pageImageService.getPageImagesPdf().subscribe({
      next: (response) => {
        this.pageImages = response;
      },
      complete: () => {
        this.uispecService.getUISpecsPdf().subscribe({
          next: (response) => {
            this.uiSpecs = response;
          },
          complete: () => {
            const pageImagesF = this.pageImages.filter((obj) => {
              return obj.program.programId === id;
            });
            for (let i = 0; i < pageImagesF.length; i++) {
              let pageimage = pageImagesF[i];
              for (let i = 0; i < this.uiSpecs.length; i++) {
                let uispec = this.uiSpecs[i];
                if (pageimage.pageImageId === uispec.pageimage.pageImageId) {
                  this.fitterUISpecId.push(uispec.uispecId);
                }
              }
            }

            if (this.fitterUISpecId.length == 0 && pageImagesF.length == 0) {
              this.programService.deleteProgram(id).subscribe();
            } else if (
              pageImagesF.length != 0 &&
              this.fitterUISpecId.length == 0
            ) {
              for (let i = 0; i < pageImagesF.length; i++) {
                let pageimage = pageImagesF[i];
                this.pageImageService
                  .deletePageImage(pageimage.pageImageId)
                  .subscribe({
                    complete: () => {
                      if (pageImagesF.length - 1 === i) {
                        this.programService.deleteProgram(id).subscribe();
                      }
                    },
                  });
              }
            } else {
              for (let i = 0; i < this.fitterUISpecId.length; i++) {
                let uispec = this.fitterUISpecId[i];
                this.uispecService.deleteUISpec(uispec).subscribe({
                  complete: () => {
                    if (this.fitterUISpecId.length - 1 === i) {
                      this.fitterUISpecId = [];
                      for (let i = 0; i < pageImagesF.length; i++) {
                        let pageimage = pageImagesF[i];
                        this.pageImageService
                          .deletePageImage(pageimage.pageImageId)
                          .subscribe({
                            complete: () => {
                              if (pageImagesF.length - 1 === i) {
                                this.programService
                                  .deleteProgram(id)
                                  .subscribe();
                              }
                            },
                          });
                      }
                    }
                  },
                });
              }
            }
          },
        });
      },
    });
  }
}
