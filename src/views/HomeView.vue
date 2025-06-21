<template>
  <div class="main-container">
    <section v-if="hotelLoaded" class="hotel-info card-section">
      <img class="hotel-main-img" :src="hotel?.mainImageUrl || defaultImage" alt="Hotel Main" />
      <div class="hotel-details">
        <h1>{{ hotel?.name }}</h1>
        <p>{{ hotel?.address }}</p>
        <div class="star-rating">
          <span v-for="n in hotel?.starRating || 0" :key="n">★</span>
        </div>
      </div>
    </section>
    <section v-else class="hotel-info card-section">
      <div>Loading hotel info...</div>
    </section>
    <section class="room-search-form card-section">
      <h2>Find Your Room</h2>
      <form @submit.prevent="onFindRooms">
        <div class="form-row">
          <label
            >Adults
            <input type="number" v-model.number="adults" min="1" max="10" required />
          </label>
          <label
            >Kids
            <input type="number" v-model.number="kids" min="0" max="10" required />
          </label>
          <label
            >Rooms
            <input type="number" v-model.number="rooms" min="1" max="5" required />
          </label>
        </div>
        <div class="form-row">
          <label
            >Check-in
            <input type="date" v-model="checkIn" required />
          </label>
          <label
            >Check-out
            <input type="date" v-model="checkOut" required />
          </label>
        </div>
        <button type="submit">Find Rooms</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const adults = ref(2)
const kids = ref(0)
const rooms = ref(1)
const checkIn = ref('')
const checkOut = ref('')

onMounted(() => {
  if (route.query.adults) adults.value = Number(route.query.adults)
  if (route.query.kids) kids.value = Number(route.query.kids)
  if (route.query.rooms) rooms.value = Number(route.query.rooms)
  if (route.query.checkIn) checkIn.value = String(route.query.checkIn)
  if (route.query.checkOut) checkOut.value = String(route.query.checkOut)
})

const hotel = ref<any>(null)
const hotelLoaded = ref(false)
const defaultImage =
  'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

async function fetchHotelInfo() {
  try {
    const res = await fetch(`${API_BASE_URL}/Hotel/info`)
    if (res.ok) {
      hotel.value = await res.json()
    }
  } catch (e) {
    // handle error
  } finally {
    hotelLoaded.value = true
  }
}

onMounted(fetchHotelInfo)

function onFindRooms() {
  router.push({
    name: 'Rooms',
    query: {
      adults: adults.value,
      kids: kids.value,
      rooms: rooms.value,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
    },
  })
}
</script>

<style scoped>
.main-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.card-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  padding: 2rem;
}
.hotel-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.hotel-main-img {
  width: 400px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.hotel-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hotel-details h1 {
  margin: 0;
}
.star-rating {
  color: #f5b301;
  font-size: 1.5rem;
}
.room-search-form h2 {
  margin-top: 0;
}
.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
input[type='number'],
input[type='date'] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 0.3rem;
  margin-bottom: 0.5rem;
}
button {
  background: #0078d4;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
button:hover {
  background: #005fa3;
}
</style>
