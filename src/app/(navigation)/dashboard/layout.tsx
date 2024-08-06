import { Metadata } from 'next';
import Dashboard from './page';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'The dashboard is the main hub for users to access and manage various features within the application.'
  };

  export default function LayoutDashboard(){

    return <Dashboard/>
}