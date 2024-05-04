import { Hono } from 'hono';
import CryptoJS from 'crypto-js';

const transHistory = new Hono();

transHistory.get(
    '/history', 
    async (c) => {
    const serverApiUrl = 'https://indodax.com/tapi';
    const apiKey = c.req.header('ApiKey');
    const secretKey = c.req.header('SecretKey');

    const timestamp = new Date().getTime();

    const body = new FormData();
    body.append('method', 'transHistory');
    body.append('timestamp', timestamp.toString());
    body.append('recvWindow', (timestamp + 5000).toString());

    const payload = 'method=transHistory&timestamp=' + timestamp + '&recvWindow=' + (timestamp + 5000);
    const signature = CryptoJS.HmacSHA512(payload, secretKey || '').toString();

    const headers = {
        'Key': apiKey || '',
        'Sign': signature
    };

    const response = await fetch(`${serverApiUrl}`,{
        method: 'POST',
        headers: headers,
        body
    });

    const data = await response.json();

    return c.json(data);
});

export default transHistory;