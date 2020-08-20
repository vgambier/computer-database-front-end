import React from 'react';
import { render } from '@testing-library/react';
import ComputerDashboard from './ComputerDashboard';

test('renders learn react link', () => {
  const { getByText } = render(<ComputerDashboard />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
