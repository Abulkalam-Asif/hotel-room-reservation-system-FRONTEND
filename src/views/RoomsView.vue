<template>
  <div class="main-container">
    <header class="trip-summary card-section">
      <h2>Rooms & Rates</h2>
      <div class="trip-summary-line">
        Trip summary:
        <span>{{ formattedCheckIn }} - {{ formattedCheckOut }}</span>
      </div>
      <div class="change-dates-row">
        <button class="change-dates-btn" @click="changeDates">Change dates</button>
      </div>
      <div class="summary-details">
        <span>Rooms: {{ rooms }}</span> | <span>Adults: {{ adults }}</span> |
        <span>Kids: {{ kids }}</span>
      </div>
    </header>
    <section v-if="error" class="card-section" style="color: red">{{ error }}</section>
    <section v-if="loading" class="card-section">Loading available rooms...</section>
    <section v-else class="room-listings">
      <div v-if="roomTypes.length === 0 && !loading && !error" class="card-section">
        No rooms available for the selected dates.
      </div>
      <div v-for="room in roomTypes" :key="room.id" class="room-card card-section">
        <img :src="room.imageUrl || room.image" :alt="room.title" class="room-img" />
        <div class="room-info">
          <h3>{{ room.title }}</h3>
          <p class="room-price">Price: {{ room.price }} €</p>
          <button @click="bookNow(room)">Book Now</button>
          <details v-if="room.amenities">
            <summary>Amenities</summary>
            <ul class="amenities-list">
              <li v-for="amenity in room.amenities" :key="amenity">{{ amenity }}</li>
            </ul>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const checkIn = ref(String(route.query.checkIn || ''))
const checkOut = ref(String(route.query.checkOut || ''))
const rooms = ref(Number(route.query.rooms || 1))
const adults = ref(Number(route.query.adults || 2))
const kids = ref(Number(route.query.kids || 0))

const roomTypes = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function isValidSearch() {
  return (
    checkIn.value &&
    checkOut.value &&
    new Date(checkIn.value) < new Date(checkOut.value) &&
    rooms.value > 0 &&
    adults.value > 0 &&
    kids.value >= 0
  )
}

async function fetchAvailableRooms() {
  if (!isValidSearch()) {
    error.value = 'Please enter valid search criteria.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams({
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      rooms: String(rooms.value),
      adults: String(adults.value),
      kids: String(kids.value),
    })
    const res = await fetch(`${API_BASE_URL}/Room/available?${params}`)
    if (res.ok) {
      roomTypes.value = await res.json()
    } else {
      error.value = 'Failed to fetch available rooms.'
    }
  } catch (e) {
    error.value = 'Network error.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAvailableRooms)

function bookNow(room: any) {
  router.push({
    name: 'Booking',
    query: {
      roomId: room.id,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      adults: adults.value,
      kids: kids.value,
      rooms: rooms.value,
    },
  })
}

function changeDates() {
  router.push({ name: 'home' })
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    weekday: 'short',
  })
}
const formattedCheckIn = computed(() => formatDate(checkIn.value))
const formattedCheckOut = computed(() => formatDate(checkOut.value))
</script>

<style scoped>
.main-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
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
.trip-summary {
  background: #f1f1f1;
  border: none;
  box-shadow: none;
  margin-bottom: 0;
}
.trip-summary-line {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.change-dates-row {
  margin-bottom: 0.5rem;
}
.change-dates-btn {
  background: none;
  color: #0078d4;
  border: 1px solid #0078d4;
  border-radius: 4px;
  padding: 0.3rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.change-dates-btn:hover {
  background: #0078d4;
  color: #fff;
}
.summary-details {
  color: #555;
  font-size: 0.98rem;
  margin-bottom: 0.5rem;
}
.room-listings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.room-card {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 0;
}
.room-img {
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}
.room-info {
  flex: 1;
}
.room-price {
  font-weight: bold;
  margin: 0.5rem 0;
}
button {
  background: #0078d4;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
button:hover {
  background: #005fa3;
}
details {
  margin-top: 1rem;
}
.amenities-list {
  list-style: disc inside;
  margin: 0.5rem 0 0 1rem;
  padding: 0;
}

@media (max-width: 900px) {
  .main-container {
    padding: 0 0.5rem;
  }
  .room-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .room-img {
    width: 100%;
    height: 180px;
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .main-container {
    padding: 0 0.2rem;
    gap: 1rem;
  }
  .card-section {
    padding: 1rem;
  }
  .trip-summary h2 {
    font-size: 1.1rem;
  }
  .room-info h3 {
    font-size: 1rem;
  }
  .room-price {
    font-size: 0.95rem;
  }
  button {
    width: 100%;
    font-size: 1rem;
    padding: 0.7rem 0;
  }
}

@media (max-width: 400px) {
  .main-container {
    padding: 0 0.1rem;
    gap: 0.5rem;
  }
  .card-section {
    padding: 0.5rem;
    border-radius: 8px;
  }
  .trip-summary h2 {
    font-size: 1rem;
  }
  .room-info h3 {
    font-size: 0.95rem;
  }
  .room-price {
    font-size: 0.9rem;
  }
  button {
    font-size: 0.95rem;
    padding: 0.6rem 0;
  }
  .room-img {
    height: 120px;
  }
}
</style>
