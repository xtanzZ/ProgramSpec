import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageImage } from 'src/app/model/pageimage';
import { Program } from 'src/app/model/program';
import { UISpec } from 'src/app/model/uispec';
import { PageImageService } from 'src/app/service/pageimage.service';
import { ProgramService } from 'src/app/service/program.service';
import { UispecService } from 'src/app/service/uispec.service';
import { Mode } from 'src/app/type/mode';

@Component({
  selector: 'app-filtter-pageimage',
  templateUrl: './filtter-pageimage.component.html',
  styleUrls: ['./filtter-pageimage.component.scss']
})
export class FiltterPageImageComponent implements OnInit {

  pageImageFiltterForm: FormGroup = new FormGroup({
    program: new FormControl(),
  })

  programName: Program[] = [];
  pageImages: PageImage[] = [];
  fitterProgram: Program[] = [];

  uiSpecs: UISpec[] = [];
  fitterUISpecId: any[] = [];

  subscribeProgram!: Subscription
  subscribePageImages!: Subscription
  subscribeUISpecs!: Subscription

  isLoading: boolean = false;

  constructor(private pageImageService: PageImageService, private programService: ProgramService, private router: Router, private activeRoute: ActivatedRoute, private uispecService: UispecService) { }

  ngOnInit(): void {
    this.programService.programId = 0;
    this.pageImageService.page = 2;
    this.fitterUISpecId = [];

    this.subscribeProgram = this.programService.getProgramName().subscribe(response => {
      this.programName = response;
    });

    this.subscribePageImages = this.pageImageService.getPageImages().subscribe(pageimages => {
      this.pageImages = pageimages
    });

   

    // if (this.programService.programSelect === true) {
    //   this.forGetProgramName();
    //   this.queryPageImages();
    // }
    
  }

  searchP(event: any) {
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.programName.length; i++) {
        let programN = this.programName[i];
        if (programN.programName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(programN.programName);
        }
    }
    const distinctArray = filtered.filter((n, i) => filtered.indexOf(n) === i);
    this.fitterProgram = distinctArray;
  }

  queryPageImages() {
    this.isLoading = true
    console.log(this.pageImageFiltterForm.value)
    this.subscribePageImages = this.pageImageService.queryPageImages(this.pageImageFiltterForm.value).subscribe(() => {
      console.log("queryPageImages : "+JSON.stringify(this.pageImageFiltterForm.value))
      this.isLoading = false
    });

 
  }

  ngOnDestroy(): void {
    // this.subscribeProgram.unsubscribe();
    // this.subscribeStatus.unsubscribe();
    // this.subscribeProjects.unsubscribe();
    // this.pageImageService.hasTemps(false)
    // this.subscribePageImages.unsubscribe();
  }

  reset() {
    this.pageImageFiltterForm.reset();
  }

  gotoSave(){
    this.router.navigate(['/pageimage/save']);
  }

  gotoEdit(id: number) {
    this.router.navigate(['/pageimage/edit', id])
  }

  forGetProgramName(){
    for(let i = 0; i < this.programName.length; i++) {
      let programN = this.programName[i];
      if (programN.programId == this.programService.programId) {
        this.pageImageFiltterForm.get('program')?.setValue(programN.programName);
      }
  }
   
  }
  gotoUISpecSave(id: number){
    this.pageImageService.pageImageId = id;
    this.router.navigate(['/uispec/save']);
  }

  delete(id: number){
    this.uispecService.getUISpecsPdf().subscribe({
      next: (response) => {
        this.uiSpecs = response;
      },
      complete: () => {
        for(let i = 0; i < this.uiSpecs.length; i++) {
          let uispec = this.uiSpecs[i];
          if (id == uispec.pageimage.pageImageId) {
            this.fitterUISpecId.push(uispec.uispecId)
          }
        }
        if(this.fitterUISpecId.length != 0){
          for(let i = 0; i < this.fitterUISpecId.length; i++) {
            let uispec = this.fitterUISpecId[i];
            this.uispecService.deleteUISpec(uispec).subscribe({
              complete: () => {
                if(this.fitterUISpecId.length - 1 === i) {
                  this.fitterUISpecId = [];
                  this.pageImageService.deletePageImage(id).subscribe();
                }
              }, error: (e) => {
                console.log('error editDevice');
                this.isLoading = false;
              }
            });
            
            
          }
        }else{
          this.pageImageService.deletePageImage(id).subscribe();
        }
      }
      
    })

    
   
    
    
   
    
  }

}
