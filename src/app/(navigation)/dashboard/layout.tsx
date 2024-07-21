import { Metadata } from 'next';
import Dashboard from './page';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'player dashboard'
  };

  export default function LayoutDashboard(){

    return <Dashboard/>
}