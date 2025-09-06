import {body} from 'express-validator';

export const registerValidator = [
    body('username').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({min:6}),
]

export const loginValidator = [
    body('email').isEmail(),
    body('password').notEmpty(),
]

export const productCreateValidator = [
body('name').trim().notEmpty(),
body('price').isFloat({ min: 0 }),
body('stock').optional().isInt({ min: 0 }),
body('category').optional().isString(),
body('description').optional().isString(),
];


export const productUpdateValidator = [
body('name').optional().trim().notEmpty(),
body('price').optional().isFloat({ min: 0 }),
body('stock').optional().isInt({ min: 0 }),
body('category').optional().isString(),
body('description').optional().isString(),
];

export const transactionValidator = [
body('type').isIn(['sale', 'purchase']),
body('customerId').if(body('type').equals('sale')).notEmpty(),
body('vendorId').if(body('type').equals('purchase')).notEmpty(),
body('products').isArray({ min: 1 }),
body('products.*.productId').notEmpty(),
body('products.*.quantity').isInt({ min: 1 }),
body('products.*.price').isFloat({ min: 0 }),
body('date').optional().isISO8601(),
];


