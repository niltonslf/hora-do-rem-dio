import Notifications from '../Notifications/index'

// Iniciar localstore
let db = window.localStorage // Veriicar se é necessário atruir o local storage aqui ou se deixo somente no construtor
// entidade para identificar que o localstorage já está inicializadp
db.setItem('db', true)

class Database {
  /**
     * Inicializar banco de dados
     */
  constructor () {
    // Verificar se o banco já existe
    if (!JSON.stringify(db.getItem('db'))) db = window.localStorage
  }
  /**
     * Retorna um array de todos os itens da entidade que
     * contém o nome igual ao argumento fornecido.
     * @param {*} entity Nome da entidade que deseja buscar
     * @returns {Array} Array de registros
     */
  findAll (entity) {
    const data = db.getItem(entity)
    if (data) return JSON.parse(data)
    return []
  }
  /**
   *
   * @param {*} entity Nome da entidade que deseja buscar
   * @param {*} key Indentificador do registro desejado
   */
  findOne (entity, key) {
    const data = db.getItem(entity)
    try {
      return JSON.parse(data.filter(item => item.id === key))
    } catch (e) {
      return []
    }
  }
  /**
   * Persiste dados da entidade fornecida
   * @param {String} entity Nome da entidade
   * @param {Object} data dado a ser armazenado
   */
  add (entity, data) {
    // Verifica se a entidade já existe criando-a caso não
    this.verifyAndCreateEntity(entity)

    // Busca os registros da entidade amarzenando numa variável
    let registers = JSON.parse(db.getItem(entity))

    // Adiciona um identificar no dado que está sendo cadastrado
    data.id = this.setKey(entity)

    // Adiciona o nome registro no array recebido
    registers.push(data)

    // Reescreve o valor da entidade
    db.setItem(entity, JSON.stringify(registers))

    // Chamar classe que define os alarmes
    if (Notifications.scheduleNotifications(data)) {
      console.log('Notificação agendada')
    }

    return true
  }
  /**
   * Deletar entidade que contém o nome igual ao do argumento fornecido.
   * @param {*} entity nome da entidade
   * @returns bollean
   */
  removeEntity (entity) {
    if (db.removeItem(entity)) return true
    return false
  }
  /**
 *
 * @param {String} entity
 * @param {number} id
 */
  removeItem (entity, id) {
    // Atribui a variável um array com os registros da entidade fornecida
    const result = this.findAll(entity)
    // Atribui a variável o id do registro a ser removido
    const itemToRemove = result.find((re, index) => {
      if (re.id === id) {
        // Não achei uma forma de retornar somente o index,
        // então atribuo o index no objeto para que eu possa saber qual elemento remover
        re.index = index
        return re
      }
    })
    // remove o item do array
    result.splice(itemToRemove.index, 1)

    // Parsear result em string e reescreve dados sem o item removido
    db.setItem(entity, JSON.stringify(result))

    // Remove as notificações deste registro
    Notifications.removeSchedule(id)
    return true
  }
  /**
   * Limpar todas as entidades da tabela
   */
  clearDatabase () {
    return db.clear()
  }
  /**
   * Verifica se a recebida existe, criando-a caso não exista
   * @param {String} entity
   */
  verifyAndCreateEntity (entity) {
    // caso entidade seja null, inicializa a entidade com um array vazio
    if (!db.getItem(entity)) db.setItem(entity, JSON.stringify([]))
  }

  /**
   * Retorna o id para o próximo dado a ser cadastrado no banco
   * @param {String} entity
   * @returns int
   */
  setKey (entity) {
    // Buca todos os itens da entidade fornecida
    const result = this.findAll(entity)

    // Se não for o primeiro item a ser registrado, retorna 0
    if (result.length === 0) return 1

    // Retorna maior id dos registos armazendando numa variável o id
    const biggerItem = result.reduce((prev, cur) => {
      if (prev.id > cur.id) return prev
      return cur
    })

    // Adiciona mais 1 no maior id encontrado
    // Este será o id no próximo registro
    return biggerItem.id + 1
  }
}

export default new Database()
