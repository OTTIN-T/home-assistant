declare module "h3" {
  interface H3EventContext {
    adminAuth?: {
      userId: string;
      userRole: "admin" | "user";
    };
  }
}

export {};
