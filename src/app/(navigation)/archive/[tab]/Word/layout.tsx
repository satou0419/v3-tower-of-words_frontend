import { Metadata } from 'next';
import Words from './Words';


export const metadata: Metadata = {
    title: 'Unlocked Words',
    description: 'words bruhh'
  };

  export default function LayoutWords(){

    return <Words/>
}