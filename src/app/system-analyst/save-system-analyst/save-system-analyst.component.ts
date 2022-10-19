import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SystemAnalyst } from 'src/app/model/systemanalyst';
import { SystemAnalystService } from 'src/app/service/systemanalyst.service';
import { Mode } from 'src/app/type/mode';

@Component({
  selector: 'app-save-system-analyst',
  templateUrl: './save-system-analyst.component.html',
  styleUrls: ['./save-system-analyst.component.scss']
})
export class SaveSystemAnalystComponent implements OnInit {

  systemAnalystAddForm: FormGroup = new FormGroup({
    systemAnalystId: new FormControl(),
    systemAnalystName: new FormControl(null,Validators.required),
  })

  subscribeSystemAnalysts!: Subscription
  subscribeSystemAnalyst!: Subscription

  systemAnalysts: SystemAnalyst[] = [];

  mode!: Mode;
  Mode = Mode;

  constructor(private systemAnalystService: SystemAnalystService, private router: Router, private activeRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.subscribeSystemAnalyst = this.systemAnalystService.getSystemAnalyst().subscribe(response => {
      console.log('subscribe getSystem Analyst patchValue', JSON.stringify(response));
      this.systemAnalystAddForm.patchValue({
        ...response

      });
      
    });

    const { mode } = this.activeRoute.snapshot.data;
    this.mode = mode;
    const { id } = this.activeRoute.snapshot.params;
    if (id && Mode.EDIT === mode) {
      this.systemAnalystService.querySystemAnalystById(id);
      console.log("your id : " + id)
    } if (Mode.ADD === mode) {
    }
  }

  gotoFiltter() {
    this.router.navigate(['/systemanalyst'])
  }


  reset() {
    if (Mode.EDIT === this.mode) {
      this.ngOnInit();
    } else {
      this.systemAnalystAddForm.reset();
    }
  }

  addSystemAnalyst() {
    const systemAnalyst = this.systemAnalystAddForm.value as SystemAnalyst;
    if (this.systemAnalystAddForm.valid) {
      if (Mode.EDIT === this.mode) {
        this.systemAnalystService.editSystemAnalyst(systemAnalyst).subscribe(response =>{{
          console.log(response);
      }})
      } else {
        this.systemAnalystService.addSystemAnalyst(systemAnalyst).subscribe(response =>{
          console.log(response);
        })
      }
    }
  }

}
