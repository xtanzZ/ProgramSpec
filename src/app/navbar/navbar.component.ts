import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] = [];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Program', icon: 'pi pi-fw pi-home', command: event => {
          this.activateMenuProgram(event);
        }
      },
      {
        label: 'PageImage', icon: 'pi pi-fw pi-images', command: event => {
          this.activateMenuPageImage(event);
        }
      },
      {
        label: 'UI-Spec', icon: 'pi pi-fw pi-star', command: event => {
          this.activateMenuUISpec(event);
        }
      },
      {
        label: 'Service-Spec', icon: 'pi pi-fw pi-server', command: event => {
          this.activateMenuServiceSpec(event);
        }
      },

    ]

    this.items = [
      {
        label: 'PROGRAM SPEC',
        icon: 'pi pi-fw pi-home',
        items: [{
          label: 'Program',
          items: [
            {
              label: 'Search', icon: 'pi pi-fw pi-search', command: event => {
                this.activateMenuProgram(event);
              }
            },
            {
              label: 'New', icon: 'pi pi-fw pi-plus', command: event => {
                this.activateMenuNewProgram(event);
              }
            },
          ]
        },
        {
          label: 'PageImage',
          items: [
            {
              label: 'Search', icon: 'pi pi-fw pi-search', command: event => {
                this.activateMenuPageImage(event);
              }
            },
            {
              label: 'New', icon: 'pi pi-fw pi-plus', command: event => {
                this.activateMenuNewPageImage(event);
              }
            },
          ]
        },
        {
          label: 'UISpec',
          items: [
            {
              label: 'Search', icon: 'pi pi-fw pi-search', command: event => {
                this.activateMenuUISpec(event);
              }
            },
            {
              label: 'New', icon: 'pi pi-fw pi-plus', command: event => {
                this.activateMenuNewUISpec(event);
              }
            },
          ]
        }
        ]
      },
      {
        label: 'LOOKUP TABLE',
        icon: 'pi pi-fw pi-exclamation-circle',
        items: [
          {
            label: 'ServiceSpec',
            items: [
              {
                label: 'Filter', icon: 'pi pi-fw pi-filter', command: event => {
                  this.activateMenuServiceSpec(event);
                }
              },
              {
                label: 'New', icon: 'pi pi-fw pi-plus', command: event => {
                  this.activateMenuNewServiceSpec(event);
                }
              },
            ]
          },
          {
            label: 'Project',
            items: [
              {
                label: 'Filter', icon: 'pi pi-fw pi-filter', command: event => {
                  this.activateMenuProject(event);
                }
              },
              {
                label: 'New', icon: 'pi pi-fw pi-plus', command: event => {
                  this.activateMenuNewProject(event);
                }
              },
            ]
          },
          {
            label: 'System',
            items: [
              {
                label: 'Filter', icon: 'pi pi-fw pi-filter', command: event => {
                  this.activateMenuSystem(event);
                }
              },
              {
                label: 'New', icon: 'pi pi-fw pi-plus', command: event => {
                  this.activateMenuNewSystem(event);
                }
              },
            ]
          },
          {
            label: 'SystemAnalyst',
            items: [
              {
                label: 'Filter', icon: 'pi pi-fw pi-filter', command: event => {
                  this.activateMenuSystemAnalyst(event);
                }
              },
              {
                label: 'New', icon: 'pi pi-fw pi-plus', command: event => {
                  this.activateMenuNewSystemAnalyst(event);
                }
              },
            ]
          },
        ]
      }
    ];
  }

  activateMenuPageImage(event: any) {
    this.router.navigate(['/pageimage'])
  }

  activateMenuNewPageImage(event: any) {
    this.router.navigate(['/pageimage/save'])
  }

  activateMenuProgram(event: any) {
    this.router.navigate(['/program'])
  }

  activateMenuNewProgram(event: any) {
    this.router.navigate(['/program/save'])
  }

  activateMenuUISpec(event: any) {
    this.router.navigate(['/uispec'])
  }

  activateMenuNewUISpec(event: any) {
    this.router.navigate(['/uispec/save'])
  }

  activateMenuServiceSpec(event: any) {
    this.router.navigate(['/servicespec'])
  }

  activateMenuNewServiceSpec(event: any) {
    this.router.navigate(['/servicespec/save'])
  }

  activateMenuProject(event: any) {
    this.router.navigate(['/project'])
  }

  activateMenuNewProject(event: any) {
    this.router.navigate(['/project/save'])
  }

  activateMenuSystem(event: any) {
    this.router.navigate(['/system'])
  }

  activateMenuNewSystem(event: any) {
    this.router.navigate(['/system/save'])
  }

  activateMenuSystemAnalyst(event: any) {
    this.router.navigate(['/systemanalyst'])
  }

  activateMenuNewSystemAnalyst(event: any) {
    this.router.navigate(['/systemanalyst/save'])
  }


}
