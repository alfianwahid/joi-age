'use strict';

const Code = require('@hapi/code');
const Joi = require('@hapi/joi');
const Lab = require('@hapi/lab');
const JoiAge = require('..');
const Moment = require('moment');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('joi-age', () => {

    const customJoi = Joi.extend(JoiAge);

    const input21YearsAgo = Moment().add(-22, 'years').format('YYYY-MM-DD');
    const input15YearsAgo = Moment().add(-16, 'years').format('YYYY-MM-DD');
    const input9YearsAgo = Moment().add(-10, 'years').format('YYYY-MM-DD');
    const input9YearsLater = Moment().add(10, 'years').format('YYYY-MM-DD');

    it('disable default date function min(), max(), less(), and greater()', () => {

        expect(() => customJoi.date().min('now')).to.throw('customJoi.date(...).min is not a function');
        expect(() => customJoi.date().max('now')).to.throw('customJoi.date(...).max is not a function');
        expect(() => customJoi.date().less('now')).to.throw('customJoi.date(...).less is not a function');
        expect(() => customJoi.date().greater('now')).to.throw('customJoi.date(...).greater is not a function');
    });

    it('pass argument constructor', () => {

        expect(() => customJoi.date().minAge('now')).to.throw('"age" must be a number or reference');
        expect(() => customJoi.date().minAge('12')).to.throw('"age" must be a number or reference');
        expect(() => customJoi.date().minAge(12)).to.not.throw();
    });

    it('minAge()', () => {

        expect(customJoi.date().minAge(18).validate(input21YearsAgo).error).to.not.exist();
        expect(customJoi.date().minAge(18).validate(input15YearsAgo).error).to.be.an.error('"value" age must be larger than or equal to 18 years old');
        expect(customJoi.date().minAge(18).validate(input9YearsLater).error).to.be.an.error('"value" must be in the past');
    });

    it('greaterAge()', () => {

        expect(customJoi.date().greaterAge(18).validate(input21YearsAgo).error).to.not.exist();
        expect(customJoi.date().greaterAge(18).validate(input15YearsAgo).error).to.be.an.error('"value" age must be greater than 18 years old');
        expect(customJoi.date().greaterAge(18).validate(input9YearsLater).error).to.be.an.error('"value" must be in the past');
    });

    it('maxAge()', () => {

        expect(customJoi.date().maxAge(18).validate(input15YearsAgo).error).to.not.exist();
        expect(customJoi.date().maxAge(18).validate(input21YearsAgo).error).to.be.an.error('"value" age must be less than or equal to 18 years old');
        expect(customJoi.date().maxAge(18).validate(input9YearsLater).error).to.be.an.error('"value" must be in the past');
    });

    it('lessAge()', () => {

        expect(customJoi.date().lessAge(18).validate(input15YearsAgo).error).to.not.exist();
        expect(customJoi.date().lessAge(18).validate(input21YearsAgo).error).to.be.an.error('"value" age must be less than 18 years old');
        expect(customJoi.date().lessAge(18).validate(input9YearsLater).error).to.be.an.error('"value" must be in the past');
    });

    it('using together', () => {

        expect(customJoi.date().minAge(13).maxAge(18).validate(input15YearsAgo).error).to.not.exist();
        expect(customJoi.date().minAge(13).maxAge(18).validate(input9YearsAgo).error).to.be.an.error('"value" age must be larger than or equal to 13 years old');
        expect(customJoi.date().minAge(13).maxAge(18).validate(input21YearsAgo).error).to.be.an.error('"value" age must be less than or equal to 18 years old');
    });

});
