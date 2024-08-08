import { LightningElement, api } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class Ps2LPIInspectionPhotoCard extends NavigationMixin(LightningElement) {
  @api id;
  @api taskName;
  @api taskId;
  @api assessmentName;
  @api assessmentId;
  @api ownerId;
  @api ownerName;
  @api versionId;
  @api contentId;
  @api content;
  thumbnailURL;

  connectedCallback() {
    this.thumbnailURL = '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=' + this.content.versionId;
  }
  
  handleDownload(event) {
    console.log('download clicked');
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: '/sfc/servlet.shepherd/version/download/' + this.content.versionId
        }
    });
  }

  handlePreview(event) {
    console.log('preview clicked');
    console.log('contentId=' + this.content.contentId);
    this[NavigationMixin.Navigate]({
        type:'standard__namedPage',
        attributes:{
            pageName:'filePreview'
        },
        state:{
            selectedRecordId: this.content.contentId
        }
    })
  }

  handleTask(event) {
    console.log('task clicked');
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.content.taskId,
            objectApiName: 'Task',
            actionName: 'view'
        },
    });
  }

  handleAssessment(event) {
    console.log('assessment clicked');
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.content.assessmentId,
            objectApiName: 'InspectionAssessmentInd',
            actionName: 'view'
        },
    });
  }
}