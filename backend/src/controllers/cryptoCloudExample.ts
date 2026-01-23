import * as process from "node:process";

// каждый запрос в хедерах должен иметь
// Authorization: `Token ${process.env.CRYPTO_CLOUD_API_KEY}`,

// пример запроса на авторизацию
const url = "https://api.cryptocloud.plus/v2/invoice/create";
const headers = new Headers({
    Authorization: `Token ${process.env.CRYPTO_CLOUD_API_KEY}`,
});

fetch(url, { method: "POST", headers })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject("Auth error");
        }
    })
    .then((data) => {
        console.log("Success:", data);
    })
    .catch((error) => {
        console.error("Fail:", error);
    });
// пример ответа на авторизацию
// {
//     "status": "error",
//     "result": {
//     "authorization": "Unauthorized request."
// }
// }

// пример запроса на создание счета

const url1 = `https://api.cryptocloud.plus/v2/invoice/create`; // так же должен принимать ?locale=тут будет язык
const headers1 = new Headers({
    method: "POST",
    Authorization: `Token ${process.env.CRYPTO_CLOUD_API_KEY}`,
});

const bodyCreate = {
    shop_id: process.env.CRYPTO_CLOUD_SHOP_ID,
    amount: 15, // сумма платежа
    currency: "USD", // По умолчанию, или может принять любую из этого списка USD, UZS, KGS, KZT, AMD, AZN, BYN, AUD, 'TRY', AED, CAD, CNY, HKD, IDR, INR, JPY, PHP, SGD, THB, VND, MYR, RUB, UAH, EUR, GBP
    order_id: "", // id ордера в моей системе
    email: "test@test.test", // email пользователя
};

fetch(url1, {
    method: "POST",
    headers: headers1,
    body: JSON.stringify(bodyCreate),
})
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject("Auth error");
        }
    })
    .then((data) => {
        console.log("Success:", data);
    })
    .catch((error) => {
        console.error("Fail:", error);
    });
// пример на создание счета статус 200
// {
//     "status": "success",
//     "result": {
//     "uuid": "INV-XXXXXXXX",
//         "created": "2023-01-01 12:00:00.000000",
//         "address": "",
//         "expiry_date": "2023-01-02 12:00:00.000000",
//         "side_commission": "client",
//         "side_commission_cc": "client",
//         "amount": 100.0,
//         "amount_usd": 100.0,
//         "amount_in_fiat": 100.0,
//         "fee": 1.4,
//         "fee_usd": 1.4,
//         "service_fee": 1.9,
//         "service_fee_usd": 1.9,
//         "type_payments": "crypto",
//         "fiat_currency": "USD",
//         "status": "created",
//         "is_email_required": false,
//         "link": "https://pay.cryptocloud.plus/XXXXXXXX",
//         "invoice_id": null,
//         "currency": {
//         "id": 4,
//             "code": "USDT",
//             "fullcode": "USDT_TRC20",
//             "network": {
//             "code": "TRC20",
//                 "id": 4,
//                 "icon": "https://cdn.cryptocloud.plus/currency/crypto/TRX.svg",
//                 "fullname": "Tron"
//         },
//         "name": "Tether",
//             "is_email_required": false,
//             "stablecoin": true,
//             "icon_base": "https://cdn.cryptocloud.plus/currency/icons/main/usdt.svg",
//             "icon_network": "https://cdn.cryptocloud.plus/icons-currency/USDT-TRC20.svg",
//             "icon_qr": "https://cdn.cryptocloud.plus/currency/icons/stroke/usdt.svg",
//             "order": 1
//     },
//     "project": {
//         "id": 1,
//             "name": "TestShop",
//             "fail": "https://TestShop.com/fail",
//             "success": "https://TestShop.com/success",
//             "logo": "None"
//     },
//     "test_mode": false
// }
// }

