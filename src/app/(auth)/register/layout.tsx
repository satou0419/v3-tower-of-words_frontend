import { Metadata } from 'next';
import Register from './page';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create a new account on Tower of Words. Sign up to enjoy personalized features, access to exclusive content, and more.'
  };

  export default function LayoutRegister(){

    return <Register/>
}