import { Component, OnInit, ViewChild } from '@angular/core';
import { RangeSlider } from '../../helpers/models/range-slider.model';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-weights',
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss']
})
export class WeightsComponent implements OnInit {
  addEditWeighObj:any= null;
  addDditWeightPopRef:any;
  disableCancle:any = true;
  @ViewChild('addDditWeightPop') addDditWeightPop: KRModalComponent;
  constructor(
    public dialog: MatDialog,
  ) { }
  weights:any = [
    {
     name : 'Proximity',
     description : 'Signifies how near are the matching query words in the records',
     sliderObj :new RangeSlider(0, 10, 1, 2,'proximity')
    },
    {
      name : 'Match Count',
      description : 'Signifies Number of query words matching exactly',
      sliderObj :new RangeSlider(0, 10, 1, 2,'exactMatch')
     },
     {
      name : 'Title Match',
      description : 'Signifies number of words from the query matched at least once',
      sliderObj :new RangeSlider(0, 10, 1, 2,'matchCount')
     },
     {
      name : 'Last Modified',
      description : 'Signifies number of words from the query matched the title of the results',
      sliderObj :new RangeSlider(0, 10, 1, 2,'titleMatch')
     },
     {
      name : 'Proximity',
      description : 'Signifies how near are the madwetching query words in the records',
      sliderObj :new RangeSlider(0, 10, 1, 2,'prdedewwdewoximity')
     },
     {
       name : 'Match Count',
       description : 'Signifies Number of query words matching exactly',
       sliderObj :new RangeSlider(0, 10, 1, 2,'exactMadewdewtch')
      },
      {
       name : 'Title Match',
       description : 'Signifies number of words from the query matched at least once',
       sliderObj :new RangeSlider(0, 10, 1, 2,'madewtchCodwedunt')
      },
      {
       name : 'Last Modified',
       description : 'Signifies number of words from the query matched the title of the results',
       sliderObj :new RangeSlider(0, 10, 1, 2,'titleMdewdatch')
      },
      {
        name : 'Proximity',
        description : 'Signifies how near are the matching query words in the records',
        sliderObj :new RangeSlider(0, 10, 1, 2,'proximitdewyd')
       },
       {
         name : 'Match Count',
         description : 'Signifies Number of query words matching exactly',
         sliderObj :new RangeSlider(0, 10, 1, 2,'edewxactMadetch')
        },
        {
         name : 'Title Match',
         description : 'Signifies number of words from the query matched at least once',
         sliderObj :new RangeSlider(0, 10, 1, 2,'dewmatcdehCount')
        },
        {
         name : 'Last Modified',
         description : 'Signifies number of words from the query matched the title of the results',
         sliderObj :new RangeSlider(0, 10, 1, 2,'tdewditledwedMatch')
        },
        {
          name : 'Last Modified',
          description : 'Signifies number of words from the query matched the title of the results',
          sliderObj :new RangeSlider(0, 10, 1, 2,'tdewdewditledwedMatch')
         },
         {
          name : 'Last Modified',
          description : 'Signifies number of words from the query matched the title of the results',
          sliderObj :new RangeSlider(0, 10, 1, 2,'tdewditledewdwedMatch')
         },
         {
          name : 'Last Modified',
          description : 'Signifies number of words from the query matched the title of the results',
          sliderObj :new RangeSlider(0, 10, 1, 2,'tdedewdwditledwedMatch')
         },
         {
          name : 'Last Modified',
          description : 'Signifies number of words from the query matched the title of the results',
          sliderObj :new RangeSlider(0, 10, 1, 2,'tddewewditledwedMatch')
         },
  ];
  ngOnInit(): void {
  }
  valueEvent(val,weight){
   this.disableCancle = false;
   weight.sliderObj.default = val;
  }
  editWeight(weight){
    const editWeight = JSON.parse(JSON.stringify(weight));
    editWeight.sliderObj.id = 'editSlider';
    this.addEditWeighObj = editWeight;
    this.openAddEditWeight();
  }
  openAddEditWeight() {
   this.addDditWeightPopRef  = this.addDditWeightPop.open();
  }
  openAddNewWeight() {
    this.addEditWeighObj = {
      name : '',
      description : '',
      sliderObj :new RangeSlider(0, 10, 1, 2,'editSlider')
    };
    this.openAddEditWeight();
  }
  closeAddEditWeight() {
   if(this.addDditWeightPopRef && this.addDditWeightPopRef.close){
    this.addDditWeightPopRef.close();
   }
  }
  setDataToActual(){
    console.log('dataSet');
  }
  deleteWeight(record,event,index) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Weight',
        text: 'Are you sure you want to delete selected Weight?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.weights.splice(index,1);
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
}
