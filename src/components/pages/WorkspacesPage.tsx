import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import WorkspaceHeader from "../WorkspaceHeader";
import RectBoard from "../boards/RectBoard";
import { Link } from "react-router-dom";
import Workspaces from "../models/workspaces";
import BoardService from "../api/BoardService";
import WorkspaceService from "../api/WorkspaceService";



const WorkspacesPage = () => {
    const [data, setData] = useState<Workspaces | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const resultJson = await WorkspaceService.list();
                setData(resultJson);
            } catch (error) {
                console.error('Failed to fetch board:', error);
            }
        }
        fetchData();
    }, []); 

    const addBoard = async (event: any, workspaceId: number, workspaceIdx: number) => {
        event.preventDefault();
        try {
            let resultJson: any = await BoardService.create(workspaceId!);
            let newData = structuredClone(data);
            newData?.workspaces[workspaceIdx].boards.push(resultJson);
            setData(newData);
        } catch (error: any) {
            console.log('Create failed:', error.message);
        }
    };

    const addWorkspace = async (event: any) => {
        event.preventDefault();
        try {
            let resultJson: any = await WorkspaceService.create();
            let newData = structuredClone(data);
            resultJson["boards"] = []
            newData?.workspaces.push(resultJson);
            setData(newData);
        } catch (error: any) {
            console.log('Create failed:', error.message);
        }
    };

    const delWorkspace = (id: any) => {
        let newData: Workspaces = structuredClone(data!);
        newData!.workspaces = newData!.workspaces.filter(workspace => workspace.id !== id);
        setData(newData);
    }

    return (
        <div className="bg-green-500 h-full w-full">
            <Navbar />
            <div className="h-full mx-52">
                <div className="my-5 flex items-center">
                    <h3 className="text-base font-bold mr-4">ВАШИ РАБОЧИЕ ПРОСТРАНСТВА</h3>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 font-bold p-2 rounded focus:outline-none focus:shadow-outline"
                        onClick={(e) => { addWorkspace(e) }}
                    >
                        Add workspace
                    </button>
                </div>
                {data?.workspaces.map((workspace, workspaceIdx) => {
                    return (
                        <WorkspaceHeader key={workspace.id} id={workspace.id} initName={workspace.title} onDelete={delWorkspace}>
                            <div className="flex flex-wrap">
                                {data.workspaces[workspaceIdx].boards.map((board) => {
                                    return (
                                        <Link to={`/boards/${board.id}`}>
                                            <RectBoard key={board.id} name={board.title} />
                                        </Link>
                                    );
                                })}
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 font-bold w-48 h-24 mb-5 mr-5 p-2 rounded focus:outline-none focus:shadow-outline"
                                    onClick={(e) => { addBoard(e, workspace.id, workspaceIdx) }}
                                >
                                    Add board
                                </button>
                            </div>
                        </WorkspaceHeader>
                    );
                })}
            </div>
        </div>
    );
}

export default WorkspacesPage;
