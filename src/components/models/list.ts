import Card from "./card";

interface List {
    id: number;
    board_id: number;
    title: string;
    position: string;
    created_at: Date;
    updated_at: Date;
    cards: Card[];
}

export default List;
