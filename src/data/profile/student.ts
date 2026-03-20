import {
  LucideCalendar,
  LucideMail,
  LucideMapPin,
  LucidePhone,
} from 'lucide-react'
import { LuAward } from 'react-icons/lu'

import type { ProfileData } from './types'

export const studentProfile: ProfileData = {
  eyebrow: 'My Profile',
  subtitle: 'Manage your personal information and progress',
  avatar: {
    name: 'Alex Johnson',
    subtitle: 'Student ID: STU-2024 0042',
    buttonLabel: 'Edit Profile',
    avatarLabel: 'AJ',
  },
  contacts: [
    { icon: LucideMail, label: 'Email', value: 'alex.johnson@email.com' },
    { icon: LucidePhone, label: 'Phone', value: '(555) 123-4567' },
    { icon: LucideMapPin, label: 'Location', value: 'Jeffersonville, OH' },
    {
      icon: LucideCalendar,
      label: 'Enrollment Date',
      value: 'Jan 5, 2026',
    },
  ],
  cohortInfoTitle: 'Cohort Information',
  cohortInfo: [
    { title: 'Cohort', subtitle: 'Full Stack Development 2024-Q1' },
    { title: 'Start Date', subtitle: 'January 5, 2026' },
    { title: 'Expected Completion', subtitle: 'April 30, 2026' },
  ],
  metricsTitle: 'Progress Summary',
  metrics: [
    { title: 'Grade', value: '98%', color: '#7C86FF', icon: LuAward },
    { title: 'Progress', value: '85%', color: '#C179FE', icon: LuAward },
    { title: 'Completed', value: '50', color: '#00D3F3', icon: LuAward },
    { title: 'Badges', value: '5', color: '#05DB70', icon: LuAward },
  ],
  skills: ['Javascript', 'React', 'Typescript', 'Java', 'SpringBoot', 'MySQL'],
}
