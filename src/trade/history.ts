import { Hono } from 'hono';
import CryptoJS from 'crypto-js';

const tradeHistory = new Hono();

interface RequestJson {
    pair: string;
    order_id: number;
}

tradeHistory.post(
    '/trade/history', 
    async (c) => {
    const serverApiUrl = 'https://indodax.com/tapi';
    const apiKey = c.req.header('ApiKey');
    const secretKey = c.req.header('SecretKey');
    
    const requestJson = await c.req.json<RequestJson>();
    const { pair } = requestJson;

    const timestamp = new Date().getTime();

    const body = new FormData();
    body.append('method', 'tradeHistory');
    body.append('timestamp', timestamp.toString());
    body.append('recvWindow', (timestamp + 5000).toString());
    body.append('pair', pair);

    

    const payload = 'method=tradeHistory&timestamp=' + timestamp + '&recvWindow=' + (timestamp + 5000) + '&pair=' + pair;
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

export default tradeHistory;