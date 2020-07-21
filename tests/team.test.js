const request = require("supertest");
const app = require("../app");

describe("Team Endpoints", () => {
  it("should create a new team", async () => {
    const res = await request(app).post("/api/v1/teams").send({
      name: "Man U",
      code: "MAN",
      city: "Lagos",
      country: "USA",
      stadium: "MyStad",
      year_founded: "1993",
      coach: "Kayode",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("post");
  });

  it("should fetch a single team", async () => {
    const teamId = "5f16ce7a61c2d40ab00acce7";
    const res = await request(app).get(`/api/v1/teams/${teamId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("post");
  });

  it("should fetch all teams", async () => {
    const res = await request(app).get("/api/v1/teams");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("posts");
    expect(res.body.posts).toHaveLength(1);
  });

  it("should update a team", async () => {
    const teamId = "5f16ce7a61c2d40ab00acce7";
    const res = await request(app).put(`/api/v1/teams/${teamId}`).send({
      name: "Man U",
      code: "MAN",
      city: "Lagos",
      country: "USA",
      stadium: "MyStad",
      year_founded: "1993",
      coach: "Kayode",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("post");
    expect(res.body.post).toHaveProperty("title", "updated title");
  });

  it("should delete a team", async () => {
    const teamId = "5f16ce7a61c2d40ab00acce7";
    const res = await request(app).delete(`/api/v1/teams/${teamId}`);
    expect(res.statusCode).toEqual(204);
  });

  it("should respond with status code 404 if resource is not found", async () => {
    const teamId = "5f16ce7a61c2d40ab00acce7";
    const res = await request(app).get(`/api/v1/teams/${teamId}`);
    expect(res.statusCode).toEqual(404);
  });
});
