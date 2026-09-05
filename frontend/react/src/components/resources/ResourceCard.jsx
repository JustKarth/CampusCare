import { escapeHtml } from '../../utils/escapeHtml';

// Resource Card component
// Replaces: resources.js HTML template for resource display

export function ResourceCard({ resource }) {
  return (
    <div className="rounded-xl p-5 mb-3 hover:scale-[1.01] transition-all duration-200"
      style={{ background: '#1a2235', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}>
      <h4 className="text-base font-semibold mb-2" style={{ color: '#f0f4ff' }}>
        {escapeHtml(resource.resource_title)}
      </h4>
      {resource.resource_description && (
        <p className="text-sm mb-4" style={{ color: '#8b9ab5' }}>
          {escapeHtml(resource.resource_description)}
        </p>
      )}
      <a
        href={escapeHtml(resource.resource_link)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7b2ff7, #2563eb)' }}
      >
        Open resource ↗
      </a>
    </div>
  );
}
