import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import OtpForm from '../OtpForm'
import setupUserEvent from '@/lib/utils/testing/setupUserEvent'

const MockLinkProvider = ({ children }: { children: React.ReactNode }) => (
  <a href="/">{children}</a>
)

describe('OtpForm', () => {
  describe('Rendering', () => {
    it('should render the card title', () => {
      render(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      expect(screen.getByText('Verify OTP')).toBeInTheDocument()
    })
    it('should render the OTP input label', () => {
      render(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      expect(screen.getByText('One-Time Password')).toBeInTheDocument()
    })
    it('should render 6 OTP input slots', () => {
      render(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpSlots = screen.getAllByRole('textbox')
      expect(otpSlots).toHaveLength(1)
    })
    it('should render the submit button', () => {
      render(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      expect(
        screen.getByRole('button', {
          name: /enter the 6-digit code|submit/i,
        }),
      ).toBeInTheDocument()
    })
    it('should render the back link', () => {
      render(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      expect(screen.getByText('Back')).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('should show error when submitted with less than 6 digits', async () => {
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpInput = screen.getAllByRole('textbox')[0]
      await user.type(otpInput, '123')
      await user.click(screen.getByRole('button', { name: /submit/i }))
      await waitFor(() => {
        expect(
          screen.getByText('Please enter all 6 digits'),
        ).toBeInTheDocument()
      })
    })
    it('should show error when submitted with empty OTP', async () => {
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      const button = screen.getByRole('button', {
        name: /enter the 6-digit code|submit/i,
      })
      await user.click(button)
      await waitFor(() => {
        expect(
          screen.getByText('Please enter all 6 digits'),
        ).toBeInTheDocument()
      })
    })
    it('should accept valid 6-digit numeric OTP', async () => {
      const onSubmit = vi.fn()
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={onSubmit}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpInput = screen.getAllByRole('textbox')[0]
      await user.type(otpInput, '123456')
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ otp: '123456' })
      })
    })
  })

  describe('User Interactions', () => {
    it('should allow user to type in OTP field', async () => {
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpInput = screen.getAllByRole('textbox')[0] as HTMLInputElement
      await user.type(otpInput, '123')
      expect(otpInput.value).toBe('123')
    })
    it('should auto-submit when all 6 digits are entered', async () => {
      const onSubmit = vi.fn()
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={onSubmit}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpInput = screen.getAllByRole('textbox')[0]
      await user.type(otpInput, '123456')
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })
    it('should not auto-submit with incomplete OTP', async () => {
      const onSubmit = vi.fn()
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={onSubmit}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpInput = screen.getAllByRole('textbox')[0]
      await user.type(otpInput, '123')
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('should call onSubmit with correct values when form is submitted', async () => {
      const onSubmit = vi.fn()
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={onSubmit}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpInput = screen.getAllByRole('textbox')[0]
      await user.type(otpInput, '987654')
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ otp: '987654' })
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria attributes when invalid', async () => {
      const { user } = setupUserEvent(
        <OtpForm
          title="Verify OTP"
          onSubmit={() => {}}
          linkProvider={MockLinkProvider}
        />,
      )
      const otpInput = screen.getAllByRole('textbox')[0]
      await user.type(otpInput, '12')
      await user.click(screen.getByRole('button', { name: /submit/i }))
      await waitFor(() => {
        const field = screen
          .getByText('Please enter all 6 digits')
          .closest('[data-invalid]')
        expect(field).toHaveAttribute('data-invalid', 'true')
      })
    })
  })
})
