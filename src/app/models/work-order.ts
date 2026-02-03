
export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';
export interface WorkOrderDocument {
    docId: string;
    docType: 'workOrder';
    data: {
        name: string;
        workCenterId: string;           // References WorkCenterDocument.docId
        status: WorkOrderStatus;
        startDate: string;              // ISO format (e.g., "2025-01-15")
        endDate: string;                // ISO format
    };
}

export interface WorkCenterDocument {
    docId: string;
    docType: 'workCenter';
    data: {
        name: string;
    };
}


export interface WorkOrderObjectListInterface {
    [key: string]: WorkOrderDocument[] | undefined;
}

export interface TimeScaleDateObject {
    month: string;
    year: number;
    day: number;
}

export interface TimeScaleDateObjectWithBarRadius {
    isBarRadiusLeft?: boolean;
    isBarRadiusRight?: boolean;
}
