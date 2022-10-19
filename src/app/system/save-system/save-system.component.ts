import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { System } from 'src/app/model/system';
import { SystemService } from 'src/app/service/system.service';
import { Mode } from 'src/app/type/mode';

@Component({
  selector: 'app-save-system',
  templateUrl: './save-system.component.html',
  styleUrls: ['./save-system.component.scss']
})
export class SaveSystemComponent implements OnInit {

  systemAddForm: FormGroup = new FormGroup({
    systemId: new FormControl(),
    systemName: new FormControl(null,Validators.required),
  })

  subscribeSystems!: Subscription
  subscribeSystem!: Subscription

  systems: System[] = [];

  mode!: Mode;
  Mode = Mode;

  constructor(private systemService: SystemService, private router: Router, private activeRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.subscribeSystem = this.systemService.getSystem().subscribe(response => {
      console.log('subscribe getSystem patchValue', JSON.stringify(response));
      this.systemAddForm.patchValue({
        ...response

      });
      
    });

    const { mode } = this.activeRoute.snapshot.data;
    this.mode = mode;
    const { id } = this.activeRoute.snapshot.params;
    if (id && Mode.EDIT === mode) {
      this.systemService.querySystemById(id);
      console.log("your id : " + id)
    } if (Mode.ADD === mode) {
    }
  }

  gotoFiltter() {
    this.router.navigate(['/system'])
  }


  reset() {
    if (Mode.EDIT === this.mode) {
      this.ngOnInit();
    } else {
      this.systemAddForm.reset();
    }
  }

  addSystem() {
    const system = this.systemAddForm.value as System;
    if (this.systemAddForm.valid) {
      if (Mode.EDIT === this.mode) {
        this.systemService.editSystem(system).subscribe(response =>{{
          console.log(response);
      }})
      } else {
        this.systemService.addSystem(system).subscribe(response =>{
          console.log(response);
        })
      }
    }
  }

}
