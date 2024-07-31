type WithCreatedDatetime = {
    createdDatetime: Date
}

export function oldestCreatedFirst(a: WithCreatedDatetime, b: WithCreatedDatetime): number {
    return a.createdDatetime.getTime() - b.createdDatetime.getTime();
}

export function newestCreatedFirst(a: WithCreatedDatetime, b: WithCreatedDatetime): number {
    return b.createdDatetime.getTime() - a.createdDatetime.getTime();
}