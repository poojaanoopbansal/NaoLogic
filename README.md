# WorkOrder

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```


@upgrade:- I was just able to complete show timelines for the mockData for Month and the infinite Scrolling is done for TimeScale Month & Day.

My graph is not being shown on TiemScale Day, but the infinite scrolling is working for that scale.

Next steps:
- Fix the graph display for TiemScale Day
- Implement the mock data for the timeline
- Implement the infinite scrolling for other timeline
- Implement the panel using prim-ng pop up which is easy to implement.
- When new Work Order is created , I would have compared that the StartDate exist for that particular company, if yes, I would have thrown the error , otherwise I would have created the work order.
- Same Goes for Editing the WorkOrder.