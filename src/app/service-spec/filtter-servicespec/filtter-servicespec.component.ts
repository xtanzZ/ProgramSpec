import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ServiceSpec } from 'src/app/model/serviceSpec';
import { UISpec } from 'src/app/model/uispec';
import { ServicespecService } from 'src/app/service/servicespec.service';
import { UispecService } from 'src/app/service/uispec.service';

@Component({
  selector: 'app-filtter-servicespec',
  templateUrl: './filtter-servicespec.component.html',
  styleUrls: ['./filtter-servicespec.component.scss'],
})
export class FiltterServicespecComponent implements OnInit {

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  serviceSpec: ServiceSpec[] = [];
  uiSpecs: UISpec[] = [];
  uiSpecsId: any[] = [];
  subscribeServiceSpec!: Subscription

  @ViewChild('dt')
  dt!: Table;

  constructor(private serviceSpecService: ServicespecService, private router: Router, private uispecService: UispecService, private messageService: MessageService) { }

  ngOnInit() {
    this.serviceSpecService.callApiGetServiceSpecs();
    this.subscribeServiceSpec = this.serviceSpecService.getServiceSpecs().subscribe(res => {
      this.loading = false
      this.serviceSpec = res
    });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Delete Service-Spec success.' })
  }
  showError() {
    this.messageService.add({ severity: 'error', summary: 'Message', detail: 'Delete Error : Service-Spec Is Used.' });
  }

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  gotoEdit(id: number) {
    this.router.navigate(['/servicespec/edit', id])
  }

  gotoSave() {
    this.router.navigate(['/servicespec/save'])
  }

  delete(id: number) {
    console.log(id)
    this.uiSpecsId = [];
    this.uispecService.getUISpecsPdf().subscribe({
      next: (response) => {
        this.uiSpecs = response;
      },
      complete: () => {
        Object.entries(this.uiSpecs).find(([key, value]) => {
          if (value.service !== undefined && value.service.serviceId === id) {
            this.uiSpecsId.push(value.service.serviceId);
            console.log("uiSpecsId : " + this.uiSpecsId)
          }
        });
        if (this.uiSpecsId.length == 0) {
          this.serviceSpecService.deleteServiceSpec(id).subscribe({
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
