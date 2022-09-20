export class CrwalObj {
    url: String = '';
    desc: String = '';
    name: String = '';
    advanceOpts: AdvanceOpts = new AdvanceOpts();
    authorizationEnabled: boolean = false;
    authorizationProfle: AuthorizationProfle = new AuthorizationProfle();
}
export class AdvanceOpts {
    scheduleOpt: boolean = false;
    scheduleOpts: scheduleOpts = new scheduleOpts();
    useCookies = false;
    respectRobotTxtDirectives = false;
    crawlBeyondSitemaps = false;
    isJavaScriptRendered = false;
    blockHttpsMsgs = false;
    crawlDepth: number;
    maxUrlLimit: number;
    repeatInterval: String = "";
    crawlEverything: boolean = true;
    allowedOpt: boolean = false;
    allowedURLs: Array<Object> = [];
    blockedOpt: boolean = false;
    blockedURLs: Array<Object> = [];
}

export class AuthorizationProfle {
    sso_type: String = "";
    formFields: any = [];
    basicFields: any = [
        {
            isRequired: true,
            key: "Username or email",
            type: "textbox",
            isEnabled: true,
            value: "Username",
            isEditable: false,
            duplicateObj:{value: "Username"}
        },
        {
            isRequired: true,
            key: "Password",
            type: "password",
            isEnabled: true,
            value: "password",
            isEditable: false,
            duplicateObj:{value: "password"}
        }];
    authorizationFields: Array<AuthorizationFields> = [];
    authCheckUrl: String = "";
    testType: String = "";
    testValue: String = "";
}

export class AuthorizationFields {
    type: String;
    key: String;
    value: String;
    isEnabled: Boolean;
}

export class scheduleOpts {
    date: String = "";
    time: Time = new Time();
    interval: InterVal = new InterVal();
}
export class InterVal {
    intervalType: String = "";
    intervalValue: IntervalValue = new IntervalValue();
}
export class Time {
    hour: String = "";
    minute: String = "";
    timeOpt = null;
    timezone: String = "";
}
export class IntervalValue {
    every: number = null;
    schedulePeriod: String = "";
    repeatOn: String = "";
    endsOn: EndsOn = new EndsOn();
}
export class EndsOn {
    endType: String = "";
    endDate: String = "";
    occurrences: number = null;

}
export class AllowUrl {
    condition: String = 'contains';
    url: String = '';
    name: String = 'Contains';
}
export class BlockUrl {
    condition: String = 'contains';
    url: String = '';
    name: String = 'Contains';
}

