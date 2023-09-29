import fruits from "data/fruits";
import app from "index";

import supertest from "supertest";

const api = supertest(app)

beforeAll(async () => {
    for (let i = 0; i < fruits.length; i++) {
        fruits.pop()
    }
})

describe("POST /fruits tests", () => {
    it("should create a fruit", async () => {
        const result = await api.post("/fruits").send({
            name: "Manga",
            price: 985
        })
        expect(result.status).toBe(201)
    })
    it("should receive 409 when tring to create two fruits with same name", async () => {
        await api.post("/fruits").send({
            name: "Morango",
            price: 999
        })
        const result = await api.post("/fruits").send({
            name: "Morango",
            price: 999
        })
        expect(result.status).toBe(409)
    })
    it("should return 422 when inserting a fruit with data missing", async () => {
        const result = await api.post("/fruits").send({
            price: 399
        })
        expect(result.status).toBe(422)
    })
})

describe("GET /fruits tests", () => {
    it("should return 404 when trying to get a fruit by an id that doesn't exist", async () => {
        const id = (fruits[fruits.length - 1].id) + 1
        const result = await api.get(`/fruits/${id}`)
        expect(result.status).toBe(404)
    })
    it("should return 400 when id param is present but not valid", async () => {
        const id = "a"
        const result = await api.get(`/fruits/${id}`)
        expect(result.status).toBe(400)
    })
    it("should return one fruit when given a valid and existing id", async () => {
        const id = fruits[0]
        const result = await api.get(`/fruits/${id}`)
        expect([result.body]).toHaveLength(1)
    })
    it("should return all fruits if no id is present", async () => {
        const totalFruits = fruits.length
        const result = await api.get("/fruits")
        expect(result.body).toHaveLength(totalFruits)
    })
})