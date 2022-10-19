import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageImage } from 'src/app/model/pageimage';
import { UISpec } from 'src/app/model/uispec';
import { PageImageService } from 'src/app/service/pageimage.service';
import { ProgramService } from 'src/app/service/program.service';
import { UispecService } from 'src/app/service/uispec.service';

@Component({
  selector: 'app-filtter-uispec',
  templateUrl: './filtter-uispec.component.html',
  styleUrls: ['./filtter-uispec.component.scss']
})
export class FiltterUispecComponent implements OnInit {

  uiSpecFiltterForm: FormGroup = new FormGroup({
    pageImage: new FormControl(),
  })

  pageImageName: PageImage[] = [];
  uiSpecs: UISpec[] = [];
  fitterPageImage: PageImage[] = [];

  subscribeProgram!: Subscription
  subscribeUISpecs!: Subscription


  constructor(private pageImageService: PageImageService, private programService: ProgramService, private uispecService: UispecService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageImageService.pageImageId = 0;
    this.uispecService.spec = 3;

    // this.pageImageService.callApiGetPageImages();
    this.subscribeProgram = this.pageImageService.getPageImagesPdf().subscribe(response => {
      this.pageImageName = response;
    });

    this.subscribeUISpecs = this.uispecService.getUISpecs().subscribe(uiSpecs => {
      this.uiSpecs = uiSpecs
    });

    // if (this.programService.programSelect === true) {
    //   this.forGetProgramName();
    //   this.queryPageImages();
    // }
    
  }

  searchPageImage(event: any) {
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.pageImageName.length; i++) {
        let pageImageN = this.pageImageName[i];
        if (pageImageN.pageImageName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(pageImageN.pageImageName);
        }
    }

    const distinctArray = filtered.filter((n, i) => filtered.indexOf(n) === i);
    this.fitterPageImage = distinctArray;
  }

  queryUISpecs() {
    console.log(this.uiSpecFiltterForm.value)
    this.uispecService.queryUISpecs(this.uiSpecFiltterForm.value).add(() => {
    });
  }

  reset() {
    this.uiSpecFiltterForm.reset();
  }

  gotoSave(){
    this.router.navigate(['/uispec/save']);
  }

  gotoEdit(id: number) {
    this.router.navigate(['/uispec/edit', id])
  }

  delete(id: number){
    console.log(id)
    this.uispecService.deleteUISpec(id).subscribe();
  }

  forGetProgramName(){
  //   for(let i = 0; i < this.pageImageName.length; i++) {
  //     let pageImageN = this.pageImageName[i];
  //     if (pageImageN.pageImageId == this.programService.pageImageId) {
  //       this.uiSpecFiltterForm.get('program')?.setValue(programN.programName);
  //     }
  // }
   
  }
}
