import fetchMock from "jest-fetch-mock";
import WorkspaceService from "../src/components/api/WorkspaceService";

describe("WorkspaceService", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("create", () => {
    it("should create a new workspace successfully", async () => {
      const mockResponseData = { id: 1, title: "New workspace" };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const createdWorkspace = await WorkspaceService.create();

      expect(fetchMock).toHaveBeenCalledWith(
        "http://127.0.0.1/api/v1/workspaces",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New workspace" }),
        })
      );

      expect(createdWorkspace).toEqual(mockResponseData);
    });

    it("should throw an error when failed to create workspace", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });
      await expect(WorkspaceService.create()).rejects.toThrow(
        "Failed to create workspace"
      );
    });
  });

  describe("list", () => {
    it("should return data if server responds with status 200", async () => {
      const mockResponseData = [
        { id: 1, title: "Workspace 1" },
        { id: 2, title: "Workspace 2" },
      ];
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const workspaces = await WorkspaceService.list();

      expect(workspaces).toEqual(mockResponseData);
    });

    it("should throw an error if server responds with non-200 status", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });
      await expect(WorkspaceService.list()).rejects.toThrow(
        "Failed to create board"
      );
    });
  });

  describe("delete", () => {
    it("should return true if server responds with status 204", async () => {
      const workspaceId = 1;
      fetchMock.mockResponseOnce("", { status: 204 });

      const result = await WorkspaceService.delete(workspaceId);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/workspaces/${workspaceId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });

    it("should throw an error if server responds with non-204 status", async () => {
      const workspaceId = 1;
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(WorkspaceService.delete(workspaceId)).rejects.toThrow(
        "Failed to delete list"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/workspaces/${workspaceId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });
  });

  describe("updateName", () => {
    it("should return updated data if server responds with status 200", async () => {
      const workspaceId = 1;
      const newName = "New Workspace Name";
      const mockResponseData = { id: workspaceId, title: newName };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const updatedWorkspace = await WorkspaceService.updateName(
        workspaceId,
        newName
      );

      expect(updatedWorkspace).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/workspaces/${workspaceId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newName }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const workspaceId = 1;
      const newName = "New Workspace Name";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(
        WorkspaceService.updateName(workspaceId, newName)
      ).rejects.toThrow("Failed to update list name");
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/workspaces/${workspaceId}`,
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
