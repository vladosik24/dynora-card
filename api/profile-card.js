// api/profile-card.js
// Деплой: Vercel Edge Function. Малює PNG-картку профілю за query-параметрами.
// URL приклад:
// https://ТВІЙ-ДОМЕН.vercel.app/api/profile-card?nick=Tim&level=37&balance=125480000&bitcoins=4250&rank=128&clan=Elite&premium=1&cars=Bugatti,Yacht,Penthouse

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req) {
  const { searchParams } = new URL(req.url);

  const nick = searchParams.get('nick') || 'Гравець';
  const level = searchParams.get('level') || '1';
  const balance = searchParams.get('balance') || '0';
  const bitcoins = searchParams.get('bitcoins') || '0';
  const rank = searchParams.get('rank') || '—';
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

  return new ImageResponse(
    (
      <div
        style={{
          width: '800px',
          height: '1000px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bg,
          border: '4px solid ' + (premium ? gold : '#5A5A6E'),
          padding: '50px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', color: gold, fontSize: 36, fontWeight: 700 }}>
          ★ DYNORA GAME ★
        </div>
        <div style={{ display: 'flex', color: grey, fontSize: 22, marginBottom: 30 }}>
          ПРОФІЛЬ ГРАВЦЯ
        </div>

        <div style={{ display: 'flex', color: white, fontSize: 32, marginBottom: 14 }}>
          👤 {nick}
        </div>
        <div style={{ display: 'flex', color: green, fontSize: 28, marginBottom: 14 }}>
          ⭐ Рівень: {level}
        </div>
        <div style={{ display: 'flex', color: gold, fontSize: 28, marginBottom: 14 }}>
          💰 Баланс: {balance} $
        </div>
        <div style={{ display: 'flex', color: cyan, fontSize: 28, marginBottom: 14 }}>
          ₿ Біткоїни: {bitcoins}
        </div>
        <div style={{ display: 'flex', color: pink, fontSize: 28, marginBottom: 14 }}>
          🏆 Місце в топі: #{rank}
        </div>
        <div style={{ display: 'flex', color: white, fontSize: 24, marginBottom: 30 }}>
          🛡 Клан: {clan}
        </div>

        <div style={{ display: 'flex', width: '700px', height: '2px', backgroundColor: '#46465A', marginBottom: 20 }} />

        <div style={{ display: 'flex', color: white, fontSize: 26, marginBottom: 16 }}>
          🏠 МАЙНО:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {cars.length === 0 ? (
            <div style={{ display: 'flex', color: grey, fontSize: 22 }}>поки що немає майна</div>
          ) : (
            cars.map((carName, i) => (
              <div key={i} style={{ display: 'flex', color: '#C8C8C8', fontSize: 22, marginBottom: 10 }}>
                🏎️ {carName.trim()}
              </div>
            ))
          )}
        </div>

        {premium && (
          <div style={{ display: 'flex', color: gold, fontSize: 30, marginTop: 'auto', justifyContent: 'center' }}>
            👑 PREMIUM
          </div>
        )}
      </div>
    ),
    { width: 800, height: 1000 }
  );
}
