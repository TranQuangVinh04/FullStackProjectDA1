import bcrypt from "bcryptjs";
export const hashValue = async (value:string):Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(value,salt)
    return hash;
}
export const compareValue = async (value:string,valueCompare:any):Promise<boolean> => {
    const resuft =await bcrypt.compare(value,valueCompare);
    return resuft;
}