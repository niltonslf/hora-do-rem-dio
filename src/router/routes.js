
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/HomeScreen.vue'),
        meta: {
          title: 'Meus lembretes',
          subtitle: ''
        }
      },
      {
        path: 'set-reminder',
        name: 'set-reminder',
        component: () => import('pages/SetReminderScreen.vue'),
        meta: {
          title: 'Criar lembrete',
          subtitle: ''
        }
      },
      {
        path: 'developer',
        name: 'developer',
        component: () => import('pages/DeveloperScreen.vue'),
        meta: {
          title: 'Informações',
          subtitle: ''
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
