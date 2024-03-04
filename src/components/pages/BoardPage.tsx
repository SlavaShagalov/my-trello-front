import React, { useEffect } from 'react';

import Card from "../Card";
import Navbar from "../Navbar";
import List from '../List';
import Drag from '../Drag';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Lists from '../models/lists';
import listService from '../api/ListService';
import CardService from '../api/CardService';
import BoardService from '../api/BoardService';
import DangerBtn from '../buttons/DangerBtn';

const BoardPage = () => {
    const { id } = useParams();
    const [name, setName] = React.useState('');
    const [resp, setData] = React.useState<Lists | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const resultJson = await BoardService.get(id!);
                setName(resultJson.title);
            } catch (error) {
                console.error('Failed to fetch board:', error);
            }

            try {
                const resultJson = await BoardService.lists(id!);
                setData(resultJson);
            } catch (error) {
                console.error('Failed to fetch board:', error);
            }
        }
        fetchData();
    }, []);

    function handleDrop({ dragItem, dragType, drop }: { dragItem: any, dragType: any, drop: any }) {
        if (dragType === "card") {
            // get the drop position as numbers
            let [newListPosition, newCardPosition] = drop.split("-").map((string: any) => parseInt(string));
            console.log("newListPosition", newListPosition);
            console.log("newCardPosition", newCardPosition);
            // create a copy for the new data
            let newData = structuredClone(resp); // deep clone
            // find the current positions
            let oldCardPosition: number = 0;
            let oldListPosition = resp?.lists.findIndex((list) => {
                oldCardPosition = list.cards.findIndex((card) => card.id === dragItem);
                return oldCardPosition >= 0;
            });
            console.log("oldListPosition", oldListPosition);
            console.log("oldCardPosition", oldCardPosition);
            // get the card
            let card = resp?.lists[oldListPosition!].cards[oldCardPosition];
            // if same array and current position before drop reduce drop position by one
            if (newListPosition === oldListPosition && oldCardPosition < newCardPosition) {
                newCardPosition--; // reduce by one
            }
            // remove the card from the old position
            newData?.lists[oldListPosition!].cards.splice(oldCardPosition, 1);
            // put it in the new position
            newData?.lists[newListPosition].cards.splice(newCardPosition, 0, card!);
            // update the state
            setData(newData);

            CardService.updatePos(dragItem, newCardPosition + 1);
        } else if (dragType === "list") {
            let newListPosition = drop;
            let oldListPosition = resp?.lists.findIndex((list) => list.id === dragItem);
            let newData = structuredClone(resp); // deep clone
            let list = resp?.lists[oldListPosition!];
            // if current position before drop reduce drop position by one
            if (oldListPosition! < newListPosition) {
                newListPosition--; // reduce by one
            }
            newData?.lists.splice(oldListPosition!, 1);
            newData?.lists.splice(newListPosition, 0, list!);
            setData(newData);

            listService.updatePos(dragItem, newListPosition + 1);
        }
    };

    const addCard = async (event: any, listId: number) => {
        event.preventDefault();
        try {
            let resultJson: any = await CardService.create(listId!);
            let newData = structuredClone(resp);
            let idx = newData?.lists.findIndex((list: any) => list.id === listId);
            newData?.lists[idx!].cards.push(resultJson);
            setData(newData);
        } catch (error: any) {
            console.log('Create failed:', error.message);
        }
    };

    const addList = async (event: any) => {
        event.preventDefault();
        try {
            let resultJson: any = await listService.create(id!);
            let newData = structuredClone(resp);
            resultJson["cards"] = []
            newData?.lists.push(resultJson);
            setData(newData);
        } catch (error: any) {
            console.log('Create failed:', error.message);
        }
    };

    const delList = (id: any) => {
        let newData: Lists = structuredClone(resp!);
        newData!.lists = newData!.lists.filter(list => list.id !== id);
        setData(newData);
    }

    const updateName = async (newName: any) => {
        try {
            await BoardService.updateName(id!, newName);
            setName(newName);
        } catch (error: any) {
            console.log('Update failed:', error.message);
        }
    };

    const delBoard = async (event: any) => {
        event.preventDefault();
        try {
            await BoardService.delete(id!);
            navigate("/workspaces");
        } catch (error: any) {
            console.log('Delete failed:', error.message);
        }
    };

    return (
        <div className="bg-green-500 h-full w-full">
            <Navbar />
            <div className='bg-green-600 h-16 flex justify-between px-4 py-3'>
                <input
                    className="bg-inherit hover:bg-slate-400 focus:bg-white text-white w-full focus:text-black text-lg font-bold appearance-none rounded mr-2 leading-tight outline-none focus:shadow-outline"
                    type="text"
                    value={name}
                    onChange={(e) => updateName(e.target.value)}
                />
                <DangerBtn onClick={delBoard}>Delete</DangerBtn>
            </div>
                <Drag handleDrop={handleDrop}>
                    {({ activeItem, activeType, isDragging }: { activeItem: any, activeType: any, isDragging: any }) => {
                        return (
                            <Drag.DropZone className="flex ml-2 overflow-x-scroll h-screen">
                                {resp?.lists.map((list, listPos) => {
                                    return (
                                        <React.Fragment key={list.id}>
                                            <Drag.DropZone dropId={listPos} dropType="list" remember="true">
                                                <Drag.DropGuide dropId={listPos} dropType="list" className="rounded-xl bg-gray-200 h-96 mx-2 my-5 w-80 shrink-0 grow-0" />
                                            </Drag.DropZone>
                                            <Drag.DropZones className="flex flex-col h-full" prevId={listPos} nextId={listPos + 1} dropType="list" split="x" remember="true">
                                                <Drag.DragItem dragId={list.id} dragType="list"
                                                    className={`cursor-pointer ${activeItem === list.id && activeType === "list" && isDragging ? "hidden" : "translate-x-0"}`}>
                                                    <List id={list.id} initName={list.title} dragItem={activeItem === list.id && activeType === "list"} onDelete={delList}>
                                                        {resp.lists[listPos].cards.map((card, cardPos) => {
                                                            return (
                                                                <Drag.DropZones key={card.id} prevId={`${listPos}-${cardPos}`} nextId={`${listPos}-${cardPos + 1}`} dropType="card" remember="true">
                                                                    <Drag.DropGuide dropId={`${listPos}-${cardPos}`} dropType="card" className="rounded-lg bg-gray-200 h-24 m-2" />
                                                                    <Drag.DragItem dragId={card.id} dragType="card"
                                                                        className={activeItem === card.id && activeType === "card" && isDragging
                                                                            ? "hidden"
                                                                            : ""}
                                                                    >
                                                                        <Card id={card.id} title={card.title} description={card.content}
                                                                            dragItem={activeItem === card.id && activeType === "card"}
                                                                        />
                                                                    </Drag.DragItem>
                                                                </Drag.DropZones>
                                                            );
                                                        })}
                                                        <Drag.DropZone dropId={`${listPos}-${resp.lists[listPos].cards.length}`} dropType="card" remember="true">
                                                            <Drag.DropGuide dropId={`${listPos}-${resp.lists[listPos].cards.length}`} dropType="card"
                                                                className="rounded-lg bg-gray-200 h-24 m-2" />
                                                        </Drag.DropZone>
                                                        <button
                                                            className="bg-gray-200 hover:bg-gray-300 font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                            onClick={(e: any) => { addCard(e, list.id) }}
                                                        >
                                                            Add card
                                                        </button>
                                                    </List>
                                                </Drag.DragItem>
                                                <Drag.DropZone dropId={`${listPos}-${resp.lists[listPos].cards.length}`} className="grow" dropType="card" remember="true" />
                                            </Drag.DropZones>
                                        </React.Fragment>
                                    );
                                })}
                                <Drag.DropZone dropId={resp?.lists.length} dropType="list" remember="true">
                                    <Drag.DropGuide dropId={resp?.lists.length} dropType="list" className="rounded-xl bg-gray-200 h-96 mx-2 my-5 w-80 shrink-0 grow-0" />
                                </Drag.DropZone>
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 font-bold w-80 min-w-80 max-h-12 mx-2 my-5 py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
                                    onClick={addList}
                                >
                                    Add list
                                </button>
                            </Drag.DropZone>
                        );
                    }}
                </Drag>
            </div>
    );
}

export default BoardPage;
