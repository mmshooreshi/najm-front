<!-- pages/admin/users.vue -->
<!-- pages/admin/users.vue -->
<script setup lang="ts">
import { usePocketBase } from '~/plugins/pb.client'
const pb = usePocketBase()

const users = await pb.collection('_superusers').getFullList({ sort: '-created' })
definePageMeta({ layout: 'admin' })
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Users</h1>
  <table class="w-full text-sm">
    <thead><tr><th>Email</th><th>Phone</th><th>Created</th></tr></thead>
    <tbody>
      <tr v-for="u in users" :key="u.id">
        <td>{{ u.email }}</td>
        <td dir="ltr">{{ u.phone }}</td>
        <td>{{ new Date(u.created).toLocaleDateString() }}</td>
      </tr>
    </tbody>
  </table>
</template>
