class CrwalObj{  
    url: String = '';
    desc: String = '';
    name: String = '';
    resourceType: String = '';
    advanceOpts: AdvanceOpts = new AdvanceOpts()
}
class AdvanceOpts{
    scheduleOpt:boolean = false;
    scheduleOpts:scheduleOpts = new scheduleOpts();
    schedulePeriod: String ="";
    repeatInterval: String ="";
    crawlEverything: boolean = true; 
    allowedURLs:AllowUrl[] = [];
    blockedURLs: BlockUrl[] = [];
}

class scheduleOpts {
    date:"";
    time:Time = new Time();
    interval: InterVal = new InterVal();
}
class InterVal {
    intervalType:"";
    intervalValue: IntervalValue = new IntervalValue();
}
class Time{
        hour:"";
        minute:"";
        timeOpt:"";
        timezone:"";
}
class IntervalValue {
    every: number = null ;
    schedulePeriod: "";
    repeatOn: "";
    endsOn: EndsOn = new EndsOn();
}
class EndsOn {
        endType:"";
        endDate:"";
        occurrences:number = null;
      
}
class AllowUrl {
    condition:String = 'contains';
    url: String = '';
}
class BlockUrl {
    condition:String = 'contains';
    url: String = '';
}

