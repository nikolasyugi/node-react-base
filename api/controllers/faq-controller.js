const Faq = require('../models/Faq');
const handle = require('../lib/errorHandling')().handle;
const checkFields = require('../lib/checkFields');

module.exports = {

    async getFaqs(req, res, next) {
        const [faqs, error] = await handle(Faq.find({}).sort({ field: 'asc', name: 1 }))

        if (!error) res.json(faqs);
        else next(error);

    },

    async getFaq(req, res, next) {
        const [faq, error] = await handle(Faq.findOne({ _id: req.params.faqId }))

        if (!error) res.json(faq);
        else next(error);

    },

    async createFaq(req, res, next) {

        if (!checkFields(["question", "answer"], req.body)) return res.status(400).json({ message: "Preencha todos os campos" })

        const faq = {
            question: req.body.question,
            answer: req.body.answer,
        }

        const [faqCreated, error] = await handle(Faq.create(faq))

        if (!error) res.json(faqCreated);
        else next(error);
    },


    async updateFaq(req, res, next) {
        const [updatedFaq, error] = await handle(Faq.findByIdAndUpdate(
            req.body.id,
            {
                $set: {
                    question: req.body.question,
                    answer: req.body.answer
                }
            },
            { new: true }
        ));

        if (!error) res.json(updatedFaq);
        else next(error);
    },

    async deleteFaq(req, res, next) {
        const [, error] = await handle(Faq.deleteOne({
            _id: req.params.faqId,
        }));

        if (!error) res.json({});
        else next(error);

    }
}