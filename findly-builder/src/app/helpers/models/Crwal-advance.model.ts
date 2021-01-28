export class CrwalObj{  
    url: String = '';
    desc: String = '';
    name: String = '';
    resourceType: String = '';
    advanceOpts: AdvanceOpts = new AdvanceOpts()
}
export class AdvanceOpts{
    scheduleOpt:boolean = false;
    scheduleOpts:scheduleOpts = new scheduleOpts();
    useCookies = false;
    respectRobotTxtDirectives = false;
    crawlBeyondSitemaps= false;
    isJavaScriptRendered = false;
    blockHttpsMsgs = false;
    crawlDepth : number;
    maxUrlLimit  : number;
    //schedulePeriod: String ="";
    repeatInterval: String ="";
    crawlEverything: boolean = true;
    allowedOpt:boolean = true;
    allowedURLs:AllowUrl[] = [];
    blockedOpt: boolean = false;
    blockedURLs: BlockUrl[] = [];
}

export class scheduleOpts {
    date:String ="";
    time:Time = new Time();
    interval: InterVal = new InterVal();
}
export class InterVal {
    intervalType:String ="";
    intervalValue: IntervalValue = new IntervalValue();
}
export class Time{
        hour:String ="";
        minute:String ="";
        timeOpt= null;
        timezone:String ="";
}
export class IntervalValue {
    every: number = null ;
    schedulePeriod: String ="";
    repeatOn: String ="";
    endsOn: EndsOn = new EndsOn();
}
export class EndsOn {
        endType:String ="";
        endDate:String ="";
        occurrences:number = null;
      
}
export class AllowUrl {
    condition:String = 'contains';
    url: String = '';
}
export class BlockUrl {
    condition:String = 'contains';
    url: String = '';
}

