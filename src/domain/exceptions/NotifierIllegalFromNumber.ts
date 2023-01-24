export default class NotifierIllegalFromNumber extends Error {
    constructor() {
        super('Illegal SMS.RU from number');
    }
}
