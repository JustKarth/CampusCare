import { escapeHtml } from '../../utils/escapeHtml';

// Resource Card component
// Replaces: resources.js HTML template for resource display

export function ResourceCard({ resource }) {
  return (
    <div className="bg-white rounded-lg p-4 mb-3 shadow-md hover:shadow-lg transition-shadow">
      <h4 className="text-lg font-semibold mb-2">{escapeHtml(resource.resource_title)}</h4>
      {resource.resource_description && (
        <p className="text-gray-600 mb-3">{escapeHtml(resource.resource_description)}</p>
      )}
      <a
        href={escapeHtml(resource.resource_link)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Open resource
      </a>
    </div>
  );
}
