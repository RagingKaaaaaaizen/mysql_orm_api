const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Role = require('../_helpers/role');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }
    const user = new db.User(params);

    // hash password
    user.passwordhash = await bcrypt.hash(params.password, 10);

    // save user
    await user.save();

    async function update(id, params) {
        const user = await getUser(id);

        // validate
      const usernameChanged = user.username !== params.username;
      if (usernameChanged && (await db.User.findOne({ where: { username: params.username } }))) {
        throw 'Username "' + params.username + '" is already taken';
      }

      if (params.password) {
        user.passwordhash = await bcrypt.hash(params.password, 10);
      }

      Object.assign(user, params);
      await user.save();
    }

    async function _delete(id) {
        const user = await getUser(id);
        await user.destroy();
    }
    async function getUser(id) {
        const user = await db.User.findByPk(id);
        if (!user) throw 'User not found';
        return user;
    }
}

async function update(id, params) {
    const user = await db.User.findByPk(id);
    
    // validate
    if (!user) throw 'User not found';
    
    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
    
    return omitHash(user.get());
}

async function _delete(id) {
    const user = await db.User.findByPk(id);
    
    if (!user) throw 'User not found';
    
    await user.destroy();
}

