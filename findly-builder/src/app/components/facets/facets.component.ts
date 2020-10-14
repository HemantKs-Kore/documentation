import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {
  facetModalRef:any;  
  constructor() { }
  @ViewChild('facetModalPouup') facetModalPouup: KRModalComponent;
  ngOnInit(): void {
  }
  openModal(){
    this.facetModalRef = this.facetModalPouup.open();
  }
  closeModal(){
    this.facetModalRef.close();
  }

}
