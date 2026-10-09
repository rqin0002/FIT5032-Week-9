export function validateBook(isbn, name) {
  const value = String(isbn ?? '').trim()
  const number = Number(value)
  if (!value || !Number.isSafeInteger(number) || number <= 0) {
    throw new Error('ISBN must be a positive whole number within the safe integer range.')
  }
  const title = String(name ?? '').trim()
  if (!title || title.length > 200) {
    throw new Error('Book name must contain between 1 and 200 characters.')
  }
  return { isbn: number, name: title }
}

export function bookError(error, action) {
  if (error?.code === 'permission-denied') {
    return 'Permission denied. For cloud mode, sign in and check the Firestore books rules.'
  }
  if (error?.code === 'unavailable') {
    return 'Firestore is unavailable. Check that the local emulators are running.'
  }
  return error instanceof Error && !error.code
    ? error.message
    : `Unable to ${action}. Check your connection and Firestore configuration.`
}
