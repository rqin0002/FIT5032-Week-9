export const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true'
export const emulatorProjectId = 'demo-fit5032-week9'
export const firebaseProjectId = 'fit5032-7b50f'
export const firestoreDatabaseId = useEmulators ? '(default)' : 'efolio'
export const countBooksUrl = useEmulators
  ? `http://127.0.0.1:5001/${emulatorProjectId}/us-central1/countBooks`
  : import.meta.env.VITE_COUNT_BOOKS_URL?.trim() || ''
