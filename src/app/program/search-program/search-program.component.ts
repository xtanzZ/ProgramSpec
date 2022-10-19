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

  // copyProgram(id: number) {
  //   this.fitterUISpecId = []
  //   this.pageImageService.getPageImagesPdf().subscribe({
  //     next: (response) => {
  //       this.pageImages = response;
  //       console.log("this.pageImages:::: " + (this.pageImages))
  //     },
  //     complete: () => {
  //       this.uispecService.getUISpecsPdf().subscribe({
  //         next: (response) => {
  //           this.uiSpecs = response;
  //           console.log("uispecccccccc:: " + JSON.stringify(this.uiSpecs))
  //         },
  //         complete: () => {
  //           const pageImagesF = this.pageImages.filter((obj) => {
  //             return obj.program.programId === id;
  //           });
  //           console.log("length: " + JSON.stringify(pageImagesF.length))
  //           for (let i = 0; i < pageImagesF.length; i++) {
  //             console.log("doIMG")
  //             let pageimage = pageImagesF[i];
  //             for (let j = 0; j < this.uiSpecs.length; j++) {
  //               console.log("doSpec" + pageimage.pageImageId)
  //               let uispec = this.uiSpecs[j];
  //               console.log("doSpecC" + uispec.pageimage.pageImageId)
  //               if (pageimage.pageImageId === uispec.pageimage.pageImageId) {
  //                 console.log("doSpecFilter")
  //                 this.fitterUISpecId.push(uispec.uispecId)
  //               }
  //             }
  //           }
  //           console.log("lengthfitterUISpecId: " + this.fitterUISpecId.length)

  //           this.programService.getProgramPdfId(id).subscribe(response => {
  //             this.programService.addProgram(response).subscribe({
  //               complete: () => {
  //                 this.programService.getProgramName().subscribe({
  //                   next: (response) => {
  //                     this.programName = response;
  //                   },
  //                   complete: () => {
  //                     this.programService.callApiGetProgram()
  //                     for (let i = 0; i < pageImagesF.length; i++) {
  //                       let pageimage = pageImagesF[i];
  //                       console.log("id" + JSON.stringify(pageimage.pageImageId))
  //                       this.pageImageService.queryPageImageById(pageimage.pageImageId);
  //                     }
  //                     this.subscribeCopyPageImages = this.pageImageService.getPageImage().subscribe(response => {
  //                       this.copyPageImage = response
  //                       console.log("das" + JSON.stringify(this.copyPageImage))

  //                       console.log("len" + (JSON.stringify(this.programName[this.programName.length - 1].programId)))
  //                       this.copyPageImage.program.programId = (this.programName[this.programName.length - 1].programId)
  //                       this.round++
  //                       this.pageImageService.addPageImage(this.copyPageImage).subscribe({
  //                         complete: () => {
  //                           console.log("AAAAA")
  //                           if (this.round == pageImagesF.length) {
  //                             console.log("KKKKK")
  //                             this.reset()
  //                             this.subscribeCopyPageImages.unsubscribe();
  //                             console.log("roundX:" + this.round)
  //                             this.isDone = true
  //                             if (this.fitterUISpecId.length == 0) {
  //                               this.isDone = false
  //                             }
  //                             this.round = 0;
  //                             console.log("isDoneX:" + this.isDone)
  //                             if (this.isDone == true && this.round == 0) {
  //                               // this.pageImageService.getPageImagesPdf().subscribe()
  //                               // this.pageImageService.getPageImagesPdf().subscribe()
  //                               // this.pageImageService.getPageImagesPdf().subscribe()
  //                               // this.pageImageService.getPageImagesPdf().subscribe(response => {
  //                               //   console.log("FFFFFFFFFFFFFF"+response.length) ;
  //                               // });
  //                               console.log("HHHHH")
  //                               this.pageImageService.getPageImagesPdf().subscribe({
  //                                 next: (response) => {
  //                                   this.pageImages = response;
  //                                   console.log("pP1 : " + JSON.stringify(this.pageImages))
  //                                 },
  //                                 complete: () => {
  //                                   console.log("pP2 : " + JSON.stringify(this.pageImages.length))
  //                                   let pageImagesT = this.pageImages.filter((obj) => {
  //                                     console.log("NewProgramID : " + (JSON.stringify(this.programName[this.programName.length - 1].programId)))
  //                                     return obj.program.programId == this.programName[this.programName.length - 1].programId
  //                                   });

  //                                   for (let i = 0; i < this.fitterUISpecId.length; i++) {
  //                                     let uispec = this.fitterUISpecId[i];
  //                                     this.uispecService.queryUISpecById(uispec);
  //                                   }
  //                                   console.log("pageImagesT.length : " + JSON.stringify(pageImagesT.length))

  //                                   this.subscribeCopyUiSpecs = this.uispecService.getUISpec().subscribe({
  //                                     next: (response) => {
  //                                       this.copyUiSpec = response
  //                                       console.log("UI Id: " + JSON.stringify(this.copyUiSpec.uispecId))
  //                                       for (let i = 0; i < pageImagesT.length; i++) {
  //                                         let pageimage = pageImagesT[i];
  //                                         console.log("Firstp ID : " + pageimage.pageImageId)
  //                                         if (pageimage.pageImageName === this.copyUiSpec.pageimage.pageImageName) {
  //                                           console.log("p ID : " + pageimage.pageImageId)
  //                                           this.copyUiSpec.pageimage.pageImageId = pageimage.pageImageId

  //                                           this.roundUISpec++

  //                                           this.uispecService.addUISpec(this.copyUiSpec).subscribe()

  //                                         }

  //                                       }
  //                                     },
  //                                     complete: () => {

  //                                       console.log("setvotttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt" + this.roundUISpec)

  //                                     },
  //                                     // {
  //                                     //   complete: () => {
  //                                     //     if (this.roundUISpec == this.fitterUISpecId.length) {
  //                                     //       console.log("isDone:" + this.isDone)
  //                                     //       this.subscribeCopyUiSpecs.unsubscribe();
  //                                     //       this.fitterUISpecId = []
  //                                     //       this.isDone = false;
  //                                     //       this.roundUISpec = 1;
  //                                     //     }

  //                                     //   }
  //                                     // }

  //                                   })

  //                                 },
  //                               })

  //                             }
  //                           }

  //                         },
  //                       });
  //                     })
  //                   }

  //                 });
  //               },

  //             });
  //           })
  //         }
  //       })
  //     }
  //   })

  // }

  // copyProgram(id: number) {
  //   this.fitterUISpecId = [];
  //   this.pageImageService.getPageImagesPdf().subscribe((response) => {
  //     this.pageImages = response;
  //     console.log('this.pageImages:::: ' + this.pageImages);
  //     this.uispecService.getUISpecsPdf().subscribe((response) => {
  //       this.uiSpecs = response;
  //       console.log('uispecccccccc:: ' + JSON.stringify(this.uiSpecs));
  //       const pageImagesF = this.pageImages.filter(
  //         (obj) => obj.program.programId === id
  //       );
  //       console.log('length: ' + JSON.stringify(pageImagesF.length));

  //       for (let i = 0; i < pageImagesF.length; i++) {
  //         console.log('doIMG');
  //         let pageimage = pageImagesF[i];
  //         for (let j = 0; j < this.uiSpecs.length; j++) {
  //           console.log('doSpec' + pageimage.pageImageId);
  //           let uispec = this.uiSpecs[j];
  //           console.log('doSpecC' + uispec.pageimage.pageImageId);
  //           if (pageimage.pageImageId === uispec.pageimage.pageImageId) {
  //             console.log('doSpecFilter');
  //             this.fitterUISpecId.push(uispec.uispecId);
  //           }
  //         }
  //       }
  //       console.log('lengthfitterUISpecId: ' + this.fitterUISpecId.length);
  //       this.programService.getProgramPdfId(id).subscribe((response) => {
  //         this.programService.addProgram(response).subscribe(() => {
  //           this.programService.getProgramName().subscribe((response) => {
  //             this.programName = response;
  //             this.programService.callApiGetProgram();
  //             for (let i = 0; i < pageImagesF.length; i++) {
  //               let pageimage = pageImagesF[i];
  //               console.log('id' + JSON.stringify(pageimage.pageImageId));
  //               this.pageImageService.queryPageImageById(pageimage.pageImageId);
  //             }
  //             this.subscribeCopyPageImages = this.pageImageService
  //               .getPageImage()
  //               .subscribe((response) => {
  //                 this.copyPageImage = response;
  //                 console.log('das' + JSON.stringify(this.copyPageImage));

  //                 console.log(
  //                   'len' +
  //                   JSON.stringify(
  //                     this.programName[this.programName.length - 1].programId
  //                   )
  //                 );
  //                 this.copyPageImage.program.programId =
  //                   this.programName[this.programName.length - 1].programId;
  //                 this.round++;
  //                 this.pageImageService
  //                   .addPageImage(this.copyPageImage)
  //                   .subscribe(() => {
  //                     console.log('AAAAA');
  //                     if (this.round == pageImagesF.length) {
  //                       console.log('KKKKK');
  //                       this.reset();
  //                       this.subscribeCopyPageImages.unsubscribe();
  //                       console.log('roundX:' + this.round);
  //                       this.isDone = true;
  //                       if (this.fitterUISpecId.length == 0) {
  //                         this.isDone = false;
  //                       }
  //                       this.round = 0;
  //                       console.log('isDoneX:' + this.isDone);
  //                       this.pageImageService
  //                         .getPageImagesPdf()
  //                         .subscribe((response) => {
  //                           this.pageImages = response;
  //                           console.log(
  //                             'pP1 : ' + JSON.stringify(this.pageImages)
  //                           );
  //                           console.log(
  //                             'pP11 : ' + JSON.stringify(response.length)
  //                           );
  //                           console.log('pP12 : ' + response.length);
  //                           console.log(
  //                             'pP2 : ' + JSON.stringify(this.pageImages.length)
  //                           );
  //                           let pageImagesT = this.pageImages.filter(
  //                             (obj) =>
  //                               obj.program.programId ==
  //                               this.programName[this.programName.length - 1]
  //                                 .programId
  //                           );
  //                           for (
  //                             let i = 0;
  //                             i < this.fitterUISpecId.length;
  //                             i++
  //                           ) {
  //                             let uispec = this.fitterUISpecId[i];
  //                             this.uispecService.queryUISpecById(uispec);
  //                           }
  //                           console.log(
  //                             'pageImagesT.length : ' +
  //                             JSON.stringify(pageImagesT.length)
  //                           );
  //                           this.subscribeCopyUiSpecs = this.uispecService
  //                             .getUISpec()
  //                             .subscribe((response) => {
  //                               this.copyUiSpec = response;
  //                               console.log(
  //                                 'UI Id: ' +
  //                                 JSON.stringify(this.copyUiSpec.uispecId)
  //                               );
  //                               for (let i = 0; i < pageImagesT.length; i++) {
  //                                 let pageimage = pageImagesT[i];
  //                                 console.log(
  //                                   'Firstp ID : ' + pageimage.pageImageId
  //                                 );
  //                                 if (
  //                                   pageimage.pageImageName ===
  //                                   this.copyUiSpec.pageimage.pageImageName
  //                                 ) {
  //                                   console.log(
  //                                     'p ID : ' + pageimage.pageImageId
  //                                   );
  //                                   this.copyUiSpec.pageimage.pageImageId =
  //                                     pageimage.pageImageId;

  //                                   this.roundUISpec++;

  //                                   this.uispecService
  //                                     .addUISpec(this.copyUiSpec)
  //                                     .subscribe();
  //                                 }
  //                               }
  //                               console.log(
  //                                 'setvotttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt' +
  //                                 this.roundUISpec
  //                               );
  //                             });
  //                         });
  //                     }
  //                   });
  //               });
  //           });
  //         });
  //       });
  //     });
  //   });
  // }

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
