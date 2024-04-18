export class Days{
    dayNo: number;
    dayDate: Date;
    events: string[] = [];
    constructor(dayNo: number, dayDate: Date){
        this.dayDate = dayDate;
        this.dayNo = dayNo;
    }
}