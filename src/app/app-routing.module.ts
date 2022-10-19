import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiltterPageImageComponent } from './pageimage/filtter-pageimage/filtter-pageimage.component';
import { PageImageComponent } from './pageimage/pageimage.component';
import { SavePageImageComponent } from './pageimage/save-pageimage/save-pageimage.component';
import { ProgramComponent } from './program/program.component';
import { SaveProgramComponent } from './program/save-program/save-program.component';
import { SearchProgramComponent } from './program/search-program/search-program.component';
import { FilterProjectComponent } from './project/filter-project/filter-project.component';
import { ProjectComponent } from './project/project.component';
import { SaveProjectComponent } from './project/save-project/save-project.component';
import { SavePdfComponent } from './save-pdf/save-pdf.component';
import { FiltterServicespecComponent } from './service-spec/filtter-servicespec/filtter-servicespec.component';
import { SaveServicespecComponent } from './service-spec/save-servicespec/save-servicespec.component';
import { ServiceSpecComponent } from './service-spec/service-spec.component';
import { FilterSystemAnalystComponent } from './system-analyst/filter-system-analyst/filter-system-analyst.component';
import { SaveSystemAnalystComponent } from './system-analyst/save-system-analyst/save-system-analyst.component';
import { SystemAnalystComponent } from './system-analyst/system-analyst.component';
import { FilterSystemComponent } from './system/filter-system/filter-system.component';
import { SaveSystemComponent } from './system/save-system/save-system.component';
import { SystemComponent } from './system/system.component';
import { Mode } from './type/mode';
import { FiltterUispecComponent } from './uispec/filtter-uispec/filtter-uispec.component';
import { SaveUispecComponent } from './uispec/save-uispec/save-uispec.component';
import { UispecComponent } from './uispec/uispec.component';

const routes: Routes = [
  { path: '', redirectTo: 'program', pathMatch: 'full' },
  {
    path: 'program',
    component: ProgramComponent,
    children: [
      {
        path: '',
        component: SearchProgramComponent,
      },
      {
        path: 'save',
        component: SaveProgramComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'edit/:id',
        component: SaveProgramComponent,
        data: { mode: Mode.EDIT }
      }
    ]
  },
  {
    path: 'pageimage',
    component: PageImageComponent,
    children: [
      {
        path: '',
        component: FiltterPageImageComponent,
      },
      {
        path: 'save',
        component: SavePageImageComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'edit/:id',
        component: SavePageImageComponent,
        data: { mode: Mode.EDIT }
      }
    ]
  },
  {
    path: 'uispec',
    component: UispecComponent,
    children: [
      {
        path: '',
        component: FiltterUispecComponent,
      },
      {
        path: 'save',
        component: SaveUispecComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'edit/:id',
        component: SaveUispecComponent,
        data: { mode: Mode.EDIT }
      }
    ]
  },
  {
    path: 'servicespec',
    component: ServiceSpecComponent,
    children: [
      {
        path: '',
        component: FiltterServicespecComponent,
      },
      {
        path: 'save',
        component: SaveServicespecComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'edit/:id',
        component: SaveServicespecComponent,
        data: { mode: Mode.EDIT }
      }
    ]
  },
  {
    path: 'project',
    component: ProjectComponent,
    children: [
      {
        path: '',
        component: FilterProjectComponent,
      },
      {
        path: 'save',
        component: SaveProjectComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'edit/:id',
        component: SaveProjectComponent,
        data: { mode: Mode.EDIT }
      }
    ]
  },
  {
    path: 'system',
    component: SystemComponent,
    children: [
      {
        path: '',
        component: FilterSystemComponent,
      },
      {
        path: 'save',
        component: SaveSystemComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'edit/:id',
        component: SaveSystemComponent,
        data: { mode: Mode.EDIT }
      }
    ]
  },
  {
    path: 'systemanalyst',
    component: SystemAnalystComponent,
    children: [
      {
        path: '',
        component: FilterSystemAnalystComponent,
      },
      {
        path: 'save',
        component: SaveSystemAnalystComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'edit/:id',
        component: SaveSystemAnalystComponent,
        data: { mode: Mode.EDIT }
      }
    ]
  },
  {
    path: 'pdf',
    component: SavePdfComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
