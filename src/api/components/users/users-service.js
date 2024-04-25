const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(searchquery, sortquery, pagenumber, pagesize) {
  const users = await usersRepository.getUsers(searchquery, sortquery);

  //handle input negatif
  if (pagenumber <= 0) {
    pagenumber = NaN;
  }
  if (pagesize <= 0) {
    pagesize = NaN;
  }

  const totalpages = Math.ceil(users.length / pagesize);
  let count = 0;

  if (pagenumber > totalpages) {
    pagenumber = totalpages;
  }

  let hasprevious = pagenumber > 1 ? true : false;
  let hasnext = pagenumber < totalpages ? true : false;

  const data = [];
  //pagenumber atau pagesize tidak valid, return semua data
  if (isNaN(pagenumber) || isNaN(pagesize)) {
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      data.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      count += 1;
    }
  } else {
    //return data sesuai page number dan page size
    const start = 0 + (pagenumber - 1) * pagesize;
    const end = pagenumber * pagesize;
    for (let i = start; i < end; i += 1) {
      if (i >= users.length) {
        break;
      }
      const user = users[i];
      data.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      count += 1;
    }
  }

  const results = {
    page_number: pagenumber,
    page_size: pagesize,
    count: count,
    total_pages: totalpages,
    has_previous_page: hasprevious,
    has_next_page: hasnext,
    data: data,
  };
  return results;
}

//fungsi untuk memproses query search
function getSearchQuery(searchquery, request) {
  const split = request.query.search.split(':', 2);
  if (split[0] === 'name') {
    searchquery.name = { $regex: split[1], $options: 'i' };
  } else if (split[0] == 'email') {
    searchquery.email = { $regex: split[1], $options: 'i' };
  }
  return searchquery;
}

//fungsi untuk memproses query sort
function getSortQuery(sortquery, request) {
  const split = request.query.sort.split(':', 2);
  if (split[0] === 'name' && split[1] == 'asc') {
    sortquery.name = 1;
  } else if (split[0] === 'name' && split[1] == 'desc') {
    sortquery.name = -1;
  } else if (split[0] === 'email' && split[1] == 'asc') {
    sortquery.email = 1;
  } else if (split[0] === 'email' && split[1] == 'desc') {
    sortquery.email = -1;
  } else {
    sortquery.email = 1;
  }
  return sortquery;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getSearchQuery,
  getSortQuery,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
