<template>
  <table class="table-gbifference">
    <thead>
      <tr>
        <th>Term</th>
        <th v-if="occurrences.inSync">
          Source / original
        </th>
        <th 
          v-for="header in headers"
          :key="header"
        > 
          {{ header }}
        </th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="(list, term) in occurrences.dwcRecords"
        :key="term"
      >
        <td>{{ term }}</td>
        <template
          v-for="(value, column) in list"
          :key="column"
        >
          <td
            v-if="column !== OccurrenceRecord.Original || !occurrences.inSync"
            @click="emit('cell:click', { 
              event: $event,
              term,
              value,
              row: list
            })"
          >
            {{ value }}
          </td>
        </template>
        <td>{{ occurrences.remarks[term] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef } from 'vue'
import { ITable, ISource } from '@/interfaces'
import GBifference from '@/gbifference'

interface Props {
  occurrenceId?: string
  datasetKey?: string
  source: ISource
}

enum OccurrenceRecord {
  Original = 'original',
  Interpreted = 'interpreted',
  Source = 'source'
}

const props = defineProps<Props>()
const instance = new GBifference(props)
const occurrences = ref<ITable>({
  dwcRecords: {},
  headers: [],
  inSync: false,
  remarks: {}
})

const headers: ComputedRef<string[]> = computed(() => {
  return occurrences.value.inSync
    ? occurrences.value.headers.filter(header => header !== OccurrenceRecord.Original && header !== OccurrenceRecord.Source)
    : occurrences.value.headers
})

const emit = defineEmits(['cell:click'])

instance.on('complete', (e: ITable) => occurrences.value = e)
</script>