import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiceSpec } from 'src/app/model/serviceSpec';
import { ServicespecService } from 'src/app/service/servicespec.service';
import { Mode } from 'src/app/type/mode';

@Component({
  selector: 'app-save-servicespec',
  templateUrl: './save-servicespec.component.html',
  styleUrls: ['./save-servicespec.component.scss']
})
export class SaveServicespecComponent implements OnInit {

  serviceSpecAddForm: FormGroup = new FormGroup({
    serviceId: new FormControl(),
    methodName: new FormControl(null,Validators.required),
    inputParameter: new FormControl(),
    exampleResponse: new FormControl(),
    examplePicture: new FormControl(),
    detail: new FormControl(null,Validators.required),
  })

  subscribeServiceSpecs!: Subscription
  subscribeServiceSpec!: Subscription

  showPicture: string | undefined;
  result: string = '';
  serviceSpecs: ServiceSpec[] = [];
  file: any;

  mode!: Mode;
  Mode = Mode;

  constructor(private serviceSpecService: ServicespecService, private router: Router, private activeRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.subscribeServiceSpec = this.serviceSpecService.getServiceSpec().subscribe(response => {
      console.log('subscribe getServiceSpec patchValue', JSON.stringify(response));
      this.serviceSpecAddForm.patchValue({
        ...response

      });
      if(response.examplePicture != undefined){
        this.result = 'File Name: ' + this.serviceSpecAddForm.get('examplePicture')?.value;
        this.showPicture = this.serviceSpecAddForm.get('examplePicture')?.value;
      }
      if(response.examplePicture == undefined){
        this.result  = '';
        this.file  = '';
        this.myInputVariable.nativeElement.value = '';
      }
      
    });

    const { mode } = this.activeRoute.snapshot.data;
    this.mode = mode;
    const { id } = this.activeRoute.snapshot.params;
    if (id && Mode.EDIT === mode) {
      this.serviceSpecService.queryServiceSpecById(id);
      console.log("your id : " + id)
    } if (Mode.ADD === mode) {
    }
  }

  getFile(event: any) {
    this.file = event.target.files[0];
    this.result = 'File Name: ' + this.file.name;
    console.log(this.file)
  }

  gotoFiltter() {
    this.router.navigate(['/servicespec'])
  }

  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  reset() {
    if (Mode.EDIT === this.mode) {
      this.ngOnInit();
    } else {
      this.serviceSpecAddForm.reset();
      this.result  = '';
      this.file  = '';
      this.myInputVariable.nativeElement.value = '';
    }
  }

  addServiceSpec() {
    const file = this.file;
    const formData = new FormData();
    if (this.serviceSpecAddForm.valid) {
      if (Mode.EDIT === this.mode) {
        if (file != null) {
          formData.append("fileName", file.name);
          formData.append("files", file);
          this.http.post('api/pageimages/upload', formData).subscribe((res: any) => {
            this.serviceSpecAddForm.get('examplePicture')?.setValue(file.name);
            this.serviceSpecService.editServiceSpec(this.serviceSpecAddForm.value).subscribe(response => {
              console.log(response);
            })
          });
        }
        else {
          this.serviceSpecService.editServiceSpec(this.serviceSpecAddForm.value).subscribe(response => {
            console.log(response);
          })
        }
  
      }
      else if (Mode.ADD === this.mode && file != null) {
        formData.append("fileName", file.name);
        formData.append("files", file);
        this.http.post('api/pageimages/upload', formData).subscribe((res: any) => {
          this.serviceSpecAddForm.get('examplePicture')?.setValue(file.name);
          this.serviceSpecService.addServiceSpec(this.serviceSpecAddForm.value).subscribe(response => {
            console.log(response);
          })
        });
  
  
      }
      else {
        this.serviceSpecService.addServiceSpec(this.serviceSpecAddForm.value).subscribe(response => {
          console.log(response);
        })
      }
  
  
  
  
  
    }
    }
    


}
