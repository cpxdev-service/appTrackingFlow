const axios = require('axios');

async function verifyCf(req, res, next) {
    try {
        const secret = process.env.CF_SECRET;

        const params = new FormData();
        params.append('secret', secret);
        params.append('response', req.body.t);
        const { data } = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            params,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );

        if (data.success) {
            return true;
        } else {
            return false;
        }

    } catch (err) {
        return false;
    }
}

module.exports = {
    verifyCf
};