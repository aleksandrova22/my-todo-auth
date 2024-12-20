import useSWR from 'swr';
import toast from 'react-hot-toast';
import { ErrorInfo } from '../components/Error';
import { config } from './Elem/jsph';
import { Dispatch, MouseEventHandler, ReactNode, SetStateAction, useState} from 'react';
import type { Column } from './Elem/jsph';
import { ToDoList } from '@prisma/client';
import { List } from './Elem/List';

const
    API_URL = '/api/todo',

    fetcher = async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('fetch ' + response.status);
        return await response.json();
    },
    infoFetcher = async () => {
        const pr = fetcher();
        toast.promise(pr, {
            loading: 'Fetcher ',
            success: 'ok',
            error: (err: Error) => `${err.toString()}`,
        });
        return await pr;
    };

type EditFormValuesType = string[];
type SetEditFormValuesType = Dispatch<SetStateAction<string[]>>;
type EditedIdType = null | ToDoList['id'];


export function ToDo() {
    const
        { data, error, isLoading, isValidating, mutate } = useSWR<ToDoList[]>(API_URL, infoFetcher, { revalidateOnFocus: false }),
        [addFormValues, setAddFormValues] = useState(Array.from({ length: config.columns.length }, () => '')),
        [editFormValues, setEditFormValues]: [EditFormValuesType, SetEditFormValuesType] = useState(Array.from({ length: config.columns.length }, () => '')),
        [editedId, setEditedId] = useState<EditedIdType>(null);

    const
        //добавление 
        addItem: MouseEventHandler = async () => {
            let
                optimisticData: undefined | ToDoList[] = undefined;
            const
                getPromise = async () => {
                    const
                        newObj: Partial<ToDoList> = {};
                    config.columns.map(({ setVal }, i) => setVal && Object.assign(newObj, setVal(addFormValues[i])));
                    optimisticData = data?.concat(newObj as ToDoList);
                    return fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newObj)
                    }).then(res => {
                        if (!res.ok) {
                            throw (new Error(res.status + ' ' + res.statusText));
                        }
                    });
                },
                promise = getPromise();

            if (promise) {
                toast.promise(promise, {
                    loading: 'Fetching ',
                    success: 'ok',
                    error: (err: Error) => `${err.toString()}`,
                });
                await mutate(promise.then(() => optimisticData, () => infoFetcher()), { optimisticData, revalidate: true });
            }
        },
        //удаление
        delItem = async (id: null | ToDoList['id']) => {
            let optimisticData: undefined | ToDoList[] = undefined;
            if (!id) return;
            const
                // target = event.target as HTMLElement,
                // id = (target.closest('[data-id]') as HTMLElement)?.dataset?.id,

                getPromise = async () => {
                    optimisticData = data?.filter(el => (el.id) !== id);
                    return fetch(API_URL + '/' + id, { method: 'DELETE' })
                        .then(res => {
                            if (!res.ok) {
                                throw (new Error(res.status + ' ' + res.statusText));
                            }
                        })
                },
                promise = getPromise();
            if (promise) {
                toast.promise(promise, {
                    loading: 'Fetching ',
                    success: 'ok',
                    error: (err: Error) => `${err.toString()}`,
                });
                await mutate(promise.then(() => optimisticData, () => infoFetcher()), { optimisticData, revalidate: true });
            }
        },

        startEditItem = (id: null | ToDoList['id']) => {
            if (!id) return;
            //const
            //target = event.target as HTMLElement,
            //id = (target.closest('[data-id]') as HTMLElement)?.dataset?.id;
            // if (!id) throw new Error('not id');
            setEditedId(id);
            const
                editedData = data?.find(el => (el.id) === id);
            setEditFormValues(
                config.columns.map(({ setVal, getVal }) =>
                    getVal && setVal
                        ? getVal(editedData as ToDoList)
                        : ''))
        },
        //редактирование
        editItem: MouseEventHandler = async () => {
            let optimisticData: undefined | ToDoList[] = undefined;
            const
                getPromise = async () => {
                    const
                        index = data?.findIndex((obj) => String(obj.id) === String(editedId));
                    if (!index) throw (new Error('no index'));
                    const clone = structuredClone(data?.[index]) || null;
                    if (!clone) throw (new Error('no index'));
                    config.columns.map(({ setVal }, i) => setVal && Object.assign(clone, setVal(editFormValues[i])));
                    optimisticData = data?.with(index, clone);
                    setEditedId(null);
                    return fetch(API_URL + '/' + editedId, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(clone)
                    }).then(res => {
                        if (!res.ok) {
                            throw (new Error(res.status + ' ' + res.statusText));
                        }
                    })
                },
                promise = getPromise();
            if (promise) {
                toast.promise(promise, {
                    loading: 'Fetching ',
                    success: 'ok',
                    error: (err: Error) => `${err.toString()}`,
                });
                await mutate(promise.then(() => optimisticData, () => infoFetcher()), { optimisticData, revalidate: true });
            }
        },

        toggleCheckbox = async (id: null | ToDoList['id']) => {

            const optimisticData: undefined | ToDoList[] = undefined;
            //const                target = event.target as HTMLElement,
                //id = (target.closest('[data-id]') as HTMLElement)?.dataset?.id;
            if (!id) throw new Error('not id');
            const getPromise = async () => {
                const
                    current: ToDoList | undefined = data?.find(el => String(id) === String(el.id)),
                    checked = !current?.checked;
                await fetch(API_URL + '/' + id, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ checked })
                });

            },
                promise = getPromise();
            if (promise) {
                toast.promise(promise, {
                    loading: 'Fetching ',
                    success: 'ok',
                    error: (err: Error) => `${err.toString()}`,
                });
                await mutate(promise.then(() => optimisticData, () => infoFetcher()), { optimisticData, revalidate: true });
            }

        }


    return <>
        <div style={{ position: 'absolute', fontSize: 'xxx-large' }}>
            {isLoading && '⌛'}
            {isValidating && '👁'}
        </div>
        {error && <ErrorInfo error={error} />}
        <fieldset>
            <DataForm columns={config.columns} values={addFormValues} setValues={setAddFormValues} >
                <button
                    onClick={addItem} >➕ Добавить в список</button>
            </DataForm>
            <div>

                {data &&
                    <List list={data} delItem={delItem} startEditItem={startEditItem} toggleCheckbox={toggleCheckbox}
                        editForm={<DataForm columns={config.columns} values={editFormValues} setValues={setEditFormValues} >
                            <button onClick={editItem}>✔️ Ок </button>
                            <button onClick={() => setEditedId(null)} > Отмена❌</button>
                        </DataForm>}
                        editedId={editedId} />
                }
            </div>
        </fieldset>
    </>;
}


type DataFormProps = {
    columns: Column[],
    values: EditFormValuesType,
    setValues: SetEditFormValuesType,
    children: ReactNode
}


function DataForm({ columns, values, setValues, children }: DataFormProps) {

    return <li>
        {columns.map(({ setVal }, i: number) => <span key={i}>
            {setVal
                ? <input
                    value={values[i]}
                    onInput={event => setValues(prev => prev.with(i, (event.target as HTMLInputElement).value))} />
                : ''}
        </span>)}
        <hr />
        <span>
            {children}
        </span>
    </li>;

}



