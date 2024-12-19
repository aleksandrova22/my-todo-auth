import { memo, MouseEventHandler, HTMLElementEventMap} from 'react';
import { ToDoList } from '@prisma/client';
//import { Memoize } from 'typescript-memoize';


type ItemProps = {
  item: ToDoList, delItem: MouseEventHandler, startEditItem: MouseEventHandler, toggleCheckbox: HTMLElementEventMap 
};


export const Item = memo(function Item({ item, delItem, startEditItem, toggleCheckbox }: ItemProps) {
  console.debug('Item render id=', item);
  const
      { id, checked, text } = item;
  return <li data-id={id} >
    <input type="checkbox" value={checked} onChange={toggleCheckbox} />
    <span> {text}</span>
    <button onClick ={startEditItem}>✔️Редактировать </button>
    <button onClick={delItem} >❌Удалить</button>
    {checked && '💹'}
  </li>
});

