// Footer component
export function Footer() {
  return (
    <footer
      className="flex items-center justify-center text-sm py-5 px-6 gap-4"
      style={{
        background: '#0F172A',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        color: '#94A3B8',
      }}
    >
      <span>© 2026 <span style={{ color: '#38BDF8', fontWeight: 600 }}>CampusCare</span></span>
      <span style={{ color: '#334155' }}>|</span>
      <a href="#" className="transition-colors" style={{ color: '#94A3B8' }}
        onMouseEnter={e => e.target.style.color = '#38BDF8'}
        onMouseLeave={e => e.target.style.color = '#94A3B8'}>Legal</a>
      <span style={{ color: '#334155' }}>|</span>
      <a href="#" className="transition-colors" style={{ color: '#94A3B8' }}
        onMouseEnter={e => e.target.style.color = '#38BDF8'}
        onMouseLeave={e => e.target.style.color = '#94A3B8'}>Privacy Policy</a>
    </footer>
  );
}
