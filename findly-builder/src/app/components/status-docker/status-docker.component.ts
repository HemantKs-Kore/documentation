import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-docker',
  templateUrl: './status-docker.component.html',
  styleUrls: ['./status-docker.component.scss']
})
export class StatusDockerComponent implements OnInit {

  @Input('dockersList') dockersList : any;
  @Input('statusDockerLoading') statusDockerLoading : any;

  constructor() { }

  ngOnInit(): void {
    console.log("dockersList", this.dockersList);
  }

}
