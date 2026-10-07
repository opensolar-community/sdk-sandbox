import { render } from '@testing-library/react'
import { LoadingDots } from './loadingDots'

test('renders the three sk-bouncedelay dots', () => {
  const { container } = render(<LoadingDots />)
  expect(container.querySelectorAll('.os-sk-spinner > div')).toHaveLength(3)
})
