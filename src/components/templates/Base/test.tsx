import { render, screen } from '@testing-library/react'

import Base from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: 'localhost:3005/rastreamento'
      }
    }
  }
})

describe('<Base />', () => {
  it('Deve renderizar o component', () => {
    render(
      <Base>
        <p>Test</p>
      </Base>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
