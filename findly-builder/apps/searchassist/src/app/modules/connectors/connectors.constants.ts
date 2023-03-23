//list of connectors available
export const ConnectorsList = [
  {
    connector_name: 'Confluence (Server)',
    description: 'connectors_please_compleate_configuration',
    type: 'confluenceServer',
    image: 'assets/icons/connectors/confluence.png',
    url: 'https://admin.atlassian.com/',
    doc_url: 'https://developer.atlassian.com/',
    tag: 'Wiki, Atlassian, Intranet',
  },
  {
    connector_name: 'Confluence (Cloud)',
    description: 'connectors_please_compleate_configuration',
    type: 'confluenceCloud',
    image: 'assets/icons/connectors/confluence.png',
    url: 'https://admin.atlassian.com/',
    doc_url: 'https://developer.atlassian.com/',
    tag: 'Wiki, Atlassian, Intranet',
  },
  {
    connector_name: 'Service Now',
    description: 'connectors_please_compleate_configuration',
    type: 'serviceNow',
    image: 'assets/icons/connectors/servicenow.png',
    url: 'https://www.servicenow.com/',
    doc_url: 'https://developer.servicenow.com/dev.do',
    tag: 'The world works with ServiceNow',
  },
  {
    connector_name: 'Zendesk',
    description: 'connectors_please_compleate_configuration',
    type: 'zendesk',
    image: 'assets/icons/connectors/zendesk.png',
    url: 'https://www.zendesk.com/',
    doc_url: 'https://developer.zendesk.com/documentation/',
    tag: 'Engineering Awesome',
  },
  {
    connector_name: 'SharePoint',
    description: 'connectors_please_compleate_configuration',
    type: 'sharepointOnline',
    image: 'assets/icons/connectors/sharepoint.png',
    url: 'https://microsoft.sharepoint.com/',
    doc_url: 'https://learn.microsoft.com/en-us/sharepoint/dev/',
    tag: 'Empowering teamwork',
  },
  {
    connector_name: "Google Drive",
    description: "connectors_please_compleate_configuration",
    type: "googleDrive",
    image: "assets/icons/connectors/drive-google.png",
    url: "https://drive.google.com/drive/my-drive",
    doc_url: "https://developers.google.com/drive",
    tag: "keep everything. Share anything."
  }
];

//all connectors object added below
export const ConnectorObject = [
  {
    "name": "connectors_name",
    "placeholder": "connectors_enter_name_here",
    "isPassword": false,
    "isMandatory": true,
    "value": "name",
    "connectors": ['confluenceServer', 'confluenceCloud', 'serviceNow', 'zendesk', 'sharepointOnline', 'googleDrive']
  },
  {
    "name": "connectors_clientid",
    "placeholder": "connectors_paste_client_ID_here",
    "isPassword": true,
    "isMandatory": true,
    "value": "clientId",
    "connectors": ['confluenceServer', 'confluenceCloud', 'serviceNow', 'zendesk', 'sharepointOnline', 'googleDrive']
  },
  {
    "name": "connectors_clientsecretId",
    "placeholder": "connectors_Paste_Secret_ID_here",
    "isPassword": true,
    "isMandatory": true,
    "value": "clientSecret",
    "connectors": ['confluenceServer', 'confluenceCloud', 'serviceNow', 'zendesk', 'sharepointOnline', 'googleDrive']
  },
  {
    "name": "connectors_hostURL",
    "placeholder": "connectors_hosturl_text",
    "isPassword": false,
    "isMandatory": true,
    "value": "hostUrl",
    "connectors": ['confluenceServer', 'confluenceCloud', 'serviceNow', 'zendesk']
  },
  {
    "name": "connectors_tenant_id",
    "placeholder": "connectors_enter_tenant_id",
    "isPassword": true,
    "isMandatory": true,
    "value": "tenantId",
    "connectors": ['sharepointOnline']
  },
  {
    "name": "connectors_host_domain_name",
    "placeholder": "connectors_hostdomain_text",
    "isPassword": false,
    "isMandatory": true,
    "value": "hostDomainName",
    "connectors": ['confluenceServer', 'confluenceCloud']
  },
  {
    "name": "connectors_username",
    "placeholder": "connectors_Enter_username_here",
    "isPassword": false,
    "isMandatory": true,
    "value": "username",
    "connectors": ['serviceNow']
  },
  {
    "name": "connectors_password",
    "placeholder": "connectors_enter_password_here",
    "isPassword": true,
    "isMandatory": true,
    "value": "password",
    "connectors": ['serviceNow']
  }
];

//job status array in jobs Tab
export const JobStatusList = [{ name: 'Success', status: 'success', color: 'green' }, { name: 'In Progress', status: 'inprogress', color: 'black' }, { name: 'Partial Success', status: 'partial_success', color: 'green' }, { name: 'Queued', status: 'queued', color: 'red' }, { name: 'Stopped', status: 'stopped', color: 'red' }];

//connector steps array in add page
export const ConnectorSteps = [
  { name: 'instructions', isCompleted: true, display: 'Introduction' },
  {
    name: 'configurtion',
    isCompleted: false,
    display: 'Configuration & Authentication',
  },
];

//connectors tab list in edit page
export const ConnectorTabs = [
  { name: 'Overview', type: 'overview' },
  { name: 'Content', type: 'content' },
  { name: 'Connection Settings', type: 'connectionSettings' },
  { name: 'Configurations', type: 'configurations' },
  { name: 'Jobs', type: 'jobs' },
];
