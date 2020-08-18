export class CallHistoryModel {
    userId: string;
    phNumber: string;
    dateTime: string;
    time: string;
    startTime: string;
    endTime: string;
    duration: string;
    status: string;
    messageId: string;
    email: string;
    symbol: string;

    constructor (res: any, dateTime, time, duration) {
        this.userId = res.userId;
        this.phNumber = res.phoneNumber;
        this.email = res.email;
        this.startTime = res.startedOn;
        this.endTime = res.endedOn;
        this.dateTime = dateTime;
        this.time = time;
        this.duration = duration;
        this.status = res.status;
        this.messageId = res.messageId;
        this.symbol = res.flow.join(' > ');
    }
}