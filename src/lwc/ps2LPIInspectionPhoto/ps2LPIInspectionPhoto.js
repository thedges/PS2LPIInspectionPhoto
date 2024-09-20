import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContent from '@salesforce/apex/PS2LPIInspectionPhotoController.getContent';


export default class Ps2LPIInspectionPhoto extends LightningElement {
	@api recordId;
	@api cardTitle;
	@api cardIcon;
	contentPkg;
	contentList;
	taskOptions;
	taskOptionValue = '';
	resultOptions;
	resultOptionValue = '';
	error;

	isLoading = true;

	connectedCallback() {
		this.loadContent();
	}

	handleTaskOption(event) {
		this.taskOptionValue = event.detail.value;
	}

	handleResultOption(event) {
		this.resultOptionValue = event.detail.value;
	}

	get filteredContentList() {
		if ((this.taskOptionValue == '') && (this.resultOptionValue == '')) {
			return this.contentList;
		}
		else {
			var tmpContentlist = [];
			for (var i = 0; i < this.contentList.length; i++) {
				if ((this.taskOptionValue != '') && (this.resultOptionValue == '')) {
					if (this.contentList[i].taskName == this.taskOptionValue) {
						tmpContentlist.push(this.contentList[i]);
					}
				}
				else if ((this.taskOptionValue == '') && (this.resultOptionValue != '')) {
					if (this.contentList[i].assessmentResult == this.resultOptionValue) {
						tmpContentlist.push(this.contentList[i]);
					}
				}
				else if ((this.taskOptionValue != '') && (this.resultOptionValue != '')) {
					if ((this.contentList[i].taskName == this.taskOptionValue) &&
					   (this.contentList[i].assessmentResult == this.resultOptionValue)) {
						tmpContentlist.push(this.contentList[i]);
					}
				}


			}
			return tmpContentlist;
		}
	}

	loadContent() {
		this.isLoading = true;

		getContent({ recordId: this.recordId })
			.then(result => {
				this.isLoading = false;

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

					if (this.contentPkg.resultList.length > 0) {
						this.resultOptions = [];
						var resultOption = {};
						resultOption.label = '';
						resultOption.value = '';
						this.resultOptions.push(resultOption);

						for (var i = 0; i < this.contentPkg.resultList.length; i++) {
							var resultOption = {};
							resultOption.label = this.contentPkg.resultList[i];
							resultOption.value = this.contentPkg.resultList[i];
							this.resultOptions.push(resultOption);
						}
						console.log('resultOptions >');
						console.log(this.resultOptions);
					}
				} catch (error) {
					 this.handleError(error);
				}
			})
			.catch(error => {
				this.error = error;
			});
	}

    handleRefresh(evt) {
        console.log('handleRefresh');
        this.loadContent();
    }

	handleError(err) {
        console.log(this.prefix + 'error=' + err);
        console.log(this.prefix + 'type=' + typeof err);

        this.isLoading = false;

        const event = new ShowToastEvent({
            title: err.statusText,
            message: err.body.message,
            variant: 'error',
            mode: 'sticky',
        });
        this.dispatchEvent(event);
    }
}