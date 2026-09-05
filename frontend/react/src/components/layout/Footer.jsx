// Footer component
export function Footer() {
  return (
    <footer
      className="flex items-center justify-center text-sm py-5 px-6 gap-4"
      style={{
        background: '#151c2c',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        color: '#8b9ab5',
      }}
    >
      <span>© 2026 <span style={{ color: '#c4b5fd', fontWeight: 600 }}>CampusCare</span></span>
      <span style={{ color: '#2a3448' }}>|</span>
      <a href="#" className="transition-colors" style={{ color: '#8b9ab5' }}
        onMouseEnter={e => e.target.style.color = '#a78bfa'}
        onMouseLeave={e => e.target.style.color = '#8b9ab5'}>Legal</a>
      <span style={{ color: '#2a3448' }}>|</span>
      <a href="#" className="transition-colors" style={{ color: '#8b9ab5' }}
        onMouseEnter={e => e.target.style.color = '#a78bfa'}
        onMouseLeave={e => e.target.style.color = '#8b9ab5'}>Privacy Policy</a>
    </footer>
  );
}
