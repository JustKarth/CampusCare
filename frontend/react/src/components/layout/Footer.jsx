// Footer component
// Replaces: dashboard.html footer (lines 73-75)

export function Footer() {
  return (
    <footer className="h-[70px] bg-card/50 backdrop-blur-glass border-t border-white/5 flex items-center justify-center text-sm text-text-secondary">
      <div className="flex items-center gap-4">
        <span>© 2026 CampusCare</span>
        <span className="text-primary/50">|</span>
        <a href="#" className="hover:text-primary transition-colors">Legal</a>
        <span className="text-primary/50">|</span>
        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
      </div>
    </footer>
  );
}
