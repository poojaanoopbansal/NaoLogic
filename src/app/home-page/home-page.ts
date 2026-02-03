import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimeScaleDateObject, TimeScaleDateObjectWithBarRadius, WorkCenterDocument, WorkOrderDocument, WorkOrderObjectListInterface } from '../models/work-order';
import { WorkConters, WorkOrders } from '../mock-data/mock-data';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-home-page',
  imports: [NgSelectModule, CommonModule, FormsModule, ScrollingModule, CdkVirtualScrollViewport],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {

  selectedTimeScale = 'Month';
  timeScaleList: Array<TimeScaleDateObject> = [];
  previousStartIndex: number = 0;
  previousEndIndex: number = 0;
  timeScaleOptions = [
    { value: 'Hour', label: 'Hour' },
    { value: 'Day', label: 'Day' },
    { value: 'Week', label: 'Week' },
    { value: 'Month', label: 'Month' }
  ];
  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;
  scrollInitialized = false;
  workCenterList: Array<WorkCenterDocument> = WorkConters;
  workCenterObjectList: WorkOrderObjectListInterface = {};
  workOrderList: Array<WorkOrderDocument> = WorkOrders;
  itemsPerPage = 20;
  lastScrollLeft = 0;
  readonly ITEM_SIZE = 114;
  isInitialScroll = false;
  called = 0;
  todayDate: Date = new Date();
  todaysDateObject = {
    month: this.todayDate.toLocaleString('en-US', { month: 'short' }),
    year: this.todayDate.getFullYear(),
    day: this.todayDate.getDate()
  };
  workOrderBarRadiusData: { workOrder?: WorkOrderDocument, barWidth?: number, startDatePoint?: number, isContainToday?: boolean } = {};
  workCenterIDKeysNamePairsList: { [key: string]: string } = {};
  todayIndex: number = 0;
  CSRF: any;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  constructor(private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.generateInitialMonths();
    this.setWorkCenterEmptyListKeys();
    this.setWorkCenterObjectList();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToToday();
    }, 100);
  }

  setWorkCenterEmptyListKeys() {
    this.workCenterList.forEach((workCenter: WorkCenterDocument) => {
      this.workCenterIDKeysNamePairsList[workCenter.docId] = workCenter.data.name;
      this.workCenterObjectList[workCenter.docId] = [];
    });
  }

  setWorkCenterObjectList() {
    this.workOrderList.forEach((workOrder: WorkOrderDocument) => {
      if (this.workCenterObjectList[workOrder?.data?.workCenterId]) {
        this.workCenterObjectList[workOrder.data.workCenterId]?.push(workOrder);
      }
    });
  }

  findWorkCenterNameInCurrentTimeScale(workCenterId: string, startDate: TimeScaleDateObject) {
    let data: any = {};
    let allWorkOrders = this.workCenterObjectList[workCenterId];
    let startDateTimeScaleObject = new Date(`${startDate.month} ${startDate.day}, ${startDate.year}`);
    let workOrdersList = allWorkOrders?.filter((workOrder: WorkOrderDocument) => {
      let startDateObj = new Date(workOrder.data.startDate);
      let endDateObj = new Date(workOrder.data.endDate);
      if (this.selectedTimeScale === 'Month') {
        startDateObj = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1);
        endDateObj = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1);
        startDateTimeScaleObject = new Date(`${startDate.month} 1, ${startDate.year}`);
        if (startDateTimeScaleObject.getTime() >= startDateObj.getTime() && startDateTimeScaleObject.getTime() <= endDateObj.getTime()) {
          //the first block will have company name

          this.workOrderBarRadiusData.isContainToday = true;
          if (startDateTimeScaleObject.getTime() === startDateObj.getTime()) {
            data.barWidth = this.setWidthForBar(workOrder, data);
          }
          return { workOrder, ...data };
        } else {
          return null;
        }
      } else {
        if (startDateObj.getTime() <= startDateTimeScaleObject.getTime() && endDateObj.getTime() >= startDateTimeScaleObject.getTime()) {
          return workOrder;
        } else {
          return null;
        }
      }
    });
    this.workOrderBarRadiusData = workOrdersList && workOrdersList?.length > 0 ? { workOrder: workOrdersList[0], ...data } : {};
  }


  //calculate width for bar with fraction
  setWidthForBar(workOrder: WorkOrderDocument, data: any) {
    let startDateObj = new Date(workOrder.data.startDate);
    let endDateObj = new Date(workOrder.data.endDate);
    // Calculate the difference in days
    let day = startDateObj.getDate();
    let month = startDateObj.getMonth();
    let year = startDateObj.getFullYear();
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let percentage = (day / daysInMonth);
    //calculated to set left property since the rest of the days will not be included
    data.startDatePoint = percentage * 114;
    let diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //calculated the width of the bar 
    return ((12 * this.ITEM_SIZE) / 365) * diffDays;
  }

  onTimeScaleChange(event: any) {
    this.timeScaleList = [];
    switch (this.selectedTimeScale) {
      case 'Day':
        this.generateInitialDays();
        break;
      case 'Month':
        this.generateInitialMonths();
        break;
    }
    this.scrollToToday();
  }

  scrollToToday() {
    let todayMonth = this.todayDate.getMonth();
    let todayYear = this.todayDate.getFullYear();
    let todayDay = this.todayDate.getDate();

    let todayIndex = this.timeScaleList.findIndex(
      m => new Date(`${m.month} 1, ${m.year}`).getMonth() === todayMonth &&
        m.year === todayYear
    );
    switch (this.selectedTimeScale) {
      case 'Day':
        let todayMonthName = this.todayDate.toLocaleString('en-US', { month: 'short' });
        // Find the day index within the month
        const dayIndex = this.timeScaleList.findIndex(
          d => d.day === todayDay && d.month === todayMonthName && d.year === todayYear
        );
        if (dayIndex !== -1) {
          this.viewport.scrollToIndex(dayIndex - 1, 'smooth');
        }
        break;
      case 'Month':
        let todayIndex = this.timeScaleList.findIndex(
          m => new Date(`${m.month} 1, ${m.year}`).getMonth() === todayMonth &&
            m.year === todayYear
        );
        if (todayIndex !== -1) {
          this.viewport.scrollToIndex(todayIndex - 1, 'smooth');
        }
        break;
    }
    this.isInitialScroll = false;
  }

  onScroll(event: any) {
    if (this.isInitialScroll) {
      return;
    }
    const range = this.viewport.getRenderedRange();
    if (this.previousStartIndex == 0 && this.previousEndIndex == 0) {
      this.previousStartIndex = range.start;
      this.previousEndIndex = range.end;
      return;
    }
    if (this.previousEndIndex !== range.end && range.end >= this.timeScaleList.length - 8) {
      switch (this.selectedTimeScale) {
        case 'Day':
          this.appendDays();
          break;
        case 'Month':
          this.appendMonths();
          break;
      }
      this.previousEndIndex = range.end;
    }
    if ((this.previousStartIndex !== range.start || this.previousStartIndex > range.start) && (range.start < 4 && range.end < this.previousEndIndex)) {
      switch (this.selectedTimeScale) {
        case 'Day':
          this.prependDays(4, range.start);
          break;
        case 'Month':
          this.prependMonths(4, range.start);
          break;
      }
      this.previousStartIndex = range.start;
      if (this.CSRF) {
        cancelAnimationFrame(this.CSRF);
      }
      this.CSRF = requestAnimationFrame(() => {
        // document.getElementById(`${this.visibleData.month}-${this.visibleData.year}`)?.scrollIntoView({ behavior: 'smooth' });
        this.viewport?.scrollToIndex(event + 5, 'smooth');
      });
    } else if (range.end > this.previousEndIndex) {
      this.previousEndIndex = range.end;
    }
    setTimeout(() => {
      this.setIndexForVisibleTodaysDate();
    }, 100);
  }

  trackByIndex(index: number, item: any) {
    return item.month + '-' + item.year + '-' + item.day;
  }

  setIndexForVisibleTodaysDate() {
    this.todayIndex = parseInt(document.getElementById(`${this.todaysDateObject.month}-${this.todaysDateObject.day}-${this.todaysDateObject.year}`)?.getAttribute('data-index') || '-1');
    if (this.todayIndex !== -1) {
      this.todayIndex = this.todayIndex - this.viewport.getRenderedRange().start;

      this.cdr.detectChanges();
    }
    // let range = this.viewport.getRenderedRange();
    // this.todayIndex = -1;
    // for (let i = range.start; i <= range.end; i++) {
    //   if (this.timeScaleList[i].month === this.todaysDateObject.month && this.timeScaleList[i].year === this.todaysDateObject.year && this.timeScaleList[i].day === this.todaysDateObject.day) {
    //     this.todayIndex = i - range.start;
    //     break;
    //   }
    // }
  }

  generateInitialMonths() {
    const today = new Date();
    let current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    for (let i = 0; i <= this.itemsPerPage; i++) {
      this.timeScaleList.push({
        month: current.toLocaleString('en-US', { month: 'short' }),
        year: current.getFullYear(),
        day: current.getDate()
      });
      current.setMonth(current.getMonth() + 1);
    }

    this.prependMonths(8);
  }

  generateInitialDays() {
    const today = new Date();
    let current = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (let i = 0; i <= this.itemsPerPage; i++) {
      this.timeScaleList.push({
        day: current.getDate(),
        month: current.toLocaleString('en-US', { month: 'short' }),
        year: current.getFullYear()
      });

      // Move to the next day
      current.setDate(current.getDate() + 1);
    }

    this.prependDays(8);
  }

  appendDays() {
    let lastElemnt = this.timeScaleList[this.timeScaleList.length - 1];
    const monthIndex = new Date(`${lastElemnt.month} 1, ${lastElemnt.year}`).getMonth();
    const current = new Date(lastElemnt.year, monthIndex, lastElemnt.day);
    const newDates = [];
    for (let i = 0; i <= this.itemsPerPage; i++) {
      newDates.push({
        day: current.getDate(),
        month: current.toLocaleString('en-US', { month: 'short' }),
        year: current.getFullYear()
      });

      // Move to the next day
      current.setDate(current.getDate() + 1);
      this.timeScaleList = [...this.timeScaleList, ...newDates];

    }
  }

  prependDays(count: number = this.itemsPerPage, startIndex?: number) {
    const first = this.timeScaleList[0];
    const newDates = [];
    const monthIndex = new Date(`${first.month} 1, ${first.year}`).getMonth();
    const newMonths: { month: string; year: number; day: number }[] = [];
    let currentDate = new Date(first.year, monthIndex, first.day);
    currentDate.setDate(currentDate.getDate() - 1);

    for (let i = 0; i < count; i++) {
      newMonths.unshift({
        month: currentDate.toLocaleString('en-US', { month: 'short' }),
        year: currentDate.getFullYear(),
        day: currentDate.getDate()
      });
      currentDate.setDate(currentDate.getDate() - 1);
    }

    this.timeScaleList = [...newMonths, ...this.timeScaleList];
  }


  prependMonths(count: number = this.itemsPerPage, startIndex?: number) {
    const first = this.timeScaleList[0];
    const newDates = [];
    const monthIndex = new Date(`${first.month} 1, ${first.year}`).getMonth();
    const newMonths: { month: string; year: number; day: number }[] = [];
    let currentMonth = monthIndex;
    let currentYear = first.year;

    for (let i = 0; i < count; i++) {
      // Move one month back
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;     // previous year
      }
      const date = new Date(currentYear, currentMonth, 1);
      newMonths.unshift({
        month: date.toLocaleString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        day: 1
      });
    }

    this.timeScaleList = [...newMonths, ...this.timeScaleList];
    // if (startIndex) {
    //   this.viewport?.scrollToIndex(startIndex + count, 'smooth');
    // }

    // Optional: adjust scroll to avoid jump
    // setTimeout(() => {
    //   const el = this.scrollContainer.nativeElement;
    //   el.scrollLeft += el.scrollWidth / (this.timeScaleList.length / 7); // approximate
    // });
  }

  appendMonths() {
    const first = this.timeScaleList[this.timeScaleList.length - 1];
    const newDates = [];
    const monthIndex = new Date(`${first.month} 1, ${first.year}`).getMonth();
    const newMonths: { month: string; year: number; day: number }[] = [];
    let currentMonth = monthIndex;
    let currentYear = first.year;

    for (let i = 0; i < this.itemsPerPage; i++) {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      const date = new Date(currentYear, currentMonth, 1);
      newMonths.push({
        month: date.toLocaleString('en-US', { month: 'long' }),
        year: date.getFullYear(),
        day: 1
      });
    }
    this.timeScaleList = [...this.timeScaleList, ...newMonths];

    // Optional: adjust scroll to avoid jump
    // setTimeout(() => {
    //   const el = this.scrollContainer.nativeElement;
    //   el.scrollLeft += el.scrollWidth / (this.timeScaleList.length / 7); // approximate
    // });
  }
}



