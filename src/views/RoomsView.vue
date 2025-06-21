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
      <button
        class="proceed-btn"
        :disabled="!canProceed"
        @click="proceedToBooking"
        style="margin-top:1rem;"
      >
        Proceed to Booking
      </button>
      <div v-if="selectionError" style="color:red; font-size:0.95rem; margin-top:0.5rem;">{{ selectionError }}</div>
    </header>
    <section v-if="error" class="card-section" style="color: red">{{ error }}</section>
    <section v-if="loading" class="card-section">Loading available rooms...</section>
    <section v-else class="room-listings-grid">
      <div v-if="roomTypes.length === 0 && !loading && !error" class="card-section">
        No rooms available for the selected dates.
      </div>
      <RoomCard
        v-for="room in roomTypes"
        :key="room.id"
        :room="room"
        :selected="selectedRoomIds.includes(room.id)"
        @select="onSelectRoom"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RoomCard from '../components/RoomCard.vue'

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

const selectedRoomIds = ref<string[]>([])
const selectionError = ref('')

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
      // Reset selection on new search
      selectedRoomIds.value = []
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

function onSelectRoom({ roomId }: { roomId: string }) {
  const idx = selectedRoomIds.value.indexOf(roomId)
  if (idx !== -1) {
    // Deselect
    selectedRoomIds.value = selectedRoomIds.value.filter(id => id !== roomId)
    selectionError.value = ''
  } else {
    if (selectedRoomIds.value.length >= rooms.value) {
      selectionError.value = `You can select up to ${rooms.value} room(s).`
      return
    }
    selectedRoomIds.value = [...selectedRoomIds.value, roomId]
    selectionError.value = ''
  }
}

const canProceed = computed(() => selectedRoomIds.value.length === rooms.value)

function proceedToBooking() {
  if (!canProceed.value) {
    selectionError.value = `Please select exactly ${rooms.value} room(s).`
    return
  }
  // Only send room IDs
  router.push({
    name: 'Booking',
    query: {
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      adults: adults.value,
      kids: kids.value,
      rooms: rooms.value,
      selectedRooms: JSON.stringify(selectedRoomIds.value),
    },
  })
}

function changeDates() {
  router.push({
    name: 'home',
    query: {
      adults: adults.value,
      kids: kids.value,
      rooms: rooms.value,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
    },
  })
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
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 0.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  padding: 0.5rem;
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
.room-listings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
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
  width: 100%;
  font-size: 0.95rem;
  padding: 0.6rem 0;
}
.room-img {
  height: 120px;
}
.proceed-btn {
  background: #0078d4;
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
}
.proceed-btn:disabled {
  background: #ccc;
  color: #888;
  cursor: not-allowed;
}

@media (min-width: 400px) {
  .main-container {
    gap: 1rem;
    padding: 0 0.2rem;
  }
  .card-section {
    padding: 1rem;
    border-radius: 8px;
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
    font-size: 1rem;
    padding: 0.7rem 0;
  }
}

@media (min-width: 600px) {
  .main-container {
    gap: 2rem;
    padding: 0 0.5rem;
  }
  .card-section {
    padding: 2rem;
    border-radius: 12px;
  }
  .room-listings-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 900px) {
  .main-container {
    padding: 0 1rem;
  }
}

@media (min-width: 1024px) {
  .room-listings-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
