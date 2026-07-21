import Admin from "../models/Admin.model.js";

/**
 * All direct Mongoose queries for Admin live here, and nowhere else.
 * Services call these methods; they never import the Admin model directly.
 */
export const adminRepository = {
  async findByEmail(email) {
    // .select('+passwordHash') is required because the model marks this
    // field select: false by default (Architecture Doc 2) — this is the
    // one deliberate, explicit place we opt back in, specifically because
    // auth is the only place that legitimately needs the hash.
    return Admin.findOne({ email }).select("+passwordHash");
  },

  async create({ email, passwordHash }) {
    return Admin.create({ email, passwordHash });
  },

  async countAll() {
    return Admin.countDocuments();
  },
};
