import { Hono } from 'hono';
import CryptoJS from 'crypto-js';

const trade = new Hono();

interface RequestJson {
    from: string;
    to: string;
    type: string;
    price: number;
    coin: number;
}

trade.post(
    '/trade',
    async (c) => {
    const serverApiUrl = 'https://indodax.com/tapi';
    const apiKey = c.req.header('ApiKey');
    const secretKey = c.req.header('SecretKey');

    const requestJson = await c.req.json<RequestJson>();
    const { from, to, type, price, coin } = requestJson;

    const timestamp = new Date().getTime();

    const bodyReq = new FormData();
    bodyReq.append('method', 'trade');
    bodyReq.append('timestamp', timestamp.toString());
    bodyReq.append('recvWindow', (timestamp + 5000).toString());
    bodyReq.append('pair', from + '_' + to);
    bodyReq.append('type', type);
    bodyReq.append('price', price.toString());
    bodyReq.append(from, coin.toString());
    
    const payload = 'method=trade&timestamp=' + timestamp + '&recvWindow=' + (timestamp + 5000) + '&pair=' + from + '_' + to + '&type=' + type + '&price=' + price + '&' + from + '=' + coin;
    const signature = CryptoJS.HmacSHA512(payload, secretKey || '').toString();

    const headers = {
        'Key': apiKey || '',
        'Sign': signature
    };

    const response = await fetch(`${serverApiUrl}`,{
        method: 'POST',
        headers: headers,
        body: bodyReq
    });

    const data = await response.json();

    return c.json(data);
});

export default trade;