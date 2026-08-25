// api/profile-card.js
// Vercel Serverless Function (Node.js runtime), класичний (req, res) формат.
// ВАЖЛИВО: у Node.js runtime req.url — це лише шлях+query ("/api/profile-card?..."),
// а НЕ повний URL, і req НЕ є Fetch API Request. Тому:
//  - параметри читаємо з req.query (Vercel сам парсить query string)
//  - відповідь формуємо вручну через res.send(buffer), а не return Response

import { ImageResponse } from '@vercel/og';
import React from 'react';

const e = React.createElement;

export default async function handler(req, res) {
  try {
    const q = req.query || {};

    const nick = q.nick || 'Гравець';
    const level = q.level || '1';
    const balance = q.balance || '0';
    const bitcoins = q.bitcoins || '0';
    const rank = q.rank || '0';
    const clan = q.clan || 'немає';
    const premium = q.premium === '1';
    const carsRaw = q.cars || '';
    const cars = carsRaw.length > 0 ? carsRaw.split(',') : [];

    const gold = '#FFD700';
    const white = '#FFFFFF';
    const grey = '#9696AA';
    const green = '#00FF7F';
    const cyan = '#00CED1';
    const pink = '#FF69B4';
    const bg = '#121218';

    const statLine = (text, color) =>
      e('div', { style: { display: 'flex', color: color, fontSize: 28, marginBottom: 14 } }, text);

    const carLines = cars.length === 0
      ? [e('div', { style: { display: 'flex', color: grey, fontSize: 22 } }, 'поки що немає майна')]
      : cars.map((carName, i) =>
          e('div', { key: i, style: { display: 'flex', color: '#C8C8C8', fontSize: 22, marginBottom: 10 } }, '🏎️ ' + carName.trim())
        );

    const children = [
      e('div', { style: { display: 'flex', color: gold, fontSize: 36, fontWeight: 700 } }, '★ DYNORA GAME ★'),
      e('div', { style: { display: 'flex', color: grey, fontSize: 22, marginBottom: 30 } }, 'ПРОФІЛЬ ГРАВЦЯ'),
      statLine('👤 ' + nick, white),
      statLine('⭐ Рівень: ' + level, green),
      statLine('💰 Баланс: ' + balance + ' $', gold),
      statLine('₿ Біткоїни: ' + bitcoins, cyan),
      statLine('🏆 Місце в топі: #' + rank, pink),
      e('div', { style: { display: 'flex', color: white, fontSize: 24, marginBottom: 30 } }, '🛡 Клан: ' + clan),
      e('div', { style: { display: 'flex', width: '700px', height: '2px', backgroundColor: '#46465A', marginBottom: 20 } }),
      e('div', { style: { display: 'flex', color: white, fontSize: 26, marginBottom: 16 } }, '🏠 МАЙНО:'),
      e('div', { style: { display: 'flex', flexDirection: 'column' } }, ...carLines),
    ];

    if (premium) {
      children.push(
        e('div', { style: { display: 'flex', color: gold, fontSize: 30, marginTop: 'auto', justifyContent: 'center' } }, '👑 PREMIUM')
      );
    }

    const root = e(
      'div',
      {
        style: {
          width: '800px',
          height: '1000px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bg,
          border: '4px solid ' + (premium ? gold : '#5A5A6E'),
          padding: '50px',
          fontFamily: 'sans-serif',
        },
      },
      ...children
    );

    const imageResponse = new ImageResponse(root, { width: 800, height: 1000 });
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(buffer);
  } catch (err) {
    res.status(500).json({ error: String(err), stack: err && err.stack });
  }
}
