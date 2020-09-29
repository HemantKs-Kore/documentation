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
    schedulePeriod: String ="";
    repeatInterval: String ="";
    crawlEverything: boolean = true;
    allowedOpt:boolean = true;
    allowedURLs:AllowUrl[] = [];
    blockedOpt: boolean = false;
    blockedURLs: BlockUrl[] = [];
}

export class scheduleOpts {
    date:"";
    time:Time = new Time();
    interval: InterVal = new InterVal();
}
export class InterVal {
    intervalType:"";
    intervalValue: IntervalValue = new IntervalValue();
}
export class Time{
        hour:"";
        minute:"";
        timeOpt:"";
        timezone:"";
}
export class IntervalValue {
    every: number = null ;
    schedulePeriod: "";
    repeatOn: "";
    endsOn: EndsOn = new EndsOn();
}
export class EndsOn {
        endType:"";
        endDate:"";
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

