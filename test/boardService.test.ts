import fetchMock from "jest-fetch-mock";
import BoardService from "../src/components/api/BoardService";

describe("WorkspaceService", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("create", () => {
    it("should return data if server responds with status 200", async () => {
      const workspaceId = 1;
      const mockResponseData = { id: 1, title: "New board" };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const createdBoard = await BoardService.create(workspaceId);

      expect(createdBoard).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/workspaces/${workspaceId}/boards`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New board" }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const workspaceId = 1;
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(BoardService.create(workspaceId)).rejects.toThrow(
        "Failed to create board"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/workspaces/${workspaceId}/boards`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New board" }),
        })
      );
    });
  });

  describe("get", () => {
    it("should return data if server responds with status 200", async () => {
      const boardId = "123";
      const mockResponseData = { id: boardId, title: "Board Title" };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const board = await BoardService.get(boardId);

      expect(board).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}`,
        expect.objectContaining({
          credentials: "include",
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const boardId = "123";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(BoardService.get(boardId)).rejects.toThrow(
        "Failed to create board"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}`,
        expect.objectContaining({
          credentials: "include",
        })
      );
    });
  });

  describe("lists", () => {
    it("should return data if server responds with status 200", async () => {
      const boardId = "board123";
      const mockResponseData = [
        { id: "list1", title: "List 1" },
        { id: "list2", title: "List 2" },
      ];
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const lists = await BoardService.lists(boardId);

      expect(lists).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}/lists`,
        expect.objectContaining({
          credentials: "include",
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const boardId = "board123";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(BoardService.lists(boardId)).rejects.toThrow(
        "Failed to create board"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}/lists`,
        expect.objectContaining({
          credentials: "include",
        })
      );
    });
  });

  describe("delete", () => {
    it("should return true if server responds with status 204", async () => {
      const boardId = "board123";
      fetchMock.mockResponseOnce("", { status: 204 });

      const result = await BoardService.delete(boardId);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });

    it("should throw an error if server responds with non-204 status", async () => {
      const boardId = "board123";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(BoardService.delete(boardId)).rejects.toThrow(
        "Failed to delete list"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });
  });

  describe("updateName", () => {
    it("should return updated data if server responds with status 200", async () => {
      const boardId = "board123";
      const newName = "New Board Name";
      const mockResponseData = { id: boardId, title: newName };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const updatedBoard = await BoardService.updateName(boardId, newName);

      expect(updatedBoard).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newName }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const boardId = "board123";
      const newName = "New Board Name";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(BoardService.updateName(boardId, newName)).rejects.toThrow(
        "Failed to update list name"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/boards/${boardId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newName }),
        })
      );
    });
  });
});