// пример ответа на создание счета статус 400
// {
//     "status": "error",
//     "result": {
//     "amount": "amount not passed.",
//         "shop_id": "shop_id not passed."
// }
// }
// или такой
// {
//     "status": "error",
//     "result": {
//     "amount": "Invalid value amount."
// }
// }
// или такой
// {
//     "status": "error",
//     "result": {
//     "currency": "Invalid account currency specified. Available currencies 'USD', 'UZS', 'KGS', 'KZT', 'AMD', 'AZN', 'BYN', 'AUD', 'TRY', 'AED', 'CAD', 'CNY', 'HKD', 'IDR', 'INR', 'JPY', 'PHP', 'SGD', 'THB', 'VND', 'MYR', 'RUB', 'UAH', 'EUR', 'GBP'."
// }
// }

// запрос на отмену счета
const url2 = "https://api.cryptocloud.plus/v2/invoice/merchant/canceled";
const headers2 = new Headers({
    Authorization: `Token ${process.env.CRYPTO_CLOUD_API_KEY}`,
});

const bodyCancel = {
    uuid: "", // Уникальный идентификатор счета (INV-XXXXXXXX или XXXXXXXX)
};

fetch(url2, {
    method: "POST",
    headers: headers2,
    body: JSON.stringify(bodyCancel),
})
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject("Auth error");
        }
    })
    .then((data) => {
        console.log("Success:", data);
    })
    .catch((error) => {
        console.error("Fail:", error);
    });
// пример ответа статус 200
// {
//     "status": "success",
//     "result": [
//     "ok"
// ]
// }
// пример ответа статус 400
// {
//     "status": "error",
//     "result": {
//     "validate_error": "Invoice is not created"
// }
// }
// или
// {
//     "status": "error",
//     "result": {
//     "validate_error": "uuid is required"
// }
// }

// POSTBACK теперь запрос который будет приходить мне на мой бекенд (текущий проект backend)
// нужно сделать такой /api/payments/callback ендпроинт который будет обрабатывать этот postback
// postback будет в таком формате
// {
//     "status": "success",
//     "invoice_id": "XXXXXXXX",
//     "amount_crypto": 100,
//     "currency": "USDT_TRC20",
//     "order_id": "order_id",
//     "token": b"token",
//     "invoice_info": {
//     "uuid": "INV-XXXXXXXX",
//         "created": "2024-08-22 11:49:59.756692",
//         "address": "address",
//         "currency": {
//         "id": 4,
//             "code": "USDT",
//             "fullcode": "USDT_TRC20",
//             "network": {
//             "code": "TRC20",
//                 "id": 4,
//                 "icon": "https://cdn.cryptocloud.plus/currency/crypto/TRX.svg",
//                 "fullname": "Tron"
//         },
//         "name": "Tether",
//             "is_email_required": false,
//             "stablecoin": true,
//             "icon_base": "https://cdn.cryptocloud.plus/currency/icons/main/usdt.svg",
//             "icon_network": "https://cdn.cryptocloud.plus/icons-currency/USDT-TRC20.svg",
//             "icon_qr": "https://cdn.cryptocloud.plus/currency/icons/stroke/usdt.svg",
//             "order": 1
//     },
//     "date_finished": "2024-08-22 11:51:53.753528",
//         "expiry_date": "2024-08-23 11:49:59.746385",
//         "side_commission": "client",
//         "type_payments": "crypto",
//         "amount": 100,
//         "amount_": 100,
//         "status": "overpaid",
//         "invoice_status": "success",
//         "is_email_required": false,
//         "project": {
//         "id": 0,
//             "name": "My Project",
//             "fail": "",
//             "success": "",
//             "logo": ""
//     },
//     "tx_list": [
//         ""
//     ],
//         "amount_in_crypto": null,
//         "amount_in_fiat": 0.0,
//         "amount_usd": 100.0,
//         "amount_to_pay": 102.0,
//         "amount_to_pay_usd": 102.0,
//         "amount_paid": 102.0,
//         "amount_paid_usd": 102.0,
//         "fee": 1.4,
//         "fee_usd": 1.4,
//         "service_fee": 0.8048,
//         "service_fee_usd": 0.8,
//         "received": 99.7952,
//         "received_usd": 99.8,
//         "to_surcharge": 0.0,
//         "to_surcharge_usd": 0.0,
//         "total_rub": 0,
//         "step": 3,
//         "test_mode": false,
//         "type": "up",
//         "aml_enabled": false,
//         "aml_side": "merchant",
//         "aml_checks": [],
//         "links_invoice": null
// }
// }
