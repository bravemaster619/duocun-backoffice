import * as helper from "./index.js";
import { expect } from "chai";

describe("helper", () => {
  describe("getQueryParam", () => {
    const location = {
      pathname: "/products",
      search: "?page=5&sort=2",
      hash: "",
      state: undefined
    };
    it("should return query param", () => {
      expect(helper.getQueryParam(location, "page")).to.equals("5");
      expect(helper.getQueryParam(location, "sort")).to.equals("2");
    });
    it("should return empty string if query key is missing", () => {
      expect(helper.getQueryParam(location, "abc")).to.equals("");
    });
  })
});
