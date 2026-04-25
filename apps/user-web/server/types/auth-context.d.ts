declare module "h3" {
  interface H3EventContext {
    auth?: {
      userId: string;
      userRole: "admin" | "user";
      deviceId: string;
    };
  }
}

export {};
