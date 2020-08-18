import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { workflowService } from '@kore.services/workflow.service';
@Component({
  selector: 'app-live-chat-agent-instructions',
  templateUrl: './live-chat-agent-instructions.component.html',
  styleUrls: ['./live-chat-agent-instructions.component.scss']
})
export class LiveChatAgentInstructionsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LiveChatAgentInstructionsComponent>,
    public workflowService: workflowService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
