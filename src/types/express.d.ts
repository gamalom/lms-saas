import { User } from "../Database/models/model.user";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
