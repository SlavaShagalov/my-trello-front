import fetchMock from "jest-fetch-mock";
import CardService from "../src/components/api/CardService";

describe("WorkspaceService", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("create", () => {
    it("should return data if server responds with status 200", async () => {
      const listId = 123;
      const mockResponseData = {
        id: "card123",
        title: "New card",
        content: "Some content",
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const createdCard = await CardService.create(listId);

      expect(createdCard).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}/cards`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New card", content: "Some content" }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const listId = 123;
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(CardService.create(listId)).rejects.toThrow(
        "Failed to delete list"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/lists/${listId}/cards`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New card", content: "Some content" }),
        })
      );
    });
  });

  describe("get", () => {
    it("should return data if server responds with status 200", async () => {
      const cardId = "card123";
      const mockResponseData = {
        id: cardId,
        title: "Card Title",
        content: "Card Content",
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const fetchedCard = await CardService.get(cardId);

      expect(fetchedCard).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
        expect.objectContaining({
          credentials: "include",
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const cardId = "card123";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(CardService.get(cardId)).rejects.toThrow(
        "Failed to create board"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
        expect.objectContaining({
          credentials: "include",
        })
      );
    });
  });

  describe("delete", () => {
    it("should return true if server responds with status 204", async () => {
      const cardId = "card123";
      fetchMock.mockResponseOnce("", { status: 204 });

      const result = await CardService.delete(cardId);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });

    it("should throw an error if server responds with non-204 status", async () => {
      const cardId = "card123";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(CardService.delete(cardId)).rejects.toThrow(
        "Failed to delete list"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });
  });

  describe("update", () => {
    it("should return updated data if server responds with status 200", async () => {
      const cardId = "card123";
      const updatedTitle = "Updated Title";
      const updatedContent = "Updated Content";
      const mockResponseData = {
        id: cardId,
        title: updatedTitle,
        content: updatedContent,
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData), {
        status: 200,
      });

      const updatedCard = await CardService.update(
        cardId,
        updatedTitle,
        updatedContent
      );

      expect(updatedCard).toEqual(mockResponseData);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
          }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const cardId = "card123";
      const updatedTitle = "Updated Title";
      const updatedContent = "Updated Content";
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(
        CardService.update(cardId, updatedTitle, updatedContent)
      ).rejects.toThrow("Failed to update list name");
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
          }),
        })
      );
    });
  });

  describe("updatePos", () => {
    it("should return true if server responds with status 200", async () => {
      const cardId = 123;
      const newPos = 5;
      fetchMock.mockResponseOnce("", { status: 200 });

      const result = await CardService.updatePos(cardId, newPos);

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: newPos }),
        })
      );
    });

    it("should throw an error if server responds with non-200 status", async () => {
      const cardId = 123;
      const newPos = 5;
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(CardService.updatePos(cardId, newPos)).rejects.toThrow(
        "Failed to update"
      );
      expect(fetchMock).toHaveBeenCalledWith(
        `http://127.0.0.1/api/v1/cards/${cardId}`,
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
