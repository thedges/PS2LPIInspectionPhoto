public with sharing class PS2LPIInspectionPhotoController
{
    // DOWNLOAD LINKS
    // https://salesforce.stackexchange.com/questions/260937/how-to-generate-a-download-url-for-a-contentdocument-in-lightning-community
    // /sfc/servlet.shepherd/version/download/{ID}
    // /sfc/servlet.shepherd/document/download/{id}?operationContext=S1
    // /customer/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId={versionId}&operationContext=COMMUNITY&contentId={contentId}&page=0
    //
    // https://forcepanda.wordpress.com/2021/05/04/generating-public-url-for-salesforce-files/
    // https : //hicglobalsolutions.com/blog/how-to-generate-download-url-and-preview-url-from-files-in-salesforce-to-be-accessible-on-external-websites/
    public PS2LPIInspectionPhotoController()
    {
    }

    @AuraEnabled
    public static String getContent(ID recordId)
    {
        List<PS2Assessment> assmntList = new List<PS2Assessment>();
        List<PS2Content> contentList = new List<PS2Content>();
        List<Id> assessmentIdList = new List<Id>();
        List<Id> contentIdList = new List<Id>();
        List<String> taskList = new List<String>();
        Map<String, PS2Assessment> assmntMap = new Map<String, PS2Assessment>();


        List<InspectionAssessmentInd> assessmentList = [SELECT Id, Result, AssessmentTaskId, AssessmentTask.Name, AssessmentIndDefinitionId, AssessmentIndDefinition.Name, DisplayOrder, NumberFieldResponse, PercentageFieldResponse, TextFieldResponse, DateTimeFieldResponse, DecimalFieldResponse
                                                        FROM InspectionAssessmentInd
                                                        WHERE AssessmentTask.ParentId = :recordId];

        for (InspectionAssessmentInd assessment : assessmentList)
        {
            PS2Assessment a = new PS2Assessment();
            a.taskId = assessment.AssessmentTaskId;
            a.taskName = assessment.AssessmentTask.Name;
            a.assessmentId = assessment.Id;
            a.assessmentName = assessment.AssessmentIndDefinition.Name;
            a.assessmentResult = assessment.Result;
            a.assessmentDisplayOrder = assessment.DisplayOrder;
            //contentList.add(content);

            if (!taskList.contains(assessment.AssessmentTask.Name))
            {
                taskList.add(assessment.AssessmentTask.Name);
            }

            assmntMap.put(assessment.Id, a);

            assessmentIdList.add(assessment.Id);
        }

        List<ContentDocumentLink> cdlList = [SELECT Id, LinkedEntityId, ShareType, SystemModstamp, Visibility, ContentDocument.CreatedDate, ContentDocument.ContentSize, ContentDocument.FileType, ContentDocument.FileExtension, ContentDocument.Title, ContentDocument.LastModifiedDate, ContentDocument.Id, ContentDocument.LatestPublishedVersionId, ContentDocument.LatestPublishedVersion.VersionDataUrl, ContentDocument.OwnerId, ContentDocument.Owner.Name
                                             FROM ContentDocumentLink
                                             WHERE LinkedEntityId IN :assessmentIdList];

        for (ContentDocumentLink cdl : cdlList)
        {
            PS2Assessment a = assmntMap.get(cdl.LinkedEntityId);

            PS2Content p = new PS2Content();
            p.assessmentId = a.assessmentId;
            p.taskId = a.taskId;
            p.taskName = a.taskName;
            p.assessmentName = a.assessmentName;
            p.assessmentResult = a.assessmentResult;
            p.assessmentDisplayOrder = a.assessmentDisplayOrder;
            p.contentId = cdl.ContentDocumentId;
            p.contentCDLId = cdl.Id;
            p.contentTitle = cdl.ContentDocument.Title;
            p.contentLMDT = cdl.ContentDocument.LastModifiedDate;
            p.contentFileType = cdl.ContentDocument.FileType;
            p.contentSize = cdl.ContentDocument.ContentSize;
            p.contentOwnerId = cdl.ContentDocument.OwnerId;
            p.contentOwnerName = cdl.ContentDocument.Owner.Name;
            p.createdDate = cdl.ContentDocument.CreatedDate.format('yyyy-MM-dd h:mm a');
            p.versionId = cdl.ContentDocument.LatestPublishedVersionId;
            p.versionURL = cdl.ContentDocument.LatestPublishedVersion.VersionDataUrl;
            contentList.add(p);
        }
        System.debug('contentList = ' + JSON.serializePretty(contentList));

        taskList.sort ();

        //////////////////////////////////////////
        // remove empty items from content list //
        //////////////////////////////////////////
        if (contentList != null && contentList.size() > 0)
        {
            for (Integer i = (contentList.size() - 1); i >= 0; i--)
            {
                PS2Content c = contentList[i];
                if (c.versionId == null)
                {
                    contentList.remove(i);
                }
            }
        }

        PS2ContentPkg pkg = new PS2ContentPkg();
        pkg.taskList = taskList;
        pkg.contentList = contentList;

        return JSON.serializePretty(pkg);
    }

    private class PS2ContentPkg
    {
        @AuraEnabled
        public List<String> taskList = null;
        @AuraEnabled
        public List<PS2Content> contentList = null;
    }

    private class PS2Assessment
    {
        @AuraEnabled
        public Id assessmentId = null;
        @AuraEnabled
        public String taskId = null;
        @AuraEnabled
        public String taskName = null;
        @AuraEnabled
        public String assessmentName = null;
        @AuraEnabled
        public String assessmentResult = null;
        @AuraEnabled
        public Integer assessmentDisplayOrder = null;
    }

    private class PS2Content
    {
        @AuraEnabled
        public Id assessmentId = null;
        @AuraEnabled
        public String taskId = null;
        @AuraEnabled
        public String taskName = null;
        @AuraEnabled
        public String assessmentName = null;
        @AuraEnabled
        public String assessmentResult = null;
        @AuraEnabled
        public Integer assessmentDisplayOrder = null;
        @AuraEnabled
        public Id contentId = null;
        @AuraEnabled
        public Id contentCDLId = null;
        @AuraEnabled
        public String contentTitle = null;
        @AuraEnabled
        public Datetime contentLMDT = null;
        @AuraEnabled
        public String contentFileType = null;
        @AuraEnabled
        public Integer contentSize = null;
        @AuraEnabled
        public Id contentOwnerId = null;
        @AuraEnabled
        public String contentOwnerName = null;
        @AuraEnabled
        public String createdDate = null;
        @AuraEnabled
        public Id versionId = null;
        @AuraEnabled
        public String versionURL = null;
    }

    // PS2LPIInspectionPhotoController.test();
    public static void test()
    {
        ID recordId = ID.valueOf('0Z5Hs000000xFOzKAM');
        String resp = getContent(recordId);
        System.debug(resp);
    }

}