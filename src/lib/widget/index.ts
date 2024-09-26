import type { DbBool, LogId } from "$lib/db/types";
import type { VersionedSchemaEntity } from "$lib/db/types/VersionedSchemaEntity";
import type { TypeID } from "typeid-unboxed";

export type WidgetId = TypeID<'widget'>;

export interface BaseWidget<T extends string> extends VersionedSchemaEntity {
    id: WidgetId;
    type: T;
}

export interface BasePerLogWidget<T extends string> extends BaseWidget<T> {
    logId: LogId;
    showOnLog: DbBool;
    hideOnHome: DbBool;
}

interface StreakWidget extends BasePerLogWidget<'streak'> {
}

interface HeapWidget extends BasePerLogWidget<'heap'> {
}

interface TimeChartWidget extends BaseWidget<'time-chart'> {
    days: number;
    logIds: LogId[];
    showOnLogs: DbBool;
    hideOnHome: DbBool;
}

interface RandomEntryWidget extends BasePerLogWidget<'random-entry'> {
}


interface LastEntryWidget extends BasePerLogWidget<'last-entry-widget'> {
}

export type Widget = StreakWidget | HeapWidget | TimeChartWidget | RandomEntryWidget | LastEntryWidget;