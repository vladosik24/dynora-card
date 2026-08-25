// api/profile-card.js
// Деплой: Vercel Serverless Function (Node.js runtime).
// ПРИМІТКА: @vercel/og під Edge-рантаймом у не-Next.js проєкті видав помилку
// "references unsupported modules" (не міг статично перевірити внутрішні
// модулі satori/yoga-wasm). Тому працюємо на звичайному Node.js runtime —
// там повний доступ до модулів, обмежень немає.
// Написано без JSX (React.createElement напряму) — щоб збірка не залежала
// від наявності JSX-транспілятора в проєкті.
//
// URL приклад:
// /api/profile-card?nick=Tim&level=37&balance=125480000&bitcoins=4250&rank=128&clan=Elite&premium=1&cars=Bugatti,Yacht,Penthouse

import { ImageResponse } from '@vercel/og';
import React from 'react';

const e = React.createElement;

export default function handler(req) {
  const { searchParams } = new URL(req.url);

  const nick = searchParams.get('nick') || 'Гравець';
  const level = searchParams.get('level') || '1';
  const balance = searchParams.get('balance') || '0';
  const bitcoins = searchParams.get('bitcoins') || '0';
  const rank = searchParams.get('rank') || '0';
  const clan = searchParams.get('clan') || 'немає';
  const premium = searchParams.get('premium') === '1';
  const carsRaw = searchParams.get('cars') || '';
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

  return new ImageResponse(root, { width: 800, height: 1000 });
}
