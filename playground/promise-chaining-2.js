require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findOneAndDelete('5dc7eea5e65c8b62df48fc00').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ "complete": false });
// }).then((result) => {
//     console.log(result);  
// }).catch((e) => {
//     console.log(e);
// })

const deleteTaskAndCount = async (id) => {
    const find = await Task.findOneAndDelete(id);
    const count = await Task.countDocuments({ completed: true });
    return count;
}

deleteTaskAndCount('5dc81c352d5f0414a1ac2876').then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})