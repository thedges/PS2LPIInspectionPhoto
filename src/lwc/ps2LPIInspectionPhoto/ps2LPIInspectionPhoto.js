import { LightningElement, api, wire, track } from 'lwc';
import getContent from '@salesforce/apex/PS2LPIInspectionPhotoController.getContent';

export default class Ps2LPIInspectionPhoto extends LightningElement {
	@api recordId;
	@api cardTitle;
	@api cardIcon;
	contentPkg;
	contentList;
	taskOptions;
	taskOptionValue = '';
	error;

	connectedCallback() {
		this.loadContent();
	}

	handleTaskOption(event) {
		this.taskOptionValue = event.detail.value;
	}

	get filteredContentList() {
       if (this.taskOptionValue == '')
	   {
		return this.contentList;
	   }
	   else{
		var tmpContentlist = [];
		for (var i = 0; i < this.contentList.length; i++) {
			if (this.contentList[i].taskName == this.taskOptionValue)
			{
				tmpContentlist.push(this.contentList[i]);
			}
		}
		return tmpContentlist;
	   }
	}

	loadContent() {
		getContent({ recordId: this.recordId })
			.then(result => {
				try {
					console.log(result);
					this.contentPkg = JSON.parse(result);
					this.contentList = this.contentPkg.contentList;
					console.log('contentList >');
					console.log(this.contentList);

					if (this.contentPkg.taskList.length > 0) {
						this.taskOptions = [];
						var taskOption = {};
						taskOption.label = '';
						taskOption.value = '';
						this.taskOptions.push(taskOption);

						for (var i = 0; i < this.contentPkg.taskList.length; i++) {
							var taskOption = {};
							taskOption.label = this.contentPkg.taskList[i];
							taskOption.value = this.contentPkg.taskList[i];
							this.taskOptions.push(taskOption);
						}
						console.log('taskOptions >');
						console.log(this.taskOptions);
					}
				} catch (error) {
					console.error(error);
				}
			})
			.catch(error => {
				this.error = error;
			});
	}
}