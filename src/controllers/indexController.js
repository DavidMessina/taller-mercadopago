const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token : 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id : 'dev_24c65fb163bf11ea96500242ac130004'
})

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },

    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },

    callback: (req, res) => {
        console.log(req.query)

        if (req.query.status.includes ('success')){
            return res.render ('success', {
                payment_type : req.query.payment_type,
                external_reference : req.query.external_reference,
                collection_id : req.query.collection_id
            })
        }

        if (req.query.status.includes ('pending')){
            return res.render ('pending')
        }

        if (req.query.status.includes ('failure')){
            return res.render ('failure')
        }
    },

    notifications : (req, res) => {
        console.log(req.body);
        res.status(200).end('ok')
    },

    comprar: (req, res) => {

        
        let item = {
            id : 1,
            picture_url : '',
            title : '',
            description : '',
            unit_price: '',
            quantity:'' 
        }

        let preference = {

            back_urls : {
                success : 'https://certifmercadopago.herokuapp.com/callback?status=success',
                pending : 'https://certifmercadopago.herokuapp.com/callback?status=pending',
                failure : 'https://certifmercadopago.herokuapp.com/callback?status=failure',
            },

            notification_url : 'https://certifmercadopago.herokuapp.com/notifications',

            auto_return : 'approved',

            payment_methods : {
                
                excluded_payment_methods : [
                
                    { id : 'visa'}
                    /*{ id : 'amex'},*/
                ],

                excluded_payment_types : [
                
                    { id : 'atm'}
                ],

                installments : 12
            },

            payer : {
                name : 'Ryan',
                surname : 'Dahl',
                email : 'test_user_63274575@testuser.com',
                phone: {
                    area_code : '11',
                    number : 55556666,                } 
                },
                address : {
                    zip_code : '1234',
                    street_name : 'Monroe',
                    street_number : 860,
                },

            external_reference : 'davidmessina9@gmail.com',



            items : [
                {

                    id : 1234,
                    title : 'Nombre del producto',
                    description : 'Dispositivo móvil de Tienda e-commerce',
                    picture_url : '',
                    category_id : '', /*Identificador de la categoría del ítem.*/
                    quantity: Number (1),
                    currency_id: 'ARS', /*Identificador de moneda en formato ISO_4217*/
                    unit_price: Number (1500) /*Precio unitario*/
 
                }
            ]
        }

        mercadopago.preferences.create(preference).then(response =>{
            global.init_point = response.body.init_point
            res.render('confirm')

        }).catch(error =>{
            console.log(error)
            res.send('error')
        })

    }
}