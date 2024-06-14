import fs from 'fs';
import jwt from 'jsonwebtoken';

export default function verifyJwt(token:string){

    const publicKey = fs.readFileSync('public.key');

    const verify = jwt.verify(token ,publicKey)

    return verify
}