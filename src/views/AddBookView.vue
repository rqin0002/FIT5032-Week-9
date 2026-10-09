
<template>
  <section class="container py-4 book-page">
    <h1>Add Book</h1>

    <form class="mt-4" @submit.prevent="addBook">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN</label>
        <input
          id="isbn"
          v-model.number="isbn"
          type="number"
          min="1"
          step="1"
          max="9007199254740991"
          class="form-control"
          :disabled="saving"
          required
        />
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          maxlength="200"
          class="form-control"
          :disabled="saving"
          required
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary"
        :disabled="saving"
      >
        {{ saving ? 'Saving...' : 'Add Book' }}
      </button>
    </form>

    <p v-if="success" class="text-success mt-3" role="status">
      {{ success }}
    </p>

    <p v-if="error" class="text-danger mt-3" role="alert">
      {{ error }}
    </p>

    <BookList :key="listVersion" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/init.js'
import BookList from '../components/BookList.vue'
import { validateBook, bookError } from '../utils/books.js'

const isbn = ref('')
const name = ref('')
const saving = ref(false)
const success = ref('')
const error = ref('')
const listVersion = ref(0)

const addBook = async () => {
  if (saving.value) return

  error.value = ''
  success.value = ''

  try {
    const book = validateBook(isbn.value, name.value)
    saving.value = true

    await addDoc(collection(db, 'books'), book)

    isbn.value = ''
    name.value = ''
    success.value = 'Book added successfully!'
    listVersion.value += 1
  } catch (err) {
    error.value = bookError(err, 'add the book')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.book-page {
  max-width: 760px;
}
</style>
