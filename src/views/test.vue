<template lang="pug">
  div
    <validation-provider rules="secret" v-slot="{ errors }">
      <input v-model="email" type="text" />
      <span>{{ errors[0] }}</span>
    </validation-provider>
</template>

<script>
export default {
}
</script>
