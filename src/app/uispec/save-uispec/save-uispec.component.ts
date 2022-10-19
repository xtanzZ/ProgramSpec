import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormType } from 'src/app/model/formtype';
import { PageImage } from 'src/app/model/pageimage';
import { ServiceSpec } from 'src/app/model/serviceSpec';
import { UISpec } from 'src/app/model/uispec';
import { PageImageService } from 'src/app/service/pageimage.service';
import { ProgramService } from 'src/app/service/program.service';
import { ServicespecService } from 'src/app/service/servicespec.service';
import { UispecService } from 'src/app/service/uispec.service';
import { Mode } from 'src/app/type/mode';

@Component({
  selector: 'app-save-uispec',
  templateUrl: './save-uispec.component.html',
  styleUrls: ['./save-uispec.component.scss']
})
export class SaveUispecComponent implements OnInit {

  uispecSaveForm: FormGroup = new FormGroup({
    uispecId: new FormControl(),
    label: new FormControl(null,Validators.required),
    attribure: new FormControl(null,Validators.required),
    formType: new FormControl(null,Validators.required),
    detail: new FormControl("Default",Validators.required),
    event: new FormControl("None",Validators.required),
    pageimage: new FormControl(null,Validators.required),
    service: new FormControl(),
  })

  formType: FormType[] = [];
  serviceSpecs: ServiceSpec[] = [];
  pageImage: PageImage[] = [];
  getImage: string | undefined

  subscribeProgram!: Subscription
  subscribeStatus!: Subscription
  subscribeSystem!: Subscription
  subscribeProject!: Subscription
  subscribeFormType!: Subscription
  s!: Subscription

  mode!: Mode;
  Mode = Mode;

  constructor(private programService: ProgramService, private serviceSpecService: ServicespecService, private pageImageService: PageImageService, private uispecService: UispecService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.uispecService.callApiGetFormType();
    this.subscribeFormType = this.uispecService.getFormType().subscribe(response => {
      this.formType = response;
    });

    this.serviceSpecService.getServiceSpecsPdf().subscribe(response => {
      this.serviceSpecs = response;
    })

    this.subscribeProgram = this.pageImageService.getPageImagesPdf().subscribe(response => {
      this.pageImage = response;
      const { mode } = this.activeRoute.snapshot.data;
      this.mode = mode;
      const { id } = this.activeRoute.snapshot.params;
      if (id && Mode.EDIT === mode) {
        this.uispecService.queryUISpecById(id);
        this.getImage = this.uispecSaveForm.get('pageimage')?.value.picture;
      } if (Mode.ADD === mode) {
        this.forGetPageImageName();
      }
    });

    this.s = this.uispecService.getUISpec().subscribe(response => {
      console.log('subscribe getUISpec patchValue', response);
      if(response.service === undefined){
        this.uispecSaveForm.get('service')?.patchValue("");
      }
      this.uispecSaveForm.patchValue({
        ...response
      });
    });



  }

  getImageName() {
    this.getImage = this.uispecSaveForm.get('pageimage')?.value.picture;
  }


  addUISpec() {
    const uispec = this.uispecSaveForm.value as UISpec;
    if (this.uispecSaveForm.valid) {
      if (Mode.EDIT === this.mode) {
        this.uispecService.editUISpec(uispec).subscribe(response => {
          {
            console.log("edit UISpec: " + response);
          }
        })
      } else {
        this.uispecService.addUISpec(uispec).subscribe(response => {
          console.log("add UISpec: " + response);
        })
      }
    }
 
  }

  forGetPageImageName() {
    for (let i = 0; i < this.pageImage.length; i++) {
      let pageimageN = this.pageImage[i];
      if (pageimageN.pageImageId == this.pageImageService.pageImageId) {
        this.uispecSaveForm.get('pageimage')?.patchValue(pageimageN);
        this.getImage = this.uispecSaveForm.get('pageimage')?.value.picture;
      }
    }
  }

  reset() {
    if (Mode.EDIT === this.mode) {
      this.ngOnInit();
    } else {
      this.getImage = "";
      this.uispecSaveForm.reset();
      this.uispecSaveForm.get('detail')?.patchValue("Default");
      this.uispecSaveForm.get('event')?.patchValue("None");
    }
  }

  gotoSearch() {
    this.router.navigate(['/uispec'])
  }

}
