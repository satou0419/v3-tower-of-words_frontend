import { Metadata } from 'next';
import Item from './page';

export const metadata: Metadata = {
    title: 'Item',
    description: 'The item page is where you can see the inventory and shop tab, this is where you can find your items and buy items to help you win the game.'
  };

  export default function LayoutItem(){

    return <Item/>
}