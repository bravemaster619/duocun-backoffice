import HttpService from "./Http";
import AuthService from "./Auth";
import { expect } from "chai";

describe("Http service", () => {
  describe("buildUrl", () => {
    it("should prepend API host to given url", () => {
      const url = "test";
      expect(HttpService.buildUrl(url)).to.equal(HttpService.API_HOST + "/test");
    });
    it("should remove slash if given url already contains it", () => {
      const url = "/test";
      expect(HttpService.buildUrl(url)).to.equal(HttpService.API_HOST + "/test");
    });
    it("should build a query string for given parameter", () => {
      const url = "test";
      const param = {
        foo: "bar",
        bar: "baz"
      };
      expect(HttpService.buildUrl(url, param)).to.equal(HttpService.API_HOST + "/test?bar=baz&foo=bar");
    })
  });
  describe("buildAuthHeader", () => {
    it("should return empty object when user is not authenticated", () => {
      expect(HttpService.buildAuthHeader()).to.eql({});
    });
    it("should return http header object when user is authenticated", () => {
      AuthService.login("test-token");
      expect(HttpService.buildAuthHeader()).to.eql({
        headers: {
          Authorization: "Bearer test-token"
        }
      })
    })
  });
})