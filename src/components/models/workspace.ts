import Board from "./board";

interface Workspace {
    id: number;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    boards: Board[];
}

export default Workspace;
