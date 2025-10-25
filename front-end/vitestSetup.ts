import '@testing-library/jest-dom/vitest'

//Mocking Radix Elements (I LOVE TESTING!!!!!!!)
window.HTMLElement.prototype.scrollIntoView = vi.fn() //https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
window.HTMLElement.prototype.hasPointerCapture = vi.fn() //https://github.com/testing-library/user-event/discussions/1087
