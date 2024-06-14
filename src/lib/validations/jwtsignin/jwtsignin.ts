import fs from 'fs';
import jwt from 'jsonwebtoken';

export default function createJwtToken(playload: { id: string ,email:string ,username:string}, email: string) {
	const privateKey = fs.readFileSync('private.key');

	const token = jwt.sign(playload, privateKey, {
		algorithm: 'RS256',
		expiresIn: '420h',
		subject: email
	});

    return token
}
