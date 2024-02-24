import fetchMock from "jest-fetch-mock";
import ListService from "../src/components/api/ListService";

describe("WorkspaceService", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("create", () => {
    it("should return data if server responds with status 200", async () => {
      const boardId = "board123";
      const mockResponseData = { id: "list123", title: "New list" };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const createdList = await ListService.create(boardId);

      expect(createdList).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}/lists`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New list" }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const boardId = "board123";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(ListService.create(boardId)).rejects.toThrow(
        "Failed to delete list"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}/lists`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New list" }),
        })
      );
    });
  });

  describe("delete", () => {
    it("should return true if server responds with status 204", async () => {
      const listId = 123;
      fetchMock.mockResponseOnce("", { status: 204 });

      const result = await ListService.delete(listId);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });

    it("should throw an error if server responds with non-204 status", async () => {
      const listId = 123;
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(ListService.delete(listId)).rejects.toThrow(
        "Failed to delete list"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });
  });

  describe("updateName", () => {
    it("should return true if server responds with status 200", async () => {
      const listId = 123;
      const newName = "New List Name";
      fetchMock.mockResponseOnce("", { status: 200 });

      const result = await ListService.updateName(listId, newName);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newName }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const listId = 123;
      const newName = "New List Name";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(ListService.updateName(listId, newName)).rejects.toThrow(
        "Failed to update list name"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newName }),
        })
      );
    });
  });

  describe("updatePos", () => {
    it("should return true if server responds with status 200", async () => {
      const listId = 123;
      const newPos = 5;
      fetchMock.mockResponseOnce("", { status: 200 });

      const result = await ListService.updatePos(listId, newPos);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: newPos }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const listId = 123;
      const newPos = 5;
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(ListService.updatePos(listId, newPos)).rejects.toThrow(
        "Failed to update"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: newPos }),
        })
      );
    });
  });
});
