import { WorkCenterDocument, WorkOrderDocument } from "../models/work-order";

export const WorkConters: WorkCenterDocument[] = [
    {
        "docId": "wc-001",
        "docType": "workCenter",
        "data": {
            "name": "Extrusion Line A"
        }
    },
    {
        "docId": "wc-002",
        "docType": "workCenter",
        "data": {
            "name": "CNC Machine 1"
        }
    },
    {
        "docId": "wc-003",
        "docType": "workCenter",
        "data": {
            "name": "Assembly Station"
        }
    },
    {
        "docId": "wc-004",
        "docType": "workCenter",
        "data": {
            "name": "Quality Control"
        }
    },
    {
        "docId": "wc-005",
        "docType": "workCenter",
        "data": {
            "name": "Packaging Line"
        }
    }
]
export const WorkOrders: WorkOrderDocument[] = [
    {
        "docId": "wo-101",
        "docType": "workOrder",
        "data": {
            "name": "Extrusion Line A",
            "workCenterId": "wc-001",
            "status": "in-progress",
            "startDate": "2026-02-02",
            "endDate": "2026-03-29"
        }
    },
    {
        "docId": "wo-102",
        "docType": "workOrder",
        "data": {
            "name": "CNC Machine 1",
            "workCenterId": "wc-002",
            "status": "open",
            "startDate": "2026-02-02",
            "endDate": "2026-07-02"
        }
    },
    {
        "docId": "wo-103",
        "docType": "workOrder",
        "data": {
            "name": "Assembly Station",
            "workCenterId": "wc-003",
            "status": "blocked",
            "startDate": "2026-02-02",
            "endDate": "2026-03-28"
        }
    },
    {
        "docId": "wo-104",
        "docType": "workOrder",
        "data": {
            "name": "Quality Control",
            "workCenterId": "wc-004",
            "status": "complete",
            "startDate": "2026-02-02",
            "endDate": "2026-05-21"
        }
    },
    {
        "docId": "wo-105",
        "docType": "workOrder",
        "data": {
            "name": "Packaging Line",
            "workCenterId": "wc-005",
            "status": "open",
            "startDate": "2026-02-01",
            "endDate": "2026-06-01"
        }
    },
    {
        "docId": "wo-106",
        "docType": "workOrder",
        "data": {
            "name": "Extrusion Line A",
            "workCenterId": "wc-001",
            "status": "blocked",
            "startDate": "2026-04-24",
            "endDate": "2026-08-25"
        }
    },
    {
        "docId": "wo-107",
        "docType": "workOrder",
        "data": {
            "name": "Lathe Refinement - Shaft B",
            "workCenterId": "wc-002",
            "status": "in-progress",
            "startDate": "2026-09-28",
            "endDate": "2027-1-28"
        }
    },
    {
        "docId": "wo-108",
        "docType": "workOrder",
        "data": {
            "name": "Assembly Station",
            "workCenterId": "wc-003",
            "status": "open",
            "startDate": "2026-09-05",
            "endDate": "2026-11-07"
        }
    },
    {
        "docId": "wo-109",
        "docType": "workOrder",
        "data": {
            "name": "Quality Control",
            "workCenterId": "wc-004",
            "status": "in-progress",
            "startDate": "2026-09-28",
            "endDate": "2026-11-29"
        }
    },
    {
        "docId": "wo-110",
        "docType": "workOrder",
        "data": {
            "name": "Packaging Line",
            "workCenterId": "wc-005",
            "status": "complete",
            "startDate": "2026-09-24",
            "endDate": "2026-12-25"
        }
    }
];



