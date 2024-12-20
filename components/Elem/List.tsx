import { Item } from './Item';
import { memo, Fragment, ReactNode} from 'react';
import classes from './List.module.css';
import { ToDoList } from '@prisma/client';

type ListProps = {
  list: ToDoList[], editedId: ToDoList['id'] | null, editForm: ReactNode, toggleCheckbox: (id: number) => void, delItem: (id: number) => void, startEditItem: (id: number) => void
};

export const List = memo(function _List({ list, editedId, editForm, delItem, startEditItem, toggleCheckbox }: ListProps) {
  console.debug('List render');
  return <fieldset className={classes.list}>
    <legend>Список дел</legend>
    <ol>
      {list.map((item, id) =>
        item.id === editedId
          ? <Fragment key={item.id}> {editForm}  </Fragment>
          : <Item key={id} item={item} delItem={delItem} startEditItem={startEditItem} toggleCheckbox={toggleCheckbox} />
      )}
    </ol>
  </fieldset>
});



