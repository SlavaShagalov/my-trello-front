class CardService {
  static async create(listId: number) {
    const requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New card",
        content: "Some content",
      }),
    };

    const response = await fetch(
      `http://127.0.0.1/api/v1/lists/${listId}/cards`,
      requestOptions
    );
    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error("Failed to delete list");
    }
  }

  static async get(id: string) {
    const response = await fetch(
      `http://127.0.0.1/api/v1/cards/${id}`, {
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
      `http://127.0.0.1/api/v1/cards/${id}`,
      requestOptions
    );
    if (response.status === 204) {
      return true;
    } else {
      throw new Error("Failed to delete list");
    }
  }

  static async update(id: string, title: string, content: string) {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "title": title,
          "content": content,
      }),
  };

    const response = await fetch(
      `http://127.0.0.1/api/v1/cards/${id}`,
      requestOptions
    );
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("Failed to update list name");
    }
  }

  static async updatePos(id: number, newPos: number) {
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
      `http://127.0.0.1/api/v1/cards/${id}`,
      requestOptions
    );
    if (response.status === 200) {
      return true;
    } else {
      throw new Error("Failed to update");
    }
  }
}

export default CardService;
