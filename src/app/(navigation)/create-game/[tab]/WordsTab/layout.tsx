import { Metadata } from 'next';
import Dashboard from './page';

export const metadata: Metadata = {
    title: 'Player Badges',
    description: 'Unlock and collect game badges and achievements. Track your progress, showcase your skills, and compete with friends. Discover how to earn new badges and share your gaming milestones. '
  };

  export default function LayoutDashboard(){

    return <Dashboard/>
}