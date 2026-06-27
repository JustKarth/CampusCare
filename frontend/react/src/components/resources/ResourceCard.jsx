import { escapeHtml } from '../../utils/escapeHtml';

// Resource Card component
// Replaces: resources.js HTML template for resource display

export function ResourceCard({ resource }) {
  return (
    <div className="bg-card rounded-card p-4 mb-3 shadow-card hover:shadow-card-hover transition-shadow border border-white/5">
      <h4 className="text-lg font-semibold mb-2 text-text-primary">{escapeHtml(resource.resource_title)}</h4>
      {resource.resource_description && (
        <p className="text-text-secondary mb-3">{escapeHtml(resource.resource_description)}</p>
      )}
      <a
        href={escapeHtml(resource.resource_link)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-sm"
      >
        Open resource
      </a>
    </div>
  );
}
