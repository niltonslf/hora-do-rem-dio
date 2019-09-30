<template>
    <q-page class="set-reminder">
        <q-datetime-picker
          type="time" class="picker"
          v-model="reminder.firstReminder"
          @blur="$v.reminder.firstReminder.$touch"
          @keyup.enter="saveReminder"
          :error="$v.reminder.firstReminder.$error"
        />

        <q-field style="margin-bottom: 15px;">
            <q-input
              float-label="Nome do medicamento"
              v-model="reminder.medicine"
              @blur="$v.reminder.medicine.$touch"
              @keyup.enter="saveReminder"
              :error="$v.reminder.medicine.$error"
            />
        </q-field>

        <q-field>
            <q-select
              float-label="Quantidade de dias"
              radio
              v-model="reminder.numberOfDays"
              :options="generanteRange(31, 'Dias')"
              @blur="$v.reminder.numberOfDays.$touch"
              @keyup.enter="saveReminder"
              :error="$v.reminder.numberOfDays.$error"
            />
        </q-field>

        <q-field>
            <q-select
              float-label="Intervalo de horas"
              radio
              v-model="reminder.interval"
              :options="generanteRange(24, 'Horas')"
              @blur="$v.reminder.interval.$touch"
              @keyup.enter="saveReminder"
              :error="$v.reminder.interval.$error"
            />
        </q-field>

        <q-field class="set-reminder__save">
            <q-btn icon="check" size="lg" round label="Salvar" color="primary" @click="saveReminder" />
        </q-field>
    </q-page>
</template>

<script>
import db from '../Services/Database/index.js'
// eslint-disable-next-line no-unused-vars
import { Notify } from 'quasar'
// eslint-disable-next-line no-unused-vars
import { required } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    reminder: {
      medicine: '',
      numberOfDays: 0,
      interval: 0,
      firstReminder: new Date()
      // notifications: false,
      // alarms: false
    }
  }),
  validations: {
    reminder: {
      medicine: { required },
      numberOfDays: { required },
      interval: { required },
      firstReminder: { required }
    }
  },
  methods: {
    /**
     * Gera uma quantidade x de elementos de acordo com os parâmetros fornecidos
     * @param amount quantidade de itens a ser gerado
     * @param label Rótulo dos item
     */
    generanteRange (amount, label) {
      let response = []
      for (let i = 1; i <= amount; i++) {
        response.push({
          label: `${i} ${label}`,
          value: i
        })
      }
      return response
    },
    /**
     * Salva lembrete no localstorage
     */
    saveReminder () {
      this.$v.reminder.$touch()

      if (this.$v.reminder.$error) {
        this.$q.notify({
          message: 'Todos os capos são obrigatórios!',
          timeout: 1000,
          type: 'warning',
          color: 'negative',
          textColor: 'white',
          closeBtn: 'Fechar'
        })
        return
      }

      // Salva registro
      let isSaved = db.add('reminders', {
        medicine: this.reminder.medicine,
        numberOfDays: this.reminder.numberOfDays,
        interval: this.reminder.interval,
        firstReminder: this.reminder.firstReminder,
        notifications: this.reminder.notifications,
        alarms: this.reminder.alarms
      })

      if (isSaved) {
        // Exibir mensagem de sucesso!
        this.$q.notify({
          message: `Lembrete definido com sucesso!`,
          timeout: 1000,
          type: 'positive',
          color: 'negative',
          textColor: 'white',
          closeBtn: 'Fechar'
        })

        // Rediciona para a página inicial
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style>
.set-reminder{
    padding: 15px
}
.picker{
    margin: -15px -15px 0 -15px
}

.set-reminder__save{
text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
