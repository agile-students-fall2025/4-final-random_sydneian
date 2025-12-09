import chai from "chai";
import chaiHttp from "chai-http";
const { expect } = chai;

chai.use(chaiHttp);

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_secret_key";

import app from "../src/app.js";
import { User, Group, connectDB, disconnectDB } from "../src/db.js";

let token;
let userId;
let groupId;
let activityId;

describe("Auth + Bucket List API", () => {
  // set up a clean test user & DB before tests
  before(async () => {
    // clean collections to avoid unique conflicts
    await connectDB();

    await User.deleteMany({});
    await Group.deleteMany({});

    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: bcrypt.hashSync("password123"),
      emailVerified: true,
    });

    userId = user._id.toString();

    // manually sign a JWT the same way the app does
    token = jwt.sign(
      { id: userId, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  });

  after(async () => {
    await Group.deleteMany({});
    await User.deleteMany({});
    await disconnectDB();
  });

  // auth tests

  describe("POST /api/login", () => {
    it("should return 400 when username/password missing", async () => {
      const res = await chai.request(app).post("/api/login").send({});
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error");
    });

    it("should login successfully with correct credentials", async () => {
      const res = await chai.request(app)
        .post("/api/login")
        .send({ username: "testuser", password: "password123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("JWT");
    });
  });

  // auth middleware tests

  describe("Auth middleware", () => {
    it("should reject access to protected route without JWT", async () => {
      const res = await chai.request(app).get("/api/groups");
      expect(res.status).to.equal(401);
    });
  });

  // group + bucket list (activities)

  describe("Group + Bucket List endpoints", () => {
    it("should create a new group for the authenticated user", async () => {
      const res = await chai
        .request(app)
        .post("/api/groups")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Group",
          desc: "Group for bucket list tests",
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("name", "Test Group");

      groupId = res.body._id;
    });

    it("should add an activity (bucket list item) to the group", async () => {
      const res = await chai
        .request(app)
        .post(`/api/groups/${groupId}/activities`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Visit Central Park",
          category: "Outdoors",
          tags: ["park", "NYC"],
          locationDescription: "New York City",
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("name", "Visit Central Park");
      expect(res.body).to.have.property("_id");

      activityId = res.body._id;
    });

    it("should return group details including the new activity", async () => {
      const res = await chai
        .request(app)
        .get(`/api/groups/${groupId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("activities");
      expect(res.body.activities).to.be.an("array");
      expect(res.body.activities.length).to.equal(1);
      expect(res.body.activities[0]).to.have.property("name", "Visit Central Park");
    });
  });

  // memories (for an activity)

  describe("Memories endpoints", () => {
    it("should add a memory to the activity", async () => {
      const res = await chai
        .request(app)
        .post(`/api/groups/${groupId}/memories`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          activityId,
          title: "Fun day out",
          images: ["data:image/png;base64,FAKEIMAGE"],
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("title", "Fun day out");
      expect(res.body).to.have.property("activityId", activityId);
    });

    it("should retrieve all memories for the group", async () => {
      const res = await chai
        .request(app)
        .get(`/api/groups/${groupId}/memories`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);
      expect(res.body[0]).to.have.property("title");
    });
  });
});
