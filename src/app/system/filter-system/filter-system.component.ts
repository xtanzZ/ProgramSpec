import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/model/program';
import { System } from 'src/app/model/system';
import { UISpec } from 'src/app/model/uispec';
import { ProgramService } from 'src/app/service/program.service';
import { SystemService } from 'src/app/service/system.service';

@Component({
  selector: 'app-filter-system',
  templateUrl: './filter-system.component.html',
  styleUrls: ['./filter-system.component.scss']
})
export class FilterSystemComponent implements OnInit {

 
  loading: boolean = true;

  activityValues: number[] = [0, 100];

  system: System[] = [];
  programs: Program[] = [];
  systemsId: any[] = [];
  subscribeSystem!: Subscription

  @ViewChild('dt')
  dt!: Table;

  constructor(private router: Router, private messageService: MessageService, private systemService: SystemService, private programService: ProgramService) { }

  ngOnInit() {
    this.systemService.callApiGetSystems();
    this.subscribeSystem = this.systemService.getSystems().subscribe(res => {
      this.loading = false
      this.system = res
    });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Delete System success.' })
  }
  showError() {
    this.messageService.add({ severity: 'error', summary: 'Message', detail: 'Delete Error : System Is Used.' });
  }

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  gotoEdit(id: number) {
    this.router.navigate(['/system/edit', id])
  }

  gotoSave() {
    this.router.navigate(['/system/save'])
  }

  delete(id: number) {
    console.log(id)
    this.systemsId = [];
    this.programService.getProgramPdf().subscribe({
      next: (response) => {
        this.programs = response;
      },
      complete: () => {
        Object.entries(this.programs).find(([key, value]) => {
          if (value.system.systemId === id) {
            this.systemsId.push(value.system.systemId);
            console.log("systemsId : " + this.systemsId)
          }
        });
        if (this.systemsId.length == 0) {
          this.systemService.deleteSystem(id).subscribe({
            complete: () => {
              this.showSuccess()
            },
          });
        }
        else {
          this.showError()
        }
      },
    })

  }
}
