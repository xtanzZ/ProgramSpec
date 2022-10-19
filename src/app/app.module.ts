import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {FileUploadModule} from 'primeng/fileupload';
import {TabMenuModule} from 'primeng/tabmenu';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CardModule} from 'primeng/card';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ImageModule} from 'primeng/image';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TabViewModule} from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import {ToastModule} from 'primeng/toast';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchProgramComponent } from './program/search-program/search-program.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageImageComponent } from './pageimage/pageimage.component';
import { SaveProgramComponent } from './program/save-program/save-program.component';
import { SavePageImageComponent } from './pageimage/save-pageimage/save-pageimage.component';
import { ProgramComponent } from './program/program.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FiltterPageImageComponent } from './pageimage/filtter-pageimage/filtter-pageimage.component';
import { UispecComponent } from './uispec/uispec.component';
import { FiltterUispecComponent } from './uispec/filtter-uispec/filtter-uispec.component';
import { SaveUispecComponent } from './uispec/save-uispec/save-uispec.component';
import { SavePdfComponent } from './save-pdf/save-pdf.component';
import { ServiceSpecComponent } from './service-spec/service-spec.component';
import { FiltterServicespecComponent } from './service-spec/filtter-servicespec/filtter-servicespec.component';
import { MenubarModule } from 'primeng/menubar';
import { SaveServicespecComponent } from './service-spec/save-servicespec/save-servicespec.component';
import { MessageService } from 'primeng/api';
import { ProjectComponent } from './project/project.component';
import { FilterProjectComponent } from './project/filter-project/filter-project.component';
import { SaveProjectComponent } from './project/save-project/save-project.component';
import { SystemComponent } from './system/system.component';
import { FilterSystemComponent } from './system/filter-system/filter-system.component';
import { SaveSystemComponent } from './system/save-system/save-system.component';
import { SystemAnalystComponent } from './system-analyst/system-analyst.component';
import { FilterSystemAnalystComponent } from './system-analyst/filter-system-analyst/filter-system-analyst.component';
import { SaveSystemAnalystComponent } from './system-analyst/save-system-analyst/save-system-analyst.component';


@NgModule({
  declarations: [
    AppComponent,
    ProgramComponent,
    SearchProgramComponent,
    PageImageComponent,
    SavePageImageComponent,
    SaveProgramComponent,
    NavbarComponent,
    FiltterPageImageComponent,
    UispecComponent,
    FiltterUispecComponent,
    SaveUispecComponent,
    SavePdfComponent,
    ServiceSpecComponent,
    FiltterServicespecComponent,
    SaveServicespecComponent,
    ProjectComponent,
    FilterProjectComponent,
    SaveProjectComponent,
    SystemComponent,
    FilterSystemComponent,
    SaveSystemComponent,
    SystemAnalystComponent,
    FilterSystemAnalystComponent,
    SaveSystemAnalystComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PanelModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    HttpClientModule,
    TableModule,
    FileUploadModule,
    TabMenuModule,
    AutoCompleteModule,
    CardModule,
    ScrollPanelModule,
    ImageModule,
    InputTextareaModule,
    SplitButtonModule,
    MenubarModule,
    TabViewModule,
    TagModule,
    ToastModule
    
    
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
