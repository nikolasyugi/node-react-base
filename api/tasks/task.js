//Check Everyday at 00:00:01

const handle = require('../lib/errorHandling')().handle;
const mailer = require('../emails/mailer');

module.exports = () => {
    const CronJob = require('cron').CronJob;

    //constructor(cronTime, onTick, onComplete, start, timezone, context, runOnInit, unrefTimeout) 
    // 'ss mm hh dd mm ww'
    // * => any value
    // ss => 0 to 59
    // mm => 0 to 59
    // hh => 0 to 23
    // dd => 1 to 31
    // mm => 1 to 12 or jan to dec
    // ww => 0 to 6 or sun to sat

    const job = new CronJob('01 00 00 * * *', async () => {

        console.log("Executing job at 00:00:01")

    }, null, true, 'America/Sao_Paulo');
    job.start();
}