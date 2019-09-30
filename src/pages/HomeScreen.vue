<template>
  <q-page class="home flex flex-row flex-start">
    <!-- Fab buttons -->
    <q-fab
      class="fixed"
      style="right: 18px; bottom: 18px"
      color="negative"
      icon="add"
      direction="up"
      >
        <q-fab-action size="lg" color="primary" @click="setNewAlarm" icon="alarm"/>
    </q-fab>

    <!-- Lista de lembretes -->
    <q-list v-if="this.reminders.length" class="reminders-list" >

      <transition-group name="fade">

        <q-item class="remiders-list__item"  v-for="(reminder,index) in reminders" :key="index">
          <q-item-side icon="alarm" inverted color="primary" />
          <q-item-main>
            <q-item-tile label>{{reminder.medicine}}</q-item-tile>
            <q-item-tile sublabel>{{reminder.numberOfDays}} dias restantes</q-item-tile>
            <q-item-tile sublabel>{{reminder.next}}</q-item-tile>
          </q-item-main>
          <q-item-side
            right
            icon="close"
            color="red"
            @click.native="deleteReminder(reminder.id, index)"
          />
        </q-item>
      </transition-group>
    </q-list>

    <div v-else class="alert-container">
      <q-alert color="tertiary" icon="info" appear class="q-mb-sm" >
        Você não tem nenhum medicamento para tomar.
      </q-alert>
    </div>
  </q-page>
</template>

<script>
import moment from 'moment'

import db from '../Services/Database/index.js'
import Notifications from '../Services/Notifications/index.js'

export default {
  name: 'index',
  data: () => ({
    reminders: []
  }),
  methods: {
    deleteReminder (id, index) {
      // verifica se o item foi deletado
      if (db.removeItem('reminders', id)) {
        // remove item da lista
        this.reminders.splice(index, 1)
      }
    },
    loadReminders () {
      // Carrega todos o lembretes
      const reminders = db.findAll('reminders')
      // faz um map buscando pelas notificações de cada lembrete
      reminders.forEach(reminder => {
        // Calcula a quantidade de dias restantes
        let initialDate = moment(reminders.firstReminder)
        let finalDate = moment(reminders.firstReminder).add(2, 'days')
        // Reescreve a variável com a diferença de dias entre a data de cadastrado e a de término
        reminder.numberOfDays = finalDate.diff(initialDate, 'days')

        // Buscar notificações do lembrete
        this.getNextNotification(reminder.id)
          .then(res => { reminder.next = res })
          .finally(() => { this.reminders.push(reminder) })
      })
    },
    getNextNotification (reminderID) {
      const nextNotification = Notifications.getNextNotification(reminderID)
      let response = nextNotification.then(next => {
        // fallback caso não seja encontrada nenhuma noticação
        if (!next) return 'Sem notificações'
        // Formata a data da próxima notificação
        const notificationDate = moment(next.trigger.at).format('DD/MM/YYYY hh:mm')
        // retona mensagem com a data da próxima notificação
        return `Próximo: ${notificationDate}`
      })
      return response
    },
    setNewAlarm () {
      this.$router.push({ name: 'set-reminder' })
    }
  },
  created () {
    this.loadReminders()
  }
}
</script>

<style scoped lang="stylus">
.home{
  background-image: linear-gradient(to top, #F5C1C7 20%, #F29979)
}
.reminders-list{
  padding: 15px;
  width: 100%;
  border 0;
}
.remiders-list__item{
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
  margin-bottom: 15px;
  width: 100%;
}

.fade-enter-active, .fade-leave-active {
  transform: translateX(0);
  transition: all ease-in-out 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(100%);
}

.alert-container{
  padding: 15px;
}

.title-sm{
  font-size: 18px;
  margin-bottom 0px;
}

</style>
