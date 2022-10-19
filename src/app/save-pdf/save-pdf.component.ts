import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PageImage } from '../model/pageimage';
import { Program } from '../model/program';
import { UISpec } from '../model/uispec';
import { PageImageService } from '../service/pageimage.service';
import { ProgramService } from '../service/program.service';
import { UispecService } from '../service/uispec.service';
import * as fs from "fs";
import { Document, HeadingLevel, Packer, Paragraph, SectionType, Table, TableCell, TableOfContents, TableRow, TextRun, WidthType } from "docx";
import { saveAs } from 'file-saver';
import { table } from 'console';
import { ServicespecService } from '../service/servicespec.service';
import { ServiceSpec } from '../model/serviceSpec';


@Component({
  selector: 'app-save-pdf',
  templateUrl: './save-pdf.component.html',
  styleUrls: ['./save-pdf.component.scss']
})
export class SavePdfComponent implements OnInit {

  constructor(private programService: ProgramService, private pageImageService: PageImageService, private uispecService: UispecService, private serviceSpecService: ServicespecService) { }

  programPDF: Program[] = [];
  programId: any;
  programName: any;
  systemName: any;
  systemAnalyst: any;
  projectName: any;
  statusName: any;


  pageImages: PageImage[] = [];
  pageImagesId: any[] = [];
  filtterPageImages: PageImage[] = [];
  uiSpecs: UISpec[] = [];
  uiSpecsId: any[] = [];
  filtterUiSpecs: UISpec[] = [];
  detail: string | undefined
  action: string = "Action"

  serviceSpecs: ServiceSpec[] = []
  filtterServiceSpecs: ServiceSpec[] = []
  serviceSpecLength!: number;


  ngOnInit(): void {

    this.programService.getProgramPdfId(this.programService.programId).subscribe(response => {
      this.programPDF = response;
      console.log("DATA" + JSON.stringify(this.programPDF))
      const jsonValue = JSON.stringify(this.programPDF);
      const valueFromJson = JSON.parse(jsonValue);
      this.projectName = ((valueFromJson || {}).project || {}).projectName;
      this.systemName = ((valueFromJson || {}).system || {}).systemName;
      this.systemAnalyst = ((valueFromJson || {}).systemAnalyst || {}).systemAnalystName;
      this.statusName = ((valueFromJson || {}).status || {}).statusName;
      this.pageImageService.getPageImagesPdf().subscribe(response => {
        this.pageImages = response;
        this.uispecService.getUISpecsPdf().subscribe(response => {
          this.uiSpecs = response;
          this.serviceSpecService.getServiceSpecsPdf().subscribe(response => {
            this.serviceSpecs = response;
            // this.serviceSpecLength = this.serviceSpecs.length-2
            this.filtterPageImage();
            console.log("aaaaaaa"+JSON.stringify(this.filtterServiceSpecs))
          })
        })
       
      })
    })

 

  
  }



