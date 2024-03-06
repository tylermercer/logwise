export default function deepEqual<T>(obj1: T, obj2: T) {

    if(obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    if(isPrimitive(obj1) && isPrimitive(obj2)) // compare primitives
        return obj1 === obj2;

    if(Object.keys(obj1 as object).length !== Object.keys(obj2 as object).length)
        return false;

    // compare objects with same number of keys
    for(let key in obj1)
    {
        if(!(key in (obj2 as unknown as object))) return false; //other object doesn't have this prop
        if(!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj: any)
{
    return (obj !== Object(obj));
}