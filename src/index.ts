import * as https from 'https';
import * as querystring from 'querystring';
import {appId, secretKey} from '../config/user';
import md5 = require('md5');

type BaiduResult = {
  from: string;
  to: string;
  trans_result: { src: string, dst: string }[]
  error_code?: string
  error_message?: string
}


export const translate = (word: string) => {
  const salt = Math.random();
  const sign: string = md5(appId + word + salt + secretKey);
  let from, to;
  if (/[a-zA-Z]/.test(word[0])) {
    from = 'en';
    to = 'zh';
  } else {
    from = 'zh';
    to = 'eh';
  }

  const query: string = querystring.stringify({
    q: word,
    from,
    to,
    appid: appId,
    salt,
    sign,
  });
  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };
  const req = https.request(options, (res) => {
    const chunks: Buffer[] = [];
    res.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    res.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      const resObj: BaiduResult = JSON.parse(string);
      if (resObj.error_code) {
        console.error(resObj.error_code);
      } else {
        resObj.trans_result.map(item => console.log(item.dst));
      }
    });
  });

  req.on('error', e => {
    console.log(e);
  });
  req.end();
};