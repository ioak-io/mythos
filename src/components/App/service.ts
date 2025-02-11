/* eslint-disable import/prefer-default-export */
import { setSessionValue } from '../../utils/SessionUtils';
import { httpPost, httpPut } from '../Lib/RestTemplate';

export const rotateToken = async (space: string, authorization: any) => {
    return await httpPost(
        `/${space}/user/auth/token`,
        { grant_type: 'refresh_token', refresh_token: authorization.refresh_token },
        {},
        process.env.REACT_APP_ONEAUTH_API_URL
    )
        .then((response) => {
            if (response.status === 200) {
                setSessionValue(
                    `mythos-access_token`,
                    response.data.access_token
                );
                return Promise.resolve(response.data);
            }
            return Promise.resolve(null);
        })
        .catch((error) => {
            return Promise.resolve(null);
        });
};
