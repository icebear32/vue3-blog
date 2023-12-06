<script setup>
import { AdminStore } from '../../stores/UserStore'

const adminStore = AdminStore()
</script>

<template>
    <div>
        dashboard
        {{ adminStore }}
    </div>
</template>

<style lang="scss" scoped></style>