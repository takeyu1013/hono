/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = typeof import("@/lib/lucia").auth;
  type DatabaseUserAttributes = {
    name: string;
  };
  type DatabaseSessionAttributes = Record<string, never>;
}
