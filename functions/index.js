const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
const process = require('node:process')
const cors = require('cors')({ origin: true, methods: ['GET', 'OPTIONS'] })

admin.initializeApp()

exports.countBooks = onRequest(
  { region: 'us-central1', maxInstances: 2, invoker: 'public' },
  (req, res) =>
    cors(req, res, async () => {
      res.set('Cache-Control', 'no-store')
      if (req.method !== 'GET') {
        res.set('Allow', 'GET, OPTIONS')
        return res.status(405).json({ error: 'Method not allowed' })
      }
      try {
        const databaseId = process.env.FIRESTORE_EMULATOR_HOST ? '(default)' : 'efolio'
        const snapshot = await getFirestore(databaseId).collection('books').get()
        return res.status(200).json({ count: snapshot.size })
      } catch (error) {
        console.error('Error counting books:', error.message)
        return res.status(500).json({ error: 'Error counting books' })
      }
    })
)
