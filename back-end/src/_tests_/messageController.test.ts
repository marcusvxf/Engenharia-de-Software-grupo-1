import { Request, Response } from "express";
import { sendMessage } from "../controllers/message.controller";

describe("sendMessage Controller - Integração", () => {
  it("deve salvar mensagem no banco, buscar histórico e chamar o RAG real", async () => {
    const req = {
      body: { chatId: "123", text: "Olá", order: 1 }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response;

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ragResponse: expect.any(String)
      })
    );
  });
});
