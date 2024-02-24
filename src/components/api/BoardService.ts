class BoardService {
  static async create(workspaceId: number) {
    const requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New board",
      }),
    };

    const response = await fetch(
      `http://127.0.0.1/api/v1/workspaces/${workspaceId}/boards`,
      requestOptions
    );
    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error("Failed to create board");
    }
  }

  static async get(id: string) {
    const response = await fetch(`http://127.0.0.1/api/v1/boards/${id}`, {
      credentials: "include",
    });
    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error("Failed to create board");
    }
  }

  static async lists(id: string) {
    const response = await fetch(`http://127.0.0.1/api/v1/boards/${id}/lists`, {
      credentials: "include",
    });
    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error("Failed to create board");
    }
  }

  static async delete(id: string) {
    const requestOptions: RequestInit = {
      method: "DELETE",
      credentials: "include",
    };

    const response = await fetch(
      `http://127.0.0.1/api/v1/boards/${id}`,
      requestOptions
    );
    if (response.status === 204) {
      return true;
    } else {
      throw new Error("Failed to delete list");
    }
  }

  static async updateName(id: string, newName: string) {
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
      `http://127.0.0.1/api/v1/boards/${id}`,
      requestOptions
    );
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("Failed to update list name");
    }
  }
}

export default BoardService;
