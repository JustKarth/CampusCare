import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('has accessibility label', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.w-12');
    expect(spinner).toBeInTheDocument();
  });
});
