import verifyJwt from '$lib/validations/jwtverify/jwtverify';
import type { LayoutServerLoad } from './$types';

export const load = (async ({cookies}) => {

    const jwt = cookies.get('jwt')

    if(!jwt){
        return {}
    }

   const sessionToken = verifyJwt(jwt)

    return {
        session:sessionToken
    };
}) satisfies LayoutServerLoad;