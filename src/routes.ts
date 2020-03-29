import { RouteConfig } from 'vue-router'
import Dashboard from './dashboard/Dashboard.vue'
import Review from './review/Review.vue'
import Shop from './shop/Shop.vue'
import Star from './star/Star.vue'
import Account from './account/Account.vue'
import { store } from './store'

export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/review',
    component: Review,
  },
  {
    path: '/account',
    component: Account,
  },
  {
    path: '/shop',
    component: Shop,
  },
  {
    path: '/star',
    component: Star,
  },
  {
    path: '/',
    redirect() {
      if (store.state.account.isLogin) {
        return '/dashboard'
      }
      return '/account'
    },
  }
]