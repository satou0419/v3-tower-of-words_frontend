import { Metadata } from 'next';
import Login from './page';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Access your account on Tower of Words. Log in to play spelling games with your friends, manage your profile, settings, and more..'
  };

  export default function LayoutLogin(){

    return <Login/>
}