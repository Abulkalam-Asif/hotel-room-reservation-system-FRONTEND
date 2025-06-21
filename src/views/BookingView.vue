<template>
  <div class="main-container booking-layout">
    <div class="form-section card-section">
      <h2>Booking Details</h2>
      <form @submit.prevent="confirmBooking">
        <div class="form-group">
          <label>Guest Name</label>
          <div class="row">
            <input v-model="guestFirstName" placeholder="First Name" required />
            <input v-model="guestLastName" placeholder="Last Name" required />
          </div>
        </div>
        <div class="form-group">
          <label>Check-in</label>
          <input v-model="checkIn" disabled />
        </div>
        <div class="form-group">
          <label>Check-out</label>
          <input v-model="checkOut" disabled />
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" required />
          <div style="font-size: 0.95em; color: #555; margin-top: 0.2em">
            Confirmation of reservation will be sent to this email address.
          </div>
        </div>
        <div class="form-group">
          <label>Mobile Phone Number</label>
          <input v-model="phone" placeholder="+1 234 567 8900" required />
        </div>
        <div class="form-group">
          <label>Billing Address</label>
          <input v-model="country" placeholder="Country" required />
          <input v-model="street" placeholder="Street" required />
          <input v-model="city" placeholder="City" required />
          <input v-model="postalCode" placeholder="Postal Code" required />
        </div>
        <div class="form-group">
          <label>Payment Details</label>
          <div class="row">
            <input v-model="cardFirstName" placeholder="First Name on Card" required />
            <input v-model="cardLastName" placeholder="Last Name on Card" required />
          </div>
          <input v-model="cardNumber" placeholder="Credit Card Number" required />
          <select v-model="cardType" required>
            <option disabled value="">Card Type</option>
            <option>American Express</option>
            <option>MasterCard</option>
            <option>Visa</option>
          </select>
          <div class="row">
            <input v-model="cardExpMonth" placeholder="MM" maxlength="2" required />
            <input v-model="cardExpYear" placeholder="YYYY" maxlength="4" required />
          </div>
        </div>
        <div class="important-note">
          This rate is non-refundable and cannot be changed or canceled.
        </div>
        <button type="submit" :disabled="bookingLoading">
          <span
            v-if="bookingLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Confirm Your Booking
        </button>
      </form>
      <div v-if="bookingResult" class="booking-result" style="margin-top: 1rem; color: green">
        <div>{{ bookingResult.Message }}</div>
        <div v-if="bookingResult.ReservationNumber">
          Reservation #: {{ bookingResult.ReservationNumber }}
        </div>
      </div>
      <div v-if="bookingError" class="booking-error" style="margin-top: 1rem; color: red">
        {{ bookingError }}
      </div>
      <div class="support">Need assistance? Tel. ****1234****</div>
    </div>
    <div class="summary-section card-section">
      <h3 class="summary-title">YOUR BOOKING SUMMARY</h3>
      <div class="summary-row">
        <span>Check-in</span>
        <span class="summary-value">{{ checkIn }}</span>
      </div>
      <div class="summary-row">
        <span>Check-out</span>
        <span class="summary-value">{{ checkOut }}</span>
      </div>
      <div class="summary-row" v-for="(room, idx) in selectedRooms" :key="room.id">
        <span>Room {{ idx + 1 }} Category</span>
        <span class="summary-value">{{
          room.title ? room.title.replace(/^Room \d+ - /, '') : 'Room'
        }}</span>
      </div>
      <div class="summary-row">
        <span>Total number of adults</span>
        <span class="summary-value">{{ adults }}</span>
      </div>
      <div class="summary-row rates-row">
        <span>Avg. nightly rate:</span>
        <span class="summary-value">
          €{{
            selectedRooms.length > 0
              ? (
                  selectedRooms.reduce((sum, r) => sum + (r.price || 0), 0) / selectedRooms.length
                ).toFixed(2)
              : '0.00'
          }}
        </span>
      </div>
      <div class="summary-row">
        <span>Total charge of the stay</span>
        <span class="summary-value"
          >€{{ selectedRooms.reduce((sum, r) => sum + (r.price || 0), 0).toFixed(2) }}</span
        >
      </div>
      <div style="font-size: 0.98em; color: #555; margin-top: 0.2em">
        This is the amount that will be charged to your credit card.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Room {
  id: string
  title?: string
  price?: number
  imageUrl?: string
}

