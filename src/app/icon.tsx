import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fef08a', // Yellow sticky note color
          borderRadius: '2px',
          border: '1px solid #ca8a04',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          transform: 'rotate(-5deg)',
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: '#1a0800',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
          }}
        >
          G
        </div>
        {/* Little Red push pin at the top center */}
        <div 
          style={{
            position: 'absolute',
            top: 2,
            left: 12,
            width: 6,
            height: 6,
            background: '#ef4444',
            borderRadius: '50%',
            boxShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
