type PendingStatus = {
    status: 'pending',
}
type FulfilledStatus<T> = {
    status: 'fulfilled',
    value: T,
}
type RejectedStatus = {
    status: 'rejected',
    reason: any,
}

type PromiseStatus<T> = PendingStatus | RejectedStatus | FulfilledStatus<T>

export default async function getPromiseState<T>(promise: Promise<T>): Promise<PromiseStatus<T>> {
    const pendingState = { status: "pending" };

    return Promise.race([promise, pendingState]).then(
        (value) => value === pendingState ?
            value as PendingStatus :
            { status: "fulfilled", value: value as T },
        (reason) => ({ status: "rejected", reason }),
    );
}