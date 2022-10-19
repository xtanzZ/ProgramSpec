import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/model/program';
import { SystemAnalyst } from 'src/app/model/systemanalyst';
import { UISpec } from 'src/app/model/uispec';
import { ProgramService } from 'src/app/service/program.service';
import { SystemAnalystService,} from 'src/app/service/systemanalyst.service';

@Component({
  selector: 'app-filter-system-analyst',
  templateUrl: './filter-system-analyst.component.html',
  styleUrls: ['./filter-system-analyst.component.scss']
})
export class FilterSystemAnalystComponent implements OnInit {

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  systemAnalyst: SystemAnalyst[] = [];
  programs: Program[] = [];
  systemsAnalystId: any[] = [];
  subscribeSystem!: Subscription

  @ViewChild('dt')
  dt!: Table;

  constructor(private router: Router, private messageService: MessageService, private systemAnalystService: SystemAnalystService, private programService: ProgramService) { }

  ngOnInit() {
    this.systemAnalystService.callApiGetSystemAnalysts();
    this.subscribeSystem = this.systemAnalystService.getSystemAnalysts().subscribe(res => {
      this.loading = false
      this.systemAnalyst = res
    });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Delete System Analyst success.' })
  }
  showError() {
    this.messageService.add({ severity: 'error', summary: 'Message', detail: 'Delete Error : System Analyst Is Used.' });
  }

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  gotoEdit(id: number) {
    this.router.navigate(['/systemanalyst/edit', id])
  }

  gotoSave() {
    this.router.navigate(['/systemanalyst/save'])
  }

  delete(id: number) {
    console.log(id)
    this.systemsAnalystId = [];
    this.programService.getProgramPdf().subscribe({
      next: (response) => {
        this.programs = response;
      },
      complete: () => {
        Object.entries(this.programs).find(([key, value]) => {
          if (value.systemAnalyst.systemAnalystId === id) {
            this.systemsAnalystId.push(value.systemAnalyst.systemAnalystId);
            console.log("systemsAnalystId : " + this.systemsAnalystId)
          }
        });
        if (this.systemsAnalystId.length == 0) {
          this.systemAnalystService.deleteSystemAnalyst(id).subscribe({
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
