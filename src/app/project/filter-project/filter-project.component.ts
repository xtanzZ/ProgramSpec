import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/model/program';
import { Project } from 'src/app/model/project';
import { UISpec } from 'src/app/model/uispec';
import { ProgramService } from 'src/app/service/program.service';
import { ProjectService } from 'src/app/service/project.service';

@Component({
  selector: 'app-filter-project',
  templateUrl: './filter-project.component.html',
  styleUrls: ['./filter-project.component.scss']
})
export class FilterProjectComponent implements OnInit {

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  project: Project[] = [];
  programs: Program[] = [];
  projectsId: any[] = [];
  subscribeProject!: Subscription

  @ViewChild('dt')
  dt!: Table;

  constructor(private router: Router, private messageService: MessageService, private projectService: ProjectService, private programService: ProgramService) { }

  ngOnInit() {
    this.projectService.callApiGetProjects();
    this.subscribeProject = this.projectService.getProjects().subscribe(res => {
      this.loading = false
      this.project = res
    });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Message', detail: 'Delete Project success.' })
  }
  showError() {
    this.messageService.add({ severity: 'error', summary: 'Message', detail: 'Delete Error : Project Is Used.' });
  }

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  gotoEdit(id: number) {
    this.router.navigate(['/project/edit', id])
  }

  gotoSave() {
    this.router.navigate(['/project/save'])
  }

  delete(id: number) {
    console.log(id)
    this.projectsId = [];
    this.programService.getProgramPdf().subscribe({
      next: (response) => {
        this.programs = response;
      },
      complete: () => {
        Object.entries(this.programs).find(([key, value]) => {
          if (value.project.projectId === id) {
            this.projectsId.push(value.project.projectId);
            console.log("projectsId : " + this.projectsId)
          }
        });
        if (this.projectsId.length == 0) {
          this.projectService.deleteProject(id).subscribe({
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
