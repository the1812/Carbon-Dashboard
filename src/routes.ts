import { RouteConfig } from 'vue-router'
import Dashboard from './dashboard/Dashboard.vue'
import Review from './review/Review.vue'
import Shop from './shop/Shop.vue'
import Account from './account/Account.vue'

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
    path: '/',
    redirect: '/account',
  }
]