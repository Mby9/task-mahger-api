require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5dc6c37287aacc2de7ddb2ae', { age: 24}).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 24 });
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e)
// });

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount('5dc6c4514f50d02f0080dade', 26).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})