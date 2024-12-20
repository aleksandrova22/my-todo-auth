import React, {  memo, useCallback, useState } from 'react';
import { ToDoList } from '@prisma/client';

//type SetIdType = Dispatch<SetStateAction<string[]>>;

type ItemProps = {
  item: ToDoList, delItem: (id: number) => void, startEditItem: (id: number) => void, toggleCheckbox: (id: number) => void
};

export const Item = memo(function Item({ item, delItem, startEditItem, toggleCheckbox }: ItemProps) {
  
  

  console.debug('Item render id=', item);
 const 
    { id, checked, text } = item;

   const  onClickDel = useCallback(() => delItem(id), [id]),
    onClickEditItem = useCallback(() => startEditItem(id), [id]),
    onToggleCheckbox = useCallback(() => toggleCheckbox(id), [id]);
   
  return <li>
    <input type="checkbox" value={checked} onChange={onToggleCheckbox} />
    <span> {text}</span>
    <button onClick={onClickEditItem}>✔️Редактировать </button>
    <button onClick={onClickDel} >❌Удалить</button>
    {checked && '💹'}
  </li>
});