  downloadProgram() {
    var element = document.getElementById('htmlData');
    var opt = {
      margin: 0,
      filename: 'ProgramSpec.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }

  downloadService() {
    var element = document.getElementById('htmlDataService');
    var opt = {
      margin: 0,
      filename: 'ServiceSpec.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }


  downloadDocx(): void {

    const table = new Table({

      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 2500,
                type: WidthType.DXA,
              },

              children: [new Paragraph("Label")],
            }),
            new TableCell({
              width: {
                size: 2500,
                type: WidthType.DXA,
              },

              children: [new Paragraph("Attribure")],
            }),
            new TableCell({
              width: {
                size: 2500,
                type: WidthType.DXA,
              },

              children: [new Paragraph("FormType")],
            }),
            new TableCell({
              width: {
                size: 2500,
                type: WidthType.DXA,
              },

              children: [new Paragraph("Detail")],
            }),
            new TableCell({
              width: {
                size: 2500,
                type: WidthType.DXA,
              },

              children: [new Paragraph("Event")],
            }),
          ],
        }),


      ],

    });

    const doc = new Document({
      sections: [
        {

          children: [
            new Paragraph({ text: "Table with skewed widths" }),
            table,
          ],
        },
      ],
    });





    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }


  test() {
    // https://docx.js.org/#/?id=welcome
    // https://stackblitz.com/edit/angular-docx?file=src%2Fapp%2Fcv-generator.ts
    console.log("uispec" + JSON.stringify(this.filtterUiSpecs))
  }



  // @ViewChild('htmlData') htmlData: ElementRef | undefined;
  // openPDF(): void {
  //   let DATA: any = document.getElementById('htmlData');
  //   html2canvas(DATA).then((canvas) => {
  //     let fileWidth = 210;
  //     let pageHeight = 297;
  //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
  //     let heightLeft = fileHeight;
  //     const FILEURI = canvas.toDataURL('image/png');
  //     let PDF = new jsPDF('p', 'mm', 'a4');
  //     let position = 10;
  //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //     console.log("fileHeight :" + fileHeight)
  //     console.log("Position :" + position)
  //     heightLeft -= pageHeight;

  //     while (heightLeft >= 0) {
  //       position += heightLeft - fileHeight; // top padding for other pages
  //       PDF.addPage();
  //       PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //       console.log("fileHeight1 :" + fileHeight)
  //       console.log("Position1 :" + position)
  //       console.log("file 2" + fileHeight)
  //       heightLeft -= pageHeight;
  //     }
  //     PDF.save('angular-demo.docx');

  //   });
  // }

  checkTable(detail: string) {
    if (detail == "Default") {
      this.detail = "Default"
    } else {
      this.detail = ""
    }
  }


  filtterPageImage() {
    let filtered: any[] = [];
    Object.entries(this.programPDF).find(([key, value]) => {
      if (key === 'programId') {
        this.programId = value;
      }
      else if (key === 'programName') {
        this.programName = value;
      }
    });

    for (let i = 0; i < this.pageImages.length; i++) {
      let pageImages = this.pageImages[i];
      if (pageImages.program.programId == this.programId) {
        filtered.push(this.pageImages[i]);
      }
    }

    this.filtterPageImages = filtered;
    console.log("filtterPageImages : ")
    console.log(this.filtterPageImages)
    this.filtterUiSpec();
  }


  filtterUiSpec() {
    Object.entries(this.filtterPageImages).find(([key, value]) => {
      console.log("key : " + value.program.programId)
      if (value.program.programId === this.programId) {
        this.pageImagesId.push(value.pageImageId);
        console.log(this.pageImagesId)

      }
    });
    let filtered: any[] = [];
    for (let i = 0; i < this.pageImagesId.length; i++) {
      console.log(this.pageImagesId[i])
      for (let j = 0; j < this.uiSpecs.length; j++) {
        let uiSpecs = this.uiSpecs[j];
        if (this.pageImagesId[i] == uiSpecs.pageimage.pageImageId) {
          for(let i =1; i<100; i++){
            this.uiSpecs[j].event = uiSpecs.event.replace(i+'.', '<br>'+i+'.')
            this.uiSpecs[j].detail = uiSpecs.detail.replace(i+'.', '<br>'+i+'.')
          }
          filtered.push(this.uiSpecs[j]);
        }
      }

    }
    this.filtterUiSpecs = filtered;
    this.filtterServiceSpec();
  }

  filtterServiceSpec() {
    Object.entries(this.filtterUiSpecs).find(([key, value]) => {
      if (value.service !== undefined) {
        const index = this.uiSpecsId.map(obj => obj).indexOf(value.service.serviceId);
        if (index > -1) {
          this.uiSpecsId.splice(index, 1);
        }
        this.uiSpecsId.push(value.service.serviceId);

      }
      
    });
    this.serviceSpecLength = this.uiSpecsId.length-2
    console.log(this.uiSpecsId)

   
    let filtered: any[] = [];
    for (let i = 0; i < this.uiSpecsId.length; i++) {
      console.log(this.uiSpecsId[i])
      for (let j = 0; j < this.serviceSpecs.length; j++) {
        let serviceSpecs = this.serviceSpecs[j];
        if (this.uiSpecsId[i] == serviceSpecs.serviceId) {
          if (this.serviceSpecs[j].inputParameter !== undefined) {    
            this.serviceSpecs[j].inputParameter = serviceSpecs.inputParameter.split(",").join(",<br/>");
            this.serviceSpecs[j].inputParameter = serviceSpecs.inputParameter.split("{").join("{<br/>");   
            this.serviceSpecs[j].inputParameter = serviceSpecs.inputParameter.split("}").join("<br/>}");      
          }
          if (this.serviceSpecs[j].exampleResponse !== undefined) {    
            this.serviceSpecs[j].exampleResponse = serviceSpecs.exampleResponse.split(",").join(",<br/>");  
            this.serviceSpecs[j].exampleResponse = serviceSpecs.exampleResponse.split("{").join("{<br/>"); 
            this.serviceSpecs[j].exampleResponse = serviceSpecs.exampleResponse.split("}").join("<br/>}");  
          }
          for(let i =2; i<100; i++){
            this.serviceSpecs[j].detail = serviceSpecs.detail.replace(i+'.', '<br>'+i+'.')
          }
          filtered.push(this.serviceSpecs[j]);
        
        }
      }

    }
    const distinctArray = filtered.filter((n, i) => filtered.indexOf(n) === i);
    this.filtterServiceSpecs = distinctArray;
  }

  calculateSpecTotal(name: any) {
    let total = 0;

    if (this.filtterUiSpecs) {
      for (let uispec of this.filtterUiSpecs) {
        if (uispec.pageimage.pageImageName === name) {
          total++;
        }
      }
    }

    return total;
  }


}


