export interface Country {
    currency: string
    code: string
}

const Ghana: Country = {
    currency: 'Ghanaian Cedis',
    code: 'GHS',
}
const Egypt: Country = {
    currency: 'Egyptian Pounds',
    code: 'EGP',
}
const Kenya: Country = {
    currency: 'Kenyan Shillings',
    code: 'KES',
}

const Nigeria: Country = {
    currency: 'Nigerian Nairas',
    code: 'NGN',
}

export const Countries = {
    Ghana: Ghana,
    Kenya: Kenya,
    Nigeria: Nigeria,
    Egypt: Egypt
} 