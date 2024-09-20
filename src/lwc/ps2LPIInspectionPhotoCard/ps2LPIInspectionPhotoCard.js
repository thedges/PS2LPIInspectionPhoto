import { LightningElement, api } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import ViolationIcon from '@salesforce/resourceUrl/PS2LPIViolation';
import PassIcon from '@salesforce/resourceUrl/PS2LPIPass';
import FailIcon from '@salesforce/resourceUrl/PS2LPIFail';

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

  violationIcon = ViolationIcon;
  passIcon = PassIcon;
  failIcon = FailIcon;

  @api
  get isViolation() {
    return this.content.openViolation;
  }

  @api
  get isPass() {
    return (this.content.assessmentResult == 'Pass');
  }

  @api
  get isFail() {
    return (this.content.assessmentResult == 'Fail');
  }

  connectedCallback() {
    console.log('ViolationIcon=' + ViolationIcon);
 
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

  handleViolation(event) {
    console.log('violation clicked');
    this[NavigationMixin.Navigate]({
        type: 'standard__recordRelationshipPage',
        attributes: {
            recordId: this.content.assessmentId,
            objectApiName: 'InspectionAssessmentInd',
            relationshipApiName: 'RegCodeInspectionAssmntInd',
            actionName: 'view'
        },
    });
  }
}