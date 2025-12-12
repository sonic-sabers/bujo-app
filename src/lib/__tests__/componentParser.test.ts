import {
  parseComponentQuery,
  getComponentResponse,
  parseComponentFull,
} from "../componentParser";

describe("componentParser", () => {
  describe("parseComponentQuery", () => {
    // Button detection
    it('should detect button-variants from "show me buttons"', () => {
      expect(parseComponentQuery("show me buttons")).toBe("button-variants");
    });

    it('should detect button-variants from "button variations"', () => {
      expect(parseComponentQuery("button variations")).toBe("button-variants");
    });

    it('should detect button-variants from "ghost button"', () => {
      expect(parseComponentQuery("ghost button")).toBe("button-variants");
    });

    it('should detect button-variants from "cta"', () => {
      expect(parseComponentQuery("show me a cta")).toBe("button-variants");
    });

    // Card detection
    it('should detect card-variants from "show me cards"', () => {
      expect(parseComponentQuery("show me cards")).toBe("card-variants");
    });

    it('should detect card-variants from "card component"', () => {
      expect(parseComponentQuery("card component")).toBe("card-variants");
    });

    it('should detect card-variants from "elevated card"', () => {
      expect(parseComponentQuery("elevated card")).toBe("card-variants");
    });

    // Input detection
    it('should detect input-variants from "input field"', () => {
      expect(parseComponentQuery("input field")).toBe("input-variants");
    });

    it('should detect input-variants from "text field"', () => {
      expect(parseComponentQuery("text field")).toBe("input-variants");
    });

    it('should detect input-variants from "search box"', () => {
      expect(parseComponentQuery("search box")).toBe("input-variants");
    });

    // Chat bubble detection
    it('should detect chat-bubbles from "chat bubble"', () => {
      expect(parseComponentQuery("chat bubble")).toBe("chat-bubbles");
    });

    it('should detect chat-bubbles from "message bubble"', () => {
      expect(parseComponentQuery("message bubble")).toBe("chat-bubbles");
    });

    // Form detection
    it('should detect form-variants from "checkbox"', () => {
      expect(parseComponentQuery("show me checkbox")).toBe("form-variants");
    });

    it('should detect form-variants from "toggle switch"', () => {
      expect(parseComponentQuery("toggle switch")).toBe("form-variants");
    });

    // Edge cases
    it("should return null for empty string", () => {
      expect(parseComponentQuery("")).toBeNull();
    });

    it("should return null for unrelated query", () => {
      expect(parseComponentQuery("hello world")).toBeNull();
    });

    it("should return null for null input", () => {
      expect(parseComponentQuery(null as unknown as string)).toBeNull();
    });

    it("should be case insensitive", () => {
      expect(parseComponentQuery("SHOW ME BUTTONS")).toBe("button-variants");
      expect(parseComponentQuery("Card Variations")).toBe("card-variants");
    });
  });

  describe("getComponentResponse", () => {
    it("should return button response for button-variants", () => {
      const response = getComponentResponse("button-variants");
      expect(response).toContain("button");
      expect(response).toContain("Primary");
    });

    it("should return card response for card-variants", () => {
      const response = getComponentResponse("card-variants");
      expect(response).toContain("card");
      expect(response).toContain("Elevated");
    });

    it("should return input response for input-variants", () => {
      const response = getComponentResponse("input-variants");
      expect(response).toContain("input");
    });

    it("should return chat bubble response for chat-bubbles", () => {
      const response = getComponentResponse("chat-bubbles");
      expect(response).toContain("chat bubble");
    });

    it("should return default response for null", () => {
      const response = getComponentResponse(null);
      expect(response).toContain("component library");
    });
  });

  describe("parseComponentFull", () => {
    it("should return preset type for general button query", () => {
      const result = parseComponentFull("show me button variations");
      expect(result.type).toBe("preset");
      expect(result.componentType).toBe("button-variants");
    });

    it("should return dynamic type for specific button query", () => {
      const result = parseComponentFull("ghost button");
      expect(result.type).toBe("dynamic");
      expect(result.componentData).toBeDefined();
      expect(result.componentData?.type).toBe("button");
      expect(result.componentData?.variant).toBe("ghost");
    });

    it("should return dynamic type for login form", () => {
      const result = parseComponentFull("login form");
      expect(result.type).toBe("dynamic");
      expect(result.componentData?.type).toBe("ui-group");
    });

    it("should return fallback for unrecognized query", () => {
      const result = parseComponentFull("hello");
      expect(result.type).toBe("preset");
      expect(result.componentType).toBeUndefined();
    });
  });
});
