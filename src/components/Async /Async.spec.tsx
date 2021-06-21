import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Async } from '.'

test('it renders correctly', async () => {
  render(<Async />)

  expect(screen.getByText('Hello World')).toBeInTheDocument()

  //expect(await screen.findByText('Hidden Button')).toBeInTheDocument()
  await waitFor(() => {
    return expect(screen.getByText('Hidden Button')).toBeInTheDocument()
  })

  
  // await waitFor(() => {
  //   return expect(screen.queryByText('Invisible Button')).not.toBeInTheDocument()
  // })
  await waitForElementToBeRemoved(screen.queryByText('Invisible Button'));  
})