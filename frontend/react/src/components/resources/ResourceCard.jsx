import { escapeHtml } from '../../utils/escapeHtml';

// Resource Card component
// Replaces: resources.js HTML template for resource display

export function ResourceCard({ resource }) {
  return (
    <div className="rounded-xl p-5 mb-3 hover:scale-[1.01] transition-all duration-200"
      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.28)' }}>
      <h4 className="text-base font-semibold mb-2" style={{ color: '#F8FAFC' }}>
        {escapeHtml(resource.resource_title)}
      </h4>
      {resource.resource_description && (
        <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>
          {escapeHtml(resource.resource_description)}
        </p>
      )}
      <a
        href={escapeHtml(resource.resource_link)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-95 shadow-md shadow-sky-500/20"
        style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)' }}
      >
        Open resource ↗
      </a>
    </div>
  );
}
