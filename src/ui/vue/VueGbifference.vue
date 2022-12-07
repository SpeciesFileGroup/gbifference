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
        v-for="term in occurrences.dwcTerms"
        :key="term"
      >
        <td>{{ term }}</td>
        <template
          v-for="(record, column) in occurrences.dwcRecords"
          :key="column"
        >
          <td
            v-if="column !== OccurrenceRecord.Original || !occurrences.inSync"
            @click="emit('cell:click', { 
              event: $event,
              term,
              record,
              dwcRecord: record,
              source: column
            })"
          >
            {{ record[term] }}
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
import gbifferenceFunc from '@/gbifferenceFunc'

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
const occurrences = ref<ITable>({
  dwcRecords: {},
  dwcTerms: [],
  inSync: false,
  remarks: {}
})

const headers: ComputedRef<string[]> = computed(() => {
  const { dwcRecords, inSync } = occurrences.value
  const keys = Object.keys(dwcRecords)

  return inSync
    ? keys.filter(header => header !== OccurrenceRecord.Original && header !== OccurrenceRecord.Source)
    : keys
})

const emit = defineEmits(['cell:click'])

gbifferenceFunc(props).then(data => {
  occurrences.value = data
})
</script>