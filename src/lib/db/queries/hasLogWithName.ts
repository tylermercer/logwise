import db from "..";

export default async function hasLogWithName(name: string): Promise<boolean> {
    return (await db.logs.filter(l => l.name === name).first()) != null;
}