const route = useRoute()
const checkIn = ref(route.query.checkIn || '')
const checkOut = ref(route.query.checkOut || '')
const adults = ref(route.query.adults || 2)
const selectedRoomIds = ref<string[]>([])
const selectedRooms = ref<Room[]>([])
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

try {
  if (route.query.selectedRooms) {
    // Ensure IDs are integers
    const parsed = JSON.parse(route.query.selectedRooms as string)
    selectedRoomIds.value = Array.isArray(parsed) ? parsed.map((id) => id.toString()) : []
  }
} catch {}

onMounted(async () => {
  if (selectedRoomIds.value.length > 0) {
    // Fetch room details for all selected room IDs
    const params = new URLSearchParams()
    selectedRoomIds.value.forEach((id) => params.append('ids', id.toString()))
    const res = await fetch(`${API_BASE_URL}/Room/details?${params}`)
    if (res.ok) {
      selectedRooms.value = await res.json()
    } else {
      // fallback: just show IDs
      selectedRooms.value = selectedRoomIds.value.map((id) => ({ id }))
    }
  }
})

const guestFirstName = ref('')
const guestLastName = ref('')
const email = ref('')
const phone = ref('')
const country = ref('')
const street = ref('')
const city = ref('')
const postalCode = ref('')
const cardFirstName = ref('')
const cardLastName = ref('')
const cardNumber = ref('')
const cardType = ref('')
const cardExpMonth = ref('')
const cardExpYear = ref('')

const bookingResult = ref<{ ReservationNumber?: string; Message?: string } | null>(null)
const bookingLoading = ref(false)
const bookingError = ref('')

async function confirmBooking() {
  bookingLoading.value = true
  bookingError.value = ''
  bookingResult.value = null
  try {
    // Prepare payload for all selected rooms
    const payload = {
      RoomIds: selectedRooms.value.map((room) => parseInt(room.id)),
      GuestFirstName: guestFirstName.value,
      GuestLastName: guestLastName.value,
      Email: email.value,
      Phone: phone.value,
      Country: country.value,
      Street: street.value,
      City: city.value,
      PostalCode: postalCode.value,
      CardFirstName: cardFirstName.value,
      CardLastName: cardLastName.value,
      CardNumber: cardNumber.value,
      CardType: cardType.value,
      CardExpMonth: cardExpMonth.value,
      CardExpYear: cardExpYear.value,
      CheckIn: checkIn.value,
      CheckOut: checkOut.value,
      Adults: adults.value,
      Kids: 0,
      Rooms: selectedRooms.value.length,
      NightlyRate: selectedRooms.value[0]?.price || 0, // Use first room's price for now
      TotalCharge: selectedRooms.value.reduce((sum, r) => sum + (r.price || 0), 0),
      IsPaid: false,
    }
    const res = await fetch(`${API_BASE_URL}/Booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      bookingResult.value = await res.json()
      alert(bookingResult.value?.Message || 'Booking successful!')
      window.location.href = '/'
      return
    } else {
      bookingError.value = 'Booking failed. Please try again.'
      alert(bookingError.value)
    }
  } catch (e) {
    bookingError.value = 'Booking failed. Please try again.'
    alert(bookingError.value)
  } finally {
    bookingLoading.value = false
  }
}

// const formattedCheckIn = computed(() => formatDate(checkIn.value))
// const formattedCheckOut = computed(() => formatDate(checkOut.value))
</script>

<style scoped>
.main-container.booking-layout {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  gap: 2rem;
}
.card-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  padding: 2rem;
}
.form-section {
  flex: 2;
}
.summary-section {
  flex: 1;
  height: fit-content;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  z-index: 2;
}
.form-group {
  margin-bottom: 1.2rem;
}
.row {
  display: flex;
  gap: 1rem;
}
input,
select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
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
  margin-top: 1rem;
}
button:hover {
  background: #005fa3;
}
.important-note {
  background: #fff3cd;
  color: #856404;
  padding: 0.7rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
.support {
  margin-top: 2rem;
  color: #0078d4;
  font-weight: bold;
}
.summary-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: 0.02em;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.7rem;
  font-size: 1rem;
}
.summary-value {
  font-weight: 600;
  text-align: right;
}
.rates-row {
  align-items: flex-start;
}
.rate-detail {
  font-weight: 400;
  font-size: 0.98rem;
  margin-left: 0.5rem;
  line-height: 1.3;
}
.error-message {
  color: #dc3545;
  margin-top: 1rem;
}
.success-message {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
  padding: 0.7rem;
  border-radius: 4px;
  margin-top: 1rem;
}
</style>
