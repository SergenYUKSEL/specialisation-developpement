import { UserController } from "../src/Controllers/UserController.js";
import bcrypt from "bcrypt";
import httpMocks from "node-mocks-http";

// Mock AppDataSource.getRepository
jest.mock("../src/index.js", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

// Mock generateAuthResponseWithJwt
jest.mock("../src/config/auth.js", () => ({
  generateAuthResponseWithJwt: jest.fn().mockImplementation((user, res) => {
    res.cookie("auth_token", "fake_token", { httpOnly: true });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }),
}));


import { AppDataSource } from "../src/index.js";

describe("UserController.login", () => {
  let req, res, userRepoMock;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "test@example.com",
        password: "correct_password",
      },
    });

    res = httpMocks.createResponse();
    res.cookie = jest.fn();

    userRepoMock = {
      findOneBy: jest.fn(),
    };

    AppDataSource.getRepository.mockReturnValue(userRepoMock);
  });

  it("renvoie 400 si email ou password manquant", async () => {
    req.body = {}; 
    await UserController.login(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe("Email et mot de passe requis");
  });

  it("renvoie 401 si l'utilisateur n'existe pas", async () => {
    userRepoMock.findOneBy.mockResolvedValue(null);
    await UserController.login(req, res);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toBe("Email ou mot de passe incorrect");
  });

  it("renvoie 401 si mot de passe invalide", async () => {
    userRepoMock.findOneBy.mockResolvedValue({
      email: "test@example.com",
      password: "hashed_password",
    });

    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await UserController.login(req, res);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toBe("Email ou mot de passe incorrect");
  });

  it("renvoie 200 avec cookie si login réussi", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      pseudo: "TestUser",
      password: "hashed_password",
    };

    userRepoMock.findOneBy.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    await UserController.login(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.cookie).toHaveBeenCalledWith(
      "auth_token",
      "fake_token",
      expect.any(Object)
    );
    expect(res._getJSONData().message).toBe("Connexion réussie");
    expect(res._getJSONData().user).toMatchObject({
      id: 1,
      email: "test@example.com",
      pseudo: "TestUser",
    });
  });
});
