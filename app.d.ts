/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("@/lib").Auth;
  type DatabaseUserAttributes = {
    name: string;
    email: string;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  type DatabaseSessionAttributes = {};
}
