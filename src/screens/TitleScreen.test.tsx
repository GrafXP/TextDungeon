import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppStateProvider } from '../app/AppState'
import { TitleScreen } from './TitleScreen'

describe('Startansicht', () => {
  it('startet ein neues Abenteuer mit dem eingegebenen Namen', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppStateProvider>
          <TitleScreen />
        </AppStateProvider>
      </MemoryRouter>
    )

    const name = await screen.findByLabelText('Wie heisst du?')
    await user.type(name, 'Mira')
    await user.click(screen.getByRole('button', { name: 'Abenteuer starten' }))

    await waitFor(() => expect(screen.getByRole('link', { name: /Abenteuer fortsetzen/ })).toBeInTheDocument())
    expect(screen.getByText(/Mira · Sonnenwacht/)).toBeInTheDocument()
  })
})
