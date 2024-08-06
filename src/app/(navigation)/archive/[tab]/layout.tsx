import { Metadata } from 'next';
import Archive from './page';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Tower of Words',
    default: 'Tower of Words Archive',
  },
  description: 'The official site of Tower of Words.'
};

export default function ParentArchiveLayout(){

    return <Archive/>
}