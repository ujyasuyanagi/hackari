import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import AuthView from '@/views/AuthView.vue'
import HackathonsView from '@/views/HackathonsView.vue'
import HackathonDetailView from '@/views/HackathonDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RatingsView from '@/views/RatingsView.vue'
import OrganizersView from '@/views/OrganizersView.vue'
import OrganizerDashboardView from '@/views/OrganizerDashboardView.vue'
import OrganizerProfileView from '@/views/OrganizerProfileView.vue'
import HackathonCreateView from '@/views/HackathonCreateView.vue'
import OrganizerTermsAcceptance from '@/components/OrganizerTermsAcceptance.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import EmailVerificationView from '@/views/EmailVerificationView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/hackathons',
      name: 'hackathons',
      component: HackathonsView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: RatingsView,
    },
    {
      path: '/organizers',
      name: 'organizers',
      component: OrganizersView,
    },
    {
      path: '/organizers/rules',
      name: 'organizer-terms',
      component: OrganizerTermsAcceptance,
    },
    {
      path: '/organizers/dashboard',
      name: 'organizer-dashboard',
      component: OrganizerDashboardView,
    },
    {
      path: '/organizers/profile',
      name: 'organizer-profile',
      component: OrganizerProfileView,
    },
    {
      path: '/hackathons/create',
      name: 'hackathon-create',
      component: HackathonCreateView,
    },
    {
      path: '/hackathons/:id',
      name: 'hackathon-detail',
      component: HackathonDetailView,
      props: true,
    },
    {
      path: '/login',
      redirect: '/auth',
    },
    {
      path: '/register',
      redirect: '/auth',
    },
    {
      path: '/auth/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/auth/verify-email',
      name: 'verify-email',
      component: EmailVerificationView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
