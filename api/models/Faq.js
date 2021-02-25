const mongoose = require('mongoose');
// const handle = require('../lib/errorHandling')().handle;

const FaqSchema = new mongoose.Schema({
    question: String,
    answer: String,
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    {
        timestamps: true
    });

// FaqSchema.pre('deleteOne', async function (next) {//pull faqs from user when Faq is deleted
//     let [users, err3] = await handle(mongoose.model('Research').find({ faqs: this.getQuery()._id }))
//     if (err3) next(err3)

//     if (users.length) {
//         users.forEach(async user => {
//             user.faqs.pull(this.getQuery()._id)
//             let [, err] = await handle(user.save());
//             if (err) next(err);
//         })
//     }
// })

module.exports = mongoose.model('Faq', FaqSchema);