///<reference types="mocha"/>
///<reference types="chai"/>

import { expect } from 'chai';
import Demo from '../../src/lib/ResponsiveImageSourceLoaderSpan';

describe('Demo', () => {
	let subject: Demo;

	beforeEach(function () {
		subject = new Demo();
	});

	describe('#add', () => {

		it('should add two numbers together', () => {
			let result: number = subject.add(2, 3);
			expect(result).to.equal(5);
		});

		it('should return a number', () => {
			let result: number = subject.add(2, 3);
			expect(result).to.be.a('number');
		});

	});
});
