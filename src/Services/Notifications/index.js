import moment from 'moment'

class Notifications {
  constructor () {
    this.notifications = []
  }

  /**
   * Agenda todas as notificações para o lembrete
   * @param {Object} data
   */
  scheduleNotifications (data) {
    let key = 0
    let reminderTime = moment(data.firstReminder)
    // Dia que deve se encerrar as notificações
    let lastDay = moment(data.firstReminder).add(data.numberOfDays, 'days').format('DD/MM/YYYY')

    /**
     * O do while permite que o primeilo alarme seja definido
     * e logo a após o loop é realizado até que todos os alarmes sejam definidos
     */
    do {
      this.notifications.push(
        {
          id: `${data.id}${key}`, // 1[0,1,2,3] => 1 = id do lembrete. [0,1...] id da notificação
          title: 'Hora do remédio',
          text: `Tomar ${data.medicine}`,
          trigger: {
            at: new Date(reminderTime)
          }
        }
      )
      // Adiciona o intervalo de horas
      reminderTime.add(data.interval, 'hours')
      // incrementa a key
      key++
    } while (reminderTime.format('DD/MM/YYYY') !== lastDay)

    // Percorre o array de notifications agendando-os
    this.notifications.forEach(notification => {
      cordova.plugins.notification.local.schedule(notification)
    })

    return true
  }

  /**
   * Remove todas as noticações relacionadas ao do fornecido
   * @param {number} reminderID
   */
  removeSchedule (reminderID) {
    // Pattern da expressão
    let regex = new RegExp('^' + reminderID) // começar com o id do lembrete
    // Ler todas as notificações
    cordova.plugins.notification.local.getAll(notifications => {
      // Percorre o array de notificações
      notifications.forEach(notification => {
        // Verifica se o id da notificação começa com o id do lembrete
        if (notification.id.toString().match(regex)) {
          // remover notificação se a expressão retornar true
          cordova.plugins.notification.local.cancel(notification.id, () => {
            console.log('Notificação removida!')
          })
        }
      })
    })
  }
  /**
 * Encontra todas as notificações que são correspondentes ao id do lembrete
 * @param {*} reminderID
 */
  async getNotificationsFromReminder (reminderID) {
    // Pattern da expressão
    let regex = new RegExp('^' + reminderID) // começar com o id do lembrete
    var reminderNotifications = []

    const response = new Promise((resolve) => {
      cordova.plugins.notification.local.getAll(notifications => {
        setTimeout(() => {
          notifications.forEach(notification => {
            if (notification.id.toString().match(regex)) {
              reminderNotifications.push(notification)
            }
          })
          resolve(reminderNotifications)
        }, 500)
      })
    })
    return response
  }

  /**
   * Retorna o objeto próxima da notificação relacionada o id do lembrete fornecido
   * @param {*} reminderID
   */
  async getNextNotification (reminderID) {
    const response = await this.getNotificationsFromReminder(reminderID)
    if (response.length === 0) return false
    // retorna a notificações o menor id, ou seja, a próxima a ser disparada
    let next = response.reduce((prev, cur) => {
      if (prev.id < cur.id) return prev
      return cur
    })
    return next
  }
}
export default new Notifications()
