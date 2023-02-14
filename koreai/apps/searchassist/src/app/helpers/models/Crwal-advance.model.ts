export class CrwalObj {
  url = '';
  desc = '';
  name = '';
  advanceOpts: AdvanceOpts = new AdvanceOpts();
  authorizationEnabled = false;
  authorizationProfle: AuthorizationProfle = new AuthorizationProfle();
}
export class AdvanceOpts {
  scheduleOpt = false;
  scheduleOpts: scheduleOpts = new scheduleOpts();
  useCookies = false;
  respectRobotTxtDirectives = false;
  crawlBeyondSitemaps = false;
  isJavaScriptRendered = false;
  blockHttpsMsgs = false;
  crawlDepth: number;
  maxUrlLimit: number;
  repeatInterval = '';
  crawlEverything = true;
  allowedOpt = false;
  allowedURLs = [];
  blockedOpt = false;
  blockedURLs = [];
}

export class AuthorizationProfle {
  sso_type = '';
  formFields: any = [];
  basicFields: any = [
    {
      isRequired: true,
      key: 'Username or email',
      type: 'textbox',
      isEnabled: true,
      value: 'Username',
      isEditable: false,
      duplicateObj: { value: 'Username' },
    },
    {
      isRequired: true,
      key: 'Password',
      type: 'password',
      isEnabled: true,
      value: 'password',
      isEditable: false,
      duplicateObj: { value: 'password' },
    },
  ];
  authorizationFields: Array<AuthorizationFields> = [];
  authCheckUrl = '';
  testType = '';
  testValue = '';
}

export class AuthorizationFields {
  type: string;
  key: string;
  value: string;
  isEnabled: boolean;
}

export class scheduleOpts {
  date = '';
  time: Time = new Time();
  interval: InterVal = new InterVal();
}
export class InterVal {
  intervalType = '';
  intervalValue: IntervalValue = new IntervalValue();
}
export class Time {
  hour = '';
  minute = '';
  timeOpt = null;
  timezone = '';
}
export class IntervalValue {
  every: number = null;
  schedulePeriod = '';
  repeatOn = '';
  endsOn: EndsOn = new EndsOn();
}
export class EndsOn {
  endType = '';
  endDate = '';
  occurrences: number = null;
}
export class AllowUrl {
  condition = 'contains';
  url = '';
  name = 'Contains';
}
export class BlockUrl {
  condition = 'contains';
  url = '';
  name = 'Contains';
}
