const path = require('path')
require('dotenv').load({path: path.resolve(__dirname, '../.env.development')})

const mongoConnect = require('../lib/mongo/connect').connect
const orderDao = require('../lib/orders/dao')
const feed = require('./feed')
const send = require('../lib/email/email.controller').send
async function main() {

    const client = await mongoConnect()
    console.log('Connected successfully to server')

    const dbName = process.env.DB_NAME || (console.error('no db'), process.exit(1))

    global.db = client.db(dbName)
    const date = new Date()

    const hours = date.getHours()

    const todayOrders = await orderDao.getOrdersByDate()

    const numOfOrders = todayOrders.length

    const thresholds = {
        "9": 5,
        "12": 10,
        "16": 15
    }

    let feedTimes = 0

    if (hours >= 16) {

        if (numOfOrders < thresholds['16']) {

            feedTimes = thresholds['16'] - numOfOrders


        }

    } else if (hours >= 12) {
        if (numOfOrders < thresholds['12']) {
            feedTimes = thresholds['12'] - numOfOrders
        }

    } else if (hours >= 9) {
        if (numOfOrders < thresholds['9']) {

            feedTimes = thresholds['9'] - numOfOrders

        }
    }


    feedTimes = Math.min(5, feedTimes)

    const shouldFeed = feedTimes > 0
    if (shouldFeed) {

        await feed(feedTimes)

i    }

    let text = `pollofeed - fed ${numOfOrders} times today.`

    if (shouldFeed) {i

        text += `\tjust fed ${feedTimes} times.`
    }
    await send({subject: text})
    console.log(`orders: ${numOfOrders}`)
    process.exit(0)

}

main()
