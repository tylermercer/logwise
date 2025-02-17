export default async function delay(millis: number): Promise<void> {
    return new Promise(r => setTimeout(r, millis));
}