<template>
  <div :class="['room-card', 'card-section', { selected }]">
    <img :src="room.imageUrl || room.image" :alt="room.title" class="room-img" />
    <div class="room-info">
      <h3>{{ room.title }}</h3>
      <p class="room-price">Price: {{ room.price }} €</p>
      <div class="room-select-row">
        <button @click.prevent="toggleSelect" :class="{ active: selected }">
          {{ selected ? 'Deselect' : 'Select' }}
        </button>
      </div>
      <details v-if="room.amenities">
        <summary class="amenities-summary">Amenities</summary>
        <ul class="amenities-list">
          <li v-for="amenity in room.amenities" :key="amenity">{{ amenity }}</li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ room: any, selected?: boolean }>()
const emit = defineEmits(['select'])
function toggleSelect() {
  emit('select', { roomId: props.room.id })
}
</script>

<style scoped>
.room-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  height: 100%;
  border: 2px solid transparent;
  transition: border 0.2s;
}
.room-card.selected {
  border: 2px solid #0078d4;
  box-shadow: 0 0 0 2px #0078d433;
}
.room-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}
.room-info {
  flex: 1;
  width: 100%;
}
.room-price {
  font-weight: bold;
  margin: 0.5rem 0;
}
.room-select-row {
  margin: 0.5rem 0;
}
button.active, .room-card.selected button {
  background: #005fa3;
  color: #fff;
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
  width: 100%;
  transition: background 0.2s;
}
button:hover {
  background: #005fa3;
}
.amenities-summary {
  cursor: pointer;
  font-weight: bold;
  color: #0078d4;
  margin-bottom: 0.5rem;
}
.amenities-list {
  list-style: disc inside;
  margin: 0.5rem 0 0 1rem;
  padding: 0;
}
</style>
