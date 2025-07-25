import request from "supertest";
import app from "../src/app.js";

describe("🔐 Auth Functional Test - POST /api/users/login", () => {
  it("renvoie 400 si email ou mot de passe manquant", async () => {
    const res = await request(app).post("/api/users/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email et mot de passe requis");
  });

  it("renvoie 401 si mauvais identifiants", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "invalide@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Email ou mot de passe incorrect");
  });

  // TODO : ✅ Vrai test avec la base de donnés ( A TESTER UNIUQMENT SI l'utilisateur existe dans la bdd )
    // it("renvoie 200 si authentification réussie avec vrai user en bdd", async () => {
    //   const res = await request(app).post("/api/users/login").send({
    //     email: "test@test.com",
    //     password: "qsdqsdqsd65465jbgHBKx@", // Attention : doit exister en base
    //   });

    //   expect(res.statusCode).toBe(200);
    //   expect(res.body.message).toBe("Connexion réussie");
    //   expect(res.body.user).toHaveProperty("email", "test@test.com");
    // });
});
