import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connectors-source',
  templateUrl: './connectors-source.component.html',
  styleUrls: ['./connectors-source.component.scss']
})
export class ConnectorsSourceComponent implements OnInit {

  Instructions=[
    {heading:"Quick setup, then all of your documents will be searchable.",
     type:"Confluence",
     icon:'assets/icons/connectors/confluence.png',
     description:"documentation content",
     sampleexample:[{heading:"How to add Google Drive",description:"documentation content",clientidheading:"Generate Client ID",
     clientidexample:"Ex: RB69B5VG",secretidheading:"Generate Secret ID",secretidexample:"Ex: 12345",icon:'assets/icons/connectors/confluence.png',
     iconheading:"Connect sources",iconexamples:"Ex: Files, Audio, Video, Images..."}],
     steps:[{stepnumber:"Step 1",steptitle:"Configure an OAuth application",linktext:"Documentation",url:"",linkiconpresent:true,stepdescription:"Setup a secure OAuth application through the content source that you or your team will use to connect and synchronize content. You only have to do this once per content source."}
     ,{stepnumber:"Step 2",steptitle:"Connect the content source",linktext:"",url:"",linkiconpresent:false,stepdescription:"Use the new OAuth application to connect any number of instances of the content source to  Search Assist."}
     ,{stepnumber:"Step 3",steptitle:"Follow authentification flow",linktext:"",url:"",linkiconpresent:false,stepdescription:"Follow the Confluence authentication flow as presented in the documentation link."}
     ,{stepnumber:"Step 4",steptitle:"Authentication",linktext:"",url:"",linkiconpresent:false,stepdescription:"Upon the successful authentication flow, you will be redirected to Search Assist.Google Drive content will now be captured and will be ready for search gradually as it is synced. Once successfully configured and connected, the Google Drive will synchronize automatically."}]
    }]
     
     

  constructor() { }

  ngOnInit(): void {
  }

}
