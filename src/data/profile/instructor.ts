import {
  LucideCalendar,
  LucideMail,
  LucideMapPin,
  LucidePhone,
} from 'lucide-react'
import { LuAward, LuBookOpen, LuClipboardCheck, LuUsers } from 'react-icons/lu'

import type { ProfileData } from './types'

export const instructorProfile: ProfileData = {
  eyebrow: 'Instructor Profile',
  subtitle: 'Manage your teaching profile, cohort assignments, and instructor metrics',
  avatar: {
    name: 'Taylor Morgan',
    subtitle: 'Instructor ID: INS-2026 0014',
    buttonLabel: 'Edit Profile',
    avatarLabel: 'TM',
  },
  contacts: [
    { icon: LucideMail, label: 'Email', value: 'taylor.morgan@consultrix.com' },
    { icon: LucidePhone, label: 'Phone', value: '(555) 987-2241' },
    { icon: LucideMapPin, label: 'Location', value: 'Columbus, OH' },
    {
      icon: LucideCalendar,
      label: 'Start Date',
      value: 'Aug 12, 2024',
    },
  ],
  cohortInfoTitle: 'Instruction Assignment',
  cohortInfo: [
    { title: 'Primary Cohort', subtitle: 'Full Stack Development Cohort 12' },
    { title: 'Current Term', subtitle: 'Spring 2026' },
    { title: 'Teaching Load', subtitle: '2 active cohorts' },
  ],
  metricsTitle: 'Instructor Summary',
  metrics: [
    { title: 'Cohorts', value: '2', color: '#7C86FF', icon: LuUsers },
    { title: 'Avg Grade', value: '89%', color: '#C179FE', icon: LuAward },
    { title: 'Graded This Week', value: '34', color: '#00D3F3', icon: LuClipboardCheck },
    { title: 'Modules Led', value: '7', color: '#05DB70', icon: LuBookOpen },
  ],
  skills: [
    'Javascript',
    'React',
    'Node.js',
    'Java',
    'SpringBoot',
    'Mentorship',
  ],
}
