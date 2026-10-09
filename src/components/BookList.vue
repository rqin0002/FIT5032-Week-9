<template>
  <section class="mt-5" aria-labelledby="book-list-heading">
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <h2 id="book-list-heading" class="h3 mb-0">Books with ISBN &gt; 1000</h2>
      <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="loading || saving" @click="fetchBooks">Refresh</button>
    </div>
    <p v-if="loading" role="status">Loading books...</p>
    <p v-if="error" class="text-danger" role="alert">{{ error }}</p>
    <p v-if="!loading && !error && books.length === 0" class="text-muted">No books with ISBN greater than 1000.</p>
    <ul v-if="books.length" class="list-group">
      <li v-for="book in books" :key="book.id" class="list-group-item d-flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="book-name">{{ book.name }} (ISBN: {{ book.isbn }})</span>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-primary" :disabled="saving" @click="enableEdit(book)">Edit</button>
          <button type="button" class="btn btn-sm btn-outline-danger" :disabled="saving" @click="removeBook(book.id)">Delete</button>
        </div>
      </li>
    </ul>
    <form v-if="editingBook" class="border rounded p-3 mt-3" @submit.prevent="saveEdit">
      <h3 class="h5">Edit Book</h3>
      <div class="mb-3">
        <label for="edit-isbn" class="form-label">ISBN</label>
        <input id="edit-isbn" v-model.number="editIsbn" type="number" min="1" step="1" max="9007199254740991" class="form-control" :disabled="saving" required />
      </div>
      <div class="mb-3">
        <label for="edit-name" class="form-label">Name</label>
        <input id="edit-name" v-model="editName" type="text" maxlength="200" class="form-control" :disabled="saving" required />
      </div>
      <button type="submit" class="btn btn-primary me-2" :disabled="saving">Save</button>
      <button type="button" class="btn btn-secondary" :disabled="saving" @click="editingBook = null">Cancel</button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/init.js'
import { validateBook, bookError } from '../utils/books.js'

const books = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const editingBook = ref(null)
const editIsbn = ref('')
const editName = ref('')

const fetchBooks = async () => {
  loading.value = true
  error.value = ''
  try {
    const q = query(collection(db, 'books'), where('isbn', '>', 1000), orderBy('isbn'))
    const snapshot = await getDocs(q)
    books.value = snapshot.docs.map((book) => ({ ...book.data(), id: book.id }))
  } catch (err) {
    books.value = []
    error.value = bookError(err, 'load books')
  } finally {
    loading.value = false
  }
}

const enableEdit = (book) => {
  editingBook.value = book
  editIsbn.value = book.isbn
  editName.value = book.name
  error.value = ''
}

const saveEdit = async () => {
  if (saving.value || !editingBook.value) return
  error.value = ''
  try {
    const book = validateBook(editIsbn.value, editName.value)
    saving.value = true
    await updateDoc(doc(db, 'books', editingBook.value.id), book)
    editingBook.value = null
    await fetchBooks()
  } catch (err) {
    error.value = bookError(err, 'update the book')
  } finally {
    saving.value = false
  }
}

const removeBook = async (id) => {
  if (saving.value) return
  saving.value = true
  error.value = ''
  try {
    await deleteDoc(doc(db, 'books', id))
    if (editingBook.value?.id === id) editingBook.value = null
    await fetchBooks()
  } catch (err) {
    error.value = bookError(err, 'delete the book')
  } finally {
    saving.value = false
  }
}

onMounted(fetchBooks)
</script>

<style scoped>
.book-name { overflow-wrap: anywhere; }
</style>
