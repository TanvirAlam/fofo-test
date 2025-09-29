import { render, screen } from '@testing-library/react'

// Simple component for testing
const SampleComponent = ({ title }: { title: string }) => {
  return <h1>{title}</h1>
}

describe('Web App - Sample Component Tests', () => {
  it('should render sample component correctly', () => {
    render(<SampleComponent title="Hello World" />)
    
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should handle different props', () => {
    render(<SampleComponent title="Test Title" />)
    
    expect(screen.getByRole('heading')).toHaveTextContent('Test Title')
  })
})

describe('Web App - Unit Test Environment', () => {
  it('should have correct test environment', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })

  it('should support async operations', async () => {
    const promise = Promise.resolve('test value')
    const result = await promise
    
    expect(result).toBe('test value')
  })
})
