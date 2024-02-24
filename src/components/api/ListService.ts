class ListService {
  async create(boardId: string) {
    const requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New list",
      }),
    };

    const response = await fetch(
      `http://127.0.0.1/api/v1/boards/${boardId}/lists`,
      requestOptions
    );
    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error("Failed to delete list");
    }
  }

  async delete(id: number) {
    const requestOptions: RequestInit = {
      method: "DELETE",
      credentials: "include",
    };

    const response = await fetch(
      `http://127.0.0.1/api/v1/lists/${id}`,
      requestOptions
    );
    if (response.status === 204) {
      return true;
    } else {
      throw new Error("Failed to delete list");
    }
  }

  async updateName(id: number, newName: string) {
    const requestOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newName,
      }),
    };

    const response = await fetch(
      `http://127.0.0.1/api/v1/lists/${id}`,
      requestOptions
    );
    if (response.status === 200) {
      return true;
    } else {
      throw new Error("Failed to update list name");
    }
  }

  async updatePos(id: number, newPos: number) {
    // console.log("id", id, "newPos", newPos);
    const requestOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: newPos,
      }),
    };

    const response = await fetch(
      `http://127.0.0.1/api/v1/lists/${id}`,
      requestOptions
    );
    if (response.status === 200) {
      return true;
    } else {
      throw new Error("Failed to update");
    }
  }
}

let listService = new ListService();

export default listService;
