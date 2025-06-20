<template>
  <div class="main-container booking-layout">
    <div class="form-section card-section">
      <h2>Booking Details</h2>
      <form @submit.prevent="confirmBooking">
        <div class="form-group">
          <label>Room 1 Guest Name</label>
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
        <button type="submit">Confirm Your Booking</button>
      </form>
      <div class="support">Need assistance? Tel. ****1234****</div>
    </div>
    <div class="summary-section card-section">
      <h3 class="summary-title">YOUR BOOKING SUMMARY</h3>
      <div class="summary-row">
        <span>Check-in</span>
        <!-- <span class="summary-value">{{ formattedCheckIn }}</span> -->
      </div>
      <div class="summary-row">
        <span>Check-out</span>
        <!-- <span class="summary-value">{{ formattedCheckOut }}</span> -->
      </div>
      <!-- <div class="summary-row">
        <span>Rooms</span>
        <span class="summary-value">{{ rooms }}</span>
      </div> -->
      <div class="summary-row">
        <span>Room 1 guests</span>
        <span class="summary-value">{{ adults }} Adult</span>
      </div>
      <div class="summary-row rates-row">
        <span>Avg. nightly rates:</span>
        <div class="summary-value rate-detail">
          Room 1:<br />
          <!-- ${{ nightlyRate.toFixed(2) }} - {{ formattedCheckIn }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const checkIn = ref(route.query.checkIn || '')
const checkOut = ref(route.query.checkOut || '')
const adults = ref(route.query.adults || 2)

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

function confirmBooking() {
  // Simulate confirmation and email sending
  alert('Booking confirmed! Confirmation email sent. Reservation #: 123456')
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
</style>
