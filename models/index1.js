// var { ObjectId } = require("mongodb");

// const checkMongodbObjectId = (value, helper, message) => {
//     if(ObjectId.isValid(value)) return true;

//     return helper.message(message)
// }

// const handleErrors = (res) => {
//     const details = res && res.details ? res.details : [];
//     return new Promise((resolve, reject) => {
//         reject(details.map(ele => ({
//             message: ele.message,
//             key: ele.context.key
//         })))
//     })
// }

// const validate = (schema, data) => {
//     return schema.validateAsync(data, {
//         abortEarly: false
//     }).catch(handleErrors);
// }

// module.exports = {
//     validate,
//     checkMongodbObjectId
// }